#!/usr/bin/env node

/**
 * Ensures reddit/devvit-docs is cloned locally and reasonably fresh.
 * Cross-platform (Windows, Linux, macOS) — Node.js built-ins + git only.
 * Adapted from reddit/devvit-skills; see ../LICENSE and ../NOTICE.md.
 */

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { parseArgs } = require("node:util");

const REPO_URL = "https://github.com/reddit/devvit-docs.git";
const DEFAULT_TTL_HOURS = 24;
const PUBLIC_API_PATH = ["api", "public-api"];
const SPARSE_DOC_PATTERNS = [
  "/docs/**/*.md",
  "/docs/**/*.mdx",
  "/versioned_docs/**/*.md",
  "/versioned_docs/**/*.mdx",
  "/versions.json",
];
const DOC_FILE_PATTERN = /\.(?:md|mdx)$/i;

function readOptions(argv) {
  const { values } = parseArgs({
    args: argv.slice(2),
    options: {
      force: { type: "boolean", default: false },
      offline: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
      ttl: { type: "string", default: String(DEFAULT_TTL_HOURS) },
      "project-dir": { type: "string", default: process.cwd() },
      "cache-dir": { type: "string" },
    },
    strict: true,
  });

  const ttlHours = Number(values.ttl);
  if (!Number.isFinite(ttlHours) || ttlHours < 0) {
    throw new Error("--ttl must be a non-negative number of hours.");
  }
  if (values.force && values.offline) {
    throw new Error("--force and --offline cannot be used together.");
  }

  return {
    force: values.force,
    offline: values.offline,
    help: values.help,
    ttlHours,
    projectDir: path.resolve(values["project-dir"]),
    cacheDir: values["cache-dir"] ? path.resolve(values["cache-dir"]) : null,
  };
}

function createLayout(options) {
  const cacheDir =
    options.cacheDir ||
    path.join(options.projectDir, "node_modules", ".cache", "devvit-skills");
  const repoDir = path.join(cacheDir, "devvit-docs");
  const docsDir = path.join(repoDir, "docs");

  return {
    cacheDir,
    repoDir,
    markerPath: path.join(cacheDir, ".devvit-docs-fetched"),
    packagePath: path.join(options.projectDir, "package.json"),
    docsDir,
    versionedDocsDir: path.join(repoDir, "versioned_docs"),
    redditApiDir: path.join(docsDir, "api", "redditapi"),
    publicApiDir: path.join(docsDir, ...PUBLIC_API_PATH),
  };
}

function log(message) {
  process.stderr.write(`[devvit-docs] ${message}\n`);
}

function formatError(error) {
  const stderr = error?.stderr ? String(error.stderr).trim() : "";
  return stderr || error?.message || String(error);
}

function git(...args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 60_000,
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  }).trim();
}

function tryGit(...args) {
  try {
    return git(...args);
  } catch {
    return null;
  }
}

function canonicalPath(value) {
  const normalizeCase = (resolved) =>
    process.platform === "win32" ? resolved.toLowerCase() : resolved;

  try {
    return normalizeCase(fs.realpathSync(value));
  } catch {
    return normalizeCase(path.resolve(value));
  }
}

function isGitRepo(dir) {
  const topLevel = tryGit("-C", dir, "rev-parse", "--show-toplevel");
  return topLevel !== null && canonicalPath(topLevel) === canonicalPath(dir);
}

function configureSparseDocs(repoDir) {
  git("-C", repoDir, "sparse-checkout", "init", "--no-cone");
  git(
    "-C",
    repoDir,
    "sparse-checkout",
    "set",
    "--no-cone",
    ...SPARSE_DOC_PATTERNS,
  );
}

function cloneRepo(targetDir) {
  git(
    "clone",
    "--depth",
    "1",
    "--filter=blob:none",
    "--no-checkout",
    REPO_URL,
    targetDir,
  );
  configureSparseDocs(targetDir);
  git("-C", targetDir, "checkout");
}

function removeQuietly(target) {
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch (error) {
    log(`Cleanup failed for ${target}: ${formatError(error)}`);
  }
}

function createFreshClone(layout) {
  const suffix = `${process.pid}-${Date.now()}`;
  const tempDir = path.join(layout.cacheDir, `devvit-docs.tmp-${suffix}`);

  try {
    cloneRepo(tempDir);
    if (fs.existsSync(layout.repoDir)) {
      throw new Error("The cache path appeared during the clone. Rerun to use or inspect it.");
    }
    fs.renameSync(tempDir, layout.repoDir);
  } catch (error) {
    removeQuietly(tempDir);
    throw error;
  }
}

function refreshRepo(layout) {
  try {
    git("-C", layout.repoDir, "pull", "--ff-only");
    return "refreshed";
  } catch {
    // A clean cache may still contain committed local work. Never replace it.
    log("Pull failed - preserving and using the existing cache.");
    return "stale";
  }
}

function isStale(markerPath, ttlHours) {
  try {
    const timestamp = Number(fs.readFileSync(markerPath, "utf8").trim());
    return !timestamp || Date.now() - timestamp > ttlHours * 3_600_000;
  } catch {
    return true;
  }
}

function markFresh(markerPath) {
  fs.writeFileSync(markerPath, String(Date.now()), "utf8");
}

function lastFetchedAt(markerPath) {
  try {
    const timestamp = Number(fs.readFileSync(markerPath, "utf8"));
    return Number.isFinite(timestamp) && timestamp > 0
      ? new Date(timestamp).toISOString()
      : null;
  } catch {
    return null;
  }
}

function ensureRepo(layout, options) {
  const cacheExists = fs.existsSync(layout.repoDir);

  if (!cacheExists) {
    if (options.offline) throw new Error("No docs cache exists. Run once with network access first.");
    log("Cloning docs...");
    createFreshClone(layout);
    markFresh(layout.markerPath);
    return "cloned";
  }

  if (!isGitRepo(layout.repoDir)) {
    throw new Error("The cache path already exists and is not a Git repository. Choose another --cache-dir.");
  }
  const origin = tryGit("-C", layout.repoDir, "remote", "get-url", "origin");
  if (![REPO_URL, REPO_URL.replace(/\.git$/, "")].includes(origin)) {
    throw new Error("The cache origin is not the official reddit/devvit-docs HTTPS repository. Choose another --cache-dir.");
  }
  // Do not consult .gitignore blobs outside a partial checkout: Git may fetch them.
  const changedTrackedFiles = git("-C", layout.repoDir, "status", "--porcelain", "--untracked-files=no");
  const untrackedFiles = git("-C", layout.repoDir, "ls-files", "--others", "--directory");
  if (changedTrackedFiles || untrackedFiles) {
    throw new Error("The docs cache has local changes. Preserve them and choose another --cache-dir.");
  }

  // Offline mode reads the verified checkout without triggering partial-clone fetches.
  if (options.offline) return "offline";

  // Reapply the canonical patterns so existing caches pick up additions.
  configureSparseDocs(layout.repoDir);

  if (!options.force && !isStale(layout.markerPath, options.ttlHours)) {
    log("Cache fresh — skipping fetch.");
    return "cached";
  }

  log(
    options.force ? "Force-pulling docs..." : "Cache stale — pulling docs...",
  );
  const cacheStatus = refreshRepo(layout);
  if (cacheStatus !== "stale") markFresh(layout.markerPath);
  return cacheStatus;
}

function uniqueExistingDirs(dirs) {
  const seen = new Set();
  return dirs.filter((dir) => {
    if (!dir || !fs.existsSync(dir)) return false;

    const resolved = path.resolve(dir);
    if (seen.has(resolved)) return false;

    seen.add(resolved);
    return true;
  });
}

