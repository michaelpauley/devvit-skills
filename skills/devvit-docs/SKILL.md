---
name: devvit-docs
description: Look up official Devvit documentation, check API and configuration behavior against an app's SDK version, and cite the source when implementing or debugging Reddit apps and games.
---

# Devvit Docs

Use official documentation to resolve Devvit platform questions. Read the app's `package.json`, lockfile, `devvit.json` or legacy `devvit.yaml`, and relevant imports first so examples match its runtime. Distinguish Devvit Web client/server APIs from legacy Blocks APIs; a docs lookup does not imply an SDK upgrade or migration.

## Retrieve and search

1. Run [scripts/ensure-docs.cjs](scripts/ensure-docs.cjs) using its actual installed path and pass the **app project root** as `--project-dir`. Requires Node.js 18+ and Git with sparse checkout and partial clone support; no npm dependencies. The script retrieves Markdown/MDX from the official [`reddit/devvit-docs`](https://github.com/reddit/devvit-docs) repository, without running repository code.
2. Read the JSON result. Search each `searchRoots` entry in order with `rg`, using exact symbols and topic keywords. Read surrounding sections, prerequisites, and examples. Exclude **all** returned `excludeRoots` from recursive searches; the upstream workflow omits the generated `api/public-api` trees.
3. If a cached search misses the answer, refresh once with `--force` when network access is available. If versioned material is incomplete, search other Markdown/MDX beneath `repoDir`, preserving exclusions. Label any result from a different SDK version.
4. If the clone is unavailable, browse [developers.reddit.com/docs](https://developers.reddit.com/docs) or the official docs repository directly. Do not substitute third-party tutorials or remembered SDK signatures for verified platform behavior. Report a missing answer clearly and link the closest relevant official material.

For targeted searches, read [references/topics.md](references/topics.md). Paths there are hints; locate moved pages in the checked-out tree rather than assuming a missing path means an unsupported feature.

```bash
node /actual/installed/path/devvit-docs/scripts/ensure-docs.cjs --project-dir /path/to/app
node /actual/installed/path/devvit-docs/scripts/ensure-docs.cjs --project-dir /path/to/app --force
node /actual/installed/path/devvit-docs/scripts/ensure-docs.cjs --project-dir /path/to/app --offline
```

Script arguments:

- `--project-dir <path>`: app root for dependency version detection and default cache location; defaults to the current directory.
- `--cache-dir <path>`: optional cache base. The clone goes in its `devvit-docs` child; default is `<project-dir>/node_modules/.cache/devvit-skills`.
- `--ttl <hours>`: nonnegative freshness interval, default `24`.
- `--force`: refresh regardless of age; `--offline`: read the existing checkout without fetching. These cannot be combined.
- `--help`: show usage without changing the filesystem.

The helper writes JSON to stdout and progress to stderr. Output includes:

| Field | Meaning |
| --- | --- |
| `cacheStatus` | `cloned`, `cached`, `refreshed`, `stale` after failed refresh, or `offline` |
| `lastFetchedAt` | Last successful fetch timestamp, or `null` if unknown |
| `repoDir` / `docsRoot` | Checkout root and selected primary documentation directory |
| `searchRoots` / `excludeRoots` | Ordered search locations and directories to omit |
| `appDevvitVersion` / `matchedVersion` | Major/minor hint from a declared dependency and whether that version's docs directory exists |
| `docsRepoCommit` / `docsFileCount` | Exact source revision and number of verified Markdown/MDX files |

Version detection checks `@devvit/web`, `@devvit/client`, `@devvit/server`, `@devvit/public-api`, `@devvit/start`, then `devvit`. A declared range is a hint, not a resolved version. Check installed package metadata or the lockfile when versions differ, aliases are used, or compatibility matters. `matchedVersion: false` means current docs were selected; do not describe that result as version matched.

## Apply and cite

- Cite the actual file and section that supports the implementation. Prefer a reproducible link: `https://github.com/reddit/devvit-docs/blob/<docsRepoCommit>/<relative-file>#<section-anchor>`. Use a published docs URL when verified directly.
- Keep examples consistent with the app's imports, configuration, and SDK generation. Verify package export/type definitions in the app when signatures remain ambiguous; describe discrepancies rather than silently combining APIs.
- Separate platform requirements from this collection's personal UI conventions. Unselectable ad copy and pointer cursors are requested interaction defaults, not Devvit API requirements. Use a relevant installed ad, game, or UI skill for those conventions; this lookup skill works independently.
- Treat SDK support, feature access/allowlisting, configuration permissions, and permission to perform an external action as separate questions. Documentation does not authorize publishing, telemetry transmission, or changes to live data.
- Mention stale/offline source status when freshness affects the answer. If no source supports a claim, say what remains unverified.

## Cache troubleshooting

The cache is disposable documentation, not an app checkout. The helper refuses an unrelated repository or a cache with local changes; choose another `--cache-dir` while preserving those files. Each Git command has a 60-second timeout. A failed refresh keeps an existing readable cache and reports `stale`; a first fetch failure requires network access or direct official browsing. `--offline` requires a complete existing checkout and does not repair missing files.

Adapted from Reddit's `devvit-docs` skill. See [NOTICE.md](NOTICE.md) and [LICENSE](LICENSE).
