import { readdir, readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const errors = [];
const names = new Set();

function fail(file, message) {
  errors.push(`${path.relative(root, file)}: ${message}`);
}

function proseOnly(markdown) {
  return markdown.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
}

async function checkLinks(file, skillRoot, visited = new Set()) {
  if (visited.has(file)) return;
  visited.add(file);
  const text = proseOnly(await readFile(file, 'utf8'));
  for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const href = match[1].replace(/^<|>$/g, '');
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('#')) continue;
    let target;
    try {
      target = path.resolve(path.dirname(file), decodeURIComponent(href.split('#')[0]));
      const resolved = await realpath(target);
      const relative = path.relative(skillRoot, resolved);
      if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) {
        fail(file, `local reference escapes the independently installed skill: ${href}`);
        continue;
      }
      if (!(await stat(resolved)).isFile()) {
        fail(file, `local reference is not a file: ${href}`);
        continue;
      }
      if (/\.md$/i.test(resolved)) await checkLinks(resolved, skillRoot, visited);
    } catch (error) {
      fail(file, `cannot resolve local reference ${href}: ${error.code ?? error.message}`);
    }
  }
}

const directories = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

if (!directories.length) errors.push('No skills found.');
for (const directory of directories) {
  const skillRoot = await realpath(path.join(skillsRoot, directory.name));
  const file = path.join(skillRoot, 'SKILL.md');
  let content;
  try {
    content = await readFile(file, 'utf8');
  } catch {
    fail(file, 'missing SKILL.md');
    continue;
  }
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    fail(file, 'missing YAML frontmatter');
    continue;
  }
  const parsed = parseDocument(frontmatter[1], { uniqueKeys: true });
  if (parsed.errors.length) {
    for (const error of parsed.errors) fail(file, error.message);
    continue;
  }
  const data = parsed.toJS();
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    fail(file, 'frontmatter must be a mapping');
    continue;
  }
  const { name, description } = data;
  if (typeof name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    fail(file, 'name must be a hyphenated identifier of at most 64 characters');
  }
  if (name !== directory.name) fail(file, 'name must match its directory');
  if (names.has(name)) fail(file, 'duplicate name');
  names.add(name);
  if (typeof description !== 'string' || !description.trim() || description.length > 1024 || /[<>]/.test(description)) {
    fail(file, 'description must be nonempty text, at most 1024 characters, without angle brackets');
  }
  const body = content.slice(frontmatter[0].length);
  if (!body.trim()) fail(file, 'instructions are empty');
  if (/^\s*\[TODO:[^\n]*\]\s*$/m.test(proseOnly(body))) fail(file, 'unfinished scaffold placeholder');
  await checkLinks(file, skillRoot);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${directories.length} skills: YAML, unique names, descriptions, and self-contained local references.`);
}