function isSameOrWithin(child, parent) {
  const relative = path.relative(parent, child);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

function validateDocsCheckout(repoDir) {
  const trackedDocs = git(
    "-C",
    repoDir,
    "ls-tree",
    "-r",
    "-z",
    "--name-only",
    "HEAD",
    "--",
    "docs",
    "versioned_docs",
  )
    .split("\0")
    .filter((trackedPath) => DOC_FILE_PATTERN.test(trackedPath));

  if (trackedDocs.length === 0) {
    throw new Error("The docs repository contains no Markdown files.");
  }

  const missingDocs = trackedDocs.filter(
    (trackedPath) => !fs.existsSync(path.join(repoDir, trackedPath)),
  );
  if (missingDocs.length > 0) {
    throw new Error(
      `Sparse checkout is missing ${missingDocs.length} tracked documentation file(s), including ${missingDocs
        .slice(0, 3)
        .join(", ")}.`,
    );
  }
  return trackedDocs.length;
}

function detectVersion(packagePath) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const dependencies = { ...pkg.devDependencies, ...pkg.dependencies };
    const declaredVersion =
      dependencies["@devvit/web"] ||
      dependencies["@devvit/client"] ||
      dependencies["@devvit/server"] ||
      dependencies["@devvit/public-api"] ||
      dependencies["@devvit/start"] ||
      dependencies.devvit ||
      "";
    // Only a semver-shaped declaration is a useful hint; URLs/catalog aliases are not.
    const match = String(declaredVersion).match(/^[~^=\s]*(\d+)\.(\d+)(?:\.|$)/);
    return match ? `${match[1]}.${match[2]}` : null;
  } catch {
    return null;
  }
}

function selectDocsRoot(layout, version) {
  const versionedRoot = version
    ? path.join(layout.versionedDocsDir, `version-${version}`)
    : null;
  const matchedVersion = Boolean(versionedRoot && fs.existsSync(versionedRoot));

  return {
    docsRoot: matchedVersion ? versionedRoot : layout.docsDir,
    matchedVersion,
  };
}

function getVersionedPublicApiRoots(layout) {
  try {
    return fs
      .readdirSync(layout.versionedDocsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) =>
        path.join(layout.versionedDocsDir, entry.name, ...PUBLIC_API_PATH),
      );
  } catch {
    return [];
  }
}

function resolveSearchPaths(layout, docsRoot) {
  const searchRoots = uniqueExistingDirs([
    docsRoot,
    isSameOrWithin(layout.redditApiDir, docsRoot) ? null : layout.redditApiDir,
  ]);
  const excludeRoots = uniqueExistingDirs([
    layout.publicApiDir,
    path.join(docsRoot, ...PUBLIC_API_PATH),
    ...getVersionedPublicApiRoots(layout),
  ]);

  return { searchRoots, excludeRoots };
}

function main() {
  const options = readOptions(process.argv);
  if (options.help) {
    process.stdout.write("Usage: node ensure-docs.cjs [--force | --offline] [--ttl <hours>] [--project-dir <path>] [--cache-dir <path>]\nRequires Node.js 18+ and Git with sparse checkout/partial clone support.\n");
    return;
  }
  const layout = createLayout(options);

  fs.mkdirSync(layout.cacheDir, { recursive: true });

  const cacheStatus = ensureRepo(layout, options);
  const docsFileCount = validateDocsCheckout(layout.repoDir);

  const appDevvitVersion = detectVersion(layout.packagePath);
  const docsSelection = selectDocsRoot(layout, appDevvitVersion);
  const searchPaths = resolveSearchPaths(layout, docsSelection.docsRoot);

  process.stdout.write(
    `${JSON.stringify(
      {
        cacheStatus,
        lastFetchedAt: lastFetchedAt(layout.markerPath),
        docsRoot: docsSelection.docsRoot,
        repoDir: layout.repoDir,
        searchRoots: searchPaths.searchRoots,
        excludeRoots: searchPaths.excludeRoots,
        matchedVersion: docsSelection.matchedVersion,
        appDevvitVersion,
        docsRepoCommit: tryGit("-C", layout.repoDir, "rev-parse", "HEAD"),
        docsFileCount,
      },
      null,
      2,
    )}\n`,
  );
}

try {
  main();
} catch (error) {
  process.stderr.write(`[devvit-docs] Error: ${formatError(error)}\n`);
  process.exitCode = 1;
}
