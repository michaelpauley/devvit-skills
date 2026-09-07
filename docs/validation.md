# Validation notes

Verified on 2026-09-07 with Node 22.23.2 and the pinned `skills` CLI 1.5.24. The repository's development commands require Node 22.20 or newer. Installation through `npx skills` does not require building or publishing an npm package.

## Repeatable repository checks

```bash
npm ci
npm run validate
npm run test:docs
npm run skills:list
```

- `validate` checks all 15 skills for valid YAML metadata, unique directory-matching names, nonempty descriptions, and resolvable local links within each skill's installation boundary.
- `test:docs` exercises the documentation helper with temporary Git fixtures and no remote network calls. It checks version/exclusion selection, filenames with spaces, invalid options, missing caches, preservation of unrelated/untracked/edited/locally committed content, stale reporting after failed refresh, and refusal of an unrelated origin.
- `skills:list` uses the actual framework to discover and list the collection without installing it.

All 15 skills also passed the bundled skill-creator `quick_validate.py` during authoring. That external validator is not required for normal use or the repository checks above.

## Additional checks performed during authoring

The docs helper fetched and refreshed the official `reddit/devvit-docs` repository, then read the same cache in offline mode. The verified revision was `dac6e8ec8d88ee9e6272b96d7bbcfc8b0b453e9e`, containing 2,982 Markdown/MDX files. Its status distinguishes live fetches, cached/offline reads, and a stale cache after failed refresh. This is a verification snapshot, not a promise that the remote repository remains at that revision.

A single `devvit-docs` installation was copied into a temporary project with the real skills CLI. Its helper, local references, license, and notice traveled with it. The installed helper was exercised against the docs cache. Individual installs do not need the rest of the collection.

An independent agent applied `devvit-ad-ux` to an isolated HTML/CSS ad fixture containing an image CTA, disabled controls, a nested copyable coupon, a textarea, and a decorative overlay. Chrome passed 20 checks covering computed selection and cursor behavior, nondraggable art, disabled and pending guards, repeated activation, native Tab focus, native Enter activation, and real textarea editing. The skill needed no correction from this exercise.

An independent review of the shared app skills prompted two corrections: answer secrecy now depends on the puzzle's trust model, and score-sharing guidance preserves the documented custom-message exception for top-level comments. A helper review also prompted preserving existing documentation checkouts on a failed pull, including clean local commits.

## Limits

These checks validate the skill package, helper behavior, and a representative browser outcome. They do not establish that an app built later from these instructions has passed Reddit host, mobile touch, permissions, real CTA navigation, or production load testing. Each app should exercise the relevant checks in `devvit-release-qa`.

No source app was changed or published during this work. GitHub-source installation becomes available after the collection is committed and pushed; local-path installation is available immediately.
