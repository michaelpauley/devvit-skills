const { execFileSync, spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const helper = path.resolve(__dirname, '../skills/devvit-docs/scripts/ensure-docs.cjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'devvit-docs-fixtures-'));
let checks = 0;
function run(args, expectedStatus = 0, environment = {}) {
  const result = spawnSync(process.execPath, [helper, ...args], {
    encoding: 'utf8', cwd: tmp, env: { ...process.env, ...environment },
  });
  assert.equal(result.status, expectedStatus, result.stderr);
  return result;
}
function check(name, action) { action(); checks++; process.stdout.write(`PASS ${name}\n`); }
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}
function fixture(name) {
  const cache = path.join(tmp, name);
  const repo = path.join(cache, 'devvit-docs');
  const app = path.join(tmp, name + '-app');
  fs.mkdirSync(repo, { recursive: true });
  fs.mkdirSync(app, { recursive: true });
  const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] });
  git('init');
  git('remote', 'add', 'origin', 'https://github.com/reddit/devvit-docs.git');
  write(path.join(repo, 'docs', 'guide.md'), '# Latest\n');
  write(path.join(repo, 'docs', 'api', 'redditapi', 'guide.md'), '# Reddit\n');
  write(path.join(repo, 'docs', 'api', 'public-api', 'guide.md'), '# Legacy\n');
  write(path.join(repo, 'versioned_docs', 'version-0.14', 'guide with spaces.mdx'), '# Version 0.14\n');
  write(path.join(repo, 'versioned_docs', 'version-0.14', 'api', 'public-api', 'guide.md'), '# Versioned legacy\n');
  write(path.join(repo, 'versions.json'), '["0.14"]');
  git('add', '.');
  git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Fixture docs');
  const args = ['--cache-dir', cache, '--project-dir', app, '--offline'];
  return { cache, repo, app, git, args };
}
try {
  check('help does not create a cache', () => {
    const cache = path.join(tmp, 'help');
    const out = run(['--help', '--cache-dir', cache]);
    assert.match(out.stdout, /Usage:/);
    assert.equal(fs.existsSync(cache), false);
  });
  check('invalid options fail before writes', () => {
    for (const args of [['--ttl', '-1'], ['--ttl', 'no'], ['--force', '--offline'], ['--unknown']]) run(args, 1);
    assert.equal(fs.existsSync(path.join(tmp, 'node_modules')), false);
  });
  check('offline without cache explains next action', () => {
    const out = run(['--offline', '--cache-dir', path.join(tmp, 'missing')], 1);
    assert.match(out.stderr, /No docs cache exists/);
  });
  check('unrelated cache directory is preserved', () => {
    const cache = path.join(tmp, 'unrelated');
    const note = path.join(cache, 'devvit-docs', 'important.txt');
    write(note, 'keep me');
    assert.match(run(['--offline', '--cache-dir', cache], 1).stderr, /not a Git repository/);
    assert.equal(fs.readFileSync(note, 'utf8'), 'keep me');
  });
  const f = fixture('valid');
  check('offline version selection, exclusions, missing marker, spaced paths', () => {
    write(path.join(f.app, 'package.json'), JSON.stringify({ dependencies: { '@devvit/client': '^0.14.1' } }));
    const out = JSON.parse(run(f.args).stdout);
    assert.equal(out.cacheStatus, 'offline');
    assert.equal(out.lastFetchedAt, null);
    assert.equal(out.appDevvitVersion, '0.14');
    assert.equal(out.matchedVersion, true);
    assert.equal(out.docsFileCount, 5);
    assert.equal(out.docsRoot, path.join(f.repo, 'versioned_docs', 'version-0.14'));
    assert.equal(out.searchRoots.length, 2);
    assert.equal(out.excludeRoots.length, 2);
    assert.equal(out.docsRepoCommit, f.git('rev-parse', 'HEAD').trim());
  });
  check('Blocks package version detection', () => {
    write(path.join(f.app, 'package.json'), JSON.stringify({ dependencies: { '@devvit/public-api': '~0.14.0' } }));
    assert.equal(JSON.parse(run(f.args).stdout).matchedVersion, true);
  });
  check('unmatched versions choose latest with explicit mismatch', () => {
    write(path.join(f.app, 'package.json'), JSON.stringify({ dependencies: { devvit: '^9.90.1' } }));
    const out = JSON.parse(run(f.args).stdout);
    assert.equal(out.matchedVersion, false);
    assert.equal(out.docsRoot, path.join(f.repo, 'docs'));
  });
  check('Git URL numeric fragments do not become SDK versions', () => {
    write(path.join(f.app, 'package.json'), JSON.stringify({ dependencies: { devvit: 'https://example.invalid/0.14.0' } }));
    assert.equal(JSON.parse(run(f.args).stdout).appDevvitVersion, null);
  });
  check('untracked cache additions are preserved', () => {
    const note = path.join(f.repo, 'note.txt');
    write(note, 'keep me');
    assert.match(run(f.args, 1).stderr, /local changes/);
    assert.equal(fs.readFileSync(note, 'utf8'), 'keep me');
    fs.unlinkSync(note);
  });
  check('tracked cache edits are preserved', () => {
    const guide = path.join(f.repo, 'docs', 'guide.md');
    write(guide, 'modified');
    assert.match(run(f.args, 1).stderr, /local changes/);
    assert.equal(fs.readFileSync(guide, 'utf8'), 'modified');
    f.git('checkout', '--', 'docs/guide.md');
  });
  check('failed refresh preserves clean local commits and reports stale', () => {
    const upstream = f.git('rev-parse', 'HEAD').trim();
    f.git('update-ref', 'refs/remotes/origin/main', upstream);
    const branch = f.git('branch', '--show-current').trim();
    f.git('config', `branch.${branch}.remote`, 'origin');
    f.git('config', `branch.${branch}.merge`, 'refs/heads/main');
    const guide = path.join(f.repo, 'docs', 'guide.md');
    write(guide, '# Locally committed notes\n');
    f.git('add', 'docs/guide.md');
    f.git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-m', 'Local notes');
    const localHead = f.git('rev-parse', 'HEAD').trim();
    const out = JSON.parse(run([...f.args.slice(0, -1), '--force'], 0, {
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'protocol.https.allow',
      GIT_CONFIG_VALUE_0: 'never',
    }).stdout);
    assert.equal(out.cacheStatus, 'stale');
    assert.equal(out.lastFetchedAt, null);
    assert.equal(f.git('rev-parse', 'HEAD').trim(), localHead);
    assert.equal(fs.readFileSync(guide, 'utf8'), '# Locally committed notes\n');
  });
  check('unofficial repository origin is preserved and refused', () => {
    f.git('remote', 'set-url', 'origin', 'https://example.invalid/repo');
    assert.match(run(f.args, 1).stderr, /not the official/);
    assert.equal(f.git('remote', 'get-url', 'origin').trim(), 'https://example.invalid/repo');
  });
  process.stdout.write(`${checks} fixture checks passed.\n`);
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }
