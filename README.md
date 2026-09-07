# Devvit skills

Reusable conventions for Michael Pauley's Devvit apps, interactive ads, and games. This collection adapts Reddit's [docs skill](https://github.com/reddit/devvit-skills) and extends it with focused skills grounded in the local app implementations.

The two explicit ad defaults are **nonselectable presentation text** and **pointer cursors on enabled buttons**. Inputs, editable content, copyable codes, and admin exports keep their appropriate selection behavior.

## Install with npx skills

This is a standard [`npx skills`](https://github.com/vercel-labs/skills) repository: each `skills/<name>/SKILL.md` is independently discoverable and installable. No custom installer or npm publication is required. Use a Node version supported by the CLI; the verified version, `skills@1.5.24`, requires Node **22.20 or newer**.

From the app you are building, install from this local checkout:

```bash
npx skills add /path/to/devvit-skills --list
npx skills add /path/to/devvit-skills --skill '*' --agent codex
```

After this collection is committed and pushed to `michaelpauley/devvit-skills`, the equivalent GitHub commands are:

```bash
npx skills add michaelpauley/devvit-skills --list
npx skills add michaelpauley/devvit-skills --skill '*' --agent codex
```

Omit `--agent codex` to select other supported agents. Add `--global` if you want skills available across projects. Project installation uses the current app directory; running an install inside this source repository installs into this repository instead.

Install only the areas you need, for example an ad bundle:

```bash
npx skills add michaelpauley/devvit-skills \
  --skill devvit-docs devvit-app-foundations devvit-ad-ux \
  devvit-ad-campaigns devvit-responsive-layout devvit-media \
  devvit-analytics devvit-release-qa --agent codex
```

Or a game bundle:

```bash
npx skills add michaelpauley/devvit-skills \
  --skill devvit-docs devvit-app-foundations devvit-game-loops \
  devvit-state-storage devvit-leaderboards devvit-responsive-layout \
  devvit-media devvit-release-qa --agent codex
```

Add daily puzzles, realtime, Reddit integration, analytics, or admin tools when the game uses them. Use the local path in place of the GitHub source until the files are pushed.

## Skill catalog

| Skill | Conventions and workflows covered |
| --- | --- |
| [devvit-docs](skills/devvit-docs/SKILL.md) | Official docs lookup, cached Markdown/MDX, version hints, refresh/offline status, source citations |
| [devvit-app-foundations](skills/devvit-app-foundations/SKILL.md) | Client/server/shared boundaries, installed SDK, API validation, configuration, build inputs, lightweight launch screens |
| [devvit-ad-ux](skills/devvit-ad-ux/SKILL.md) | Nonselectable creative copy, pointer buttons, selection exceptions, nondraggable art, image controls, hit areas, focus, pressed/disabled states, duplicate taps |
| [devvit-ad-campaigns](skills/devvit-ad-campaigns/SKILL.md) | Brand/font/asset consistency, intro-choice-result flows, product/CTA mappings, approved links, attribution, countdowns and expired states |
| [devvit-responsive-layout](skills/devvit-responsive-layout/SKILL.md) | Portrait/wide compositions, artboard scaling, short viewports, container measurement, safe areas, keyboard layout, feed scroll, overlay hit testing |
| [devvit-media](skills/devvit-media/SKILL.md) | Asset delivery, first-tap readiness, preloading, audio unlock/mute, video fallback, visibility cleanup, reduced motion, stacked MP4 alpha stickers |
| [devvit-game-loops](skills/devvit-game-loops/SKILL.md) | State transitions, pure rules, legal moves, physics/timing, win/loss, saving results, replay, interruptions, optional resume |
| [devvit-daily-puzzles](skills/devvit-daily-puzzles/SKILL.md) | Puzzle/date/post identities, release-hour boundaries, scheduler retries, old posts, archives, content versions, streak eligibility, missing puzzles |
| [devvit-state-storage](skills/devvit-state-storage/SKILL.md) | Redis scoping, stable keys, persistence, transactions, duplicate operations, recoverable partial writes, retention, migrations and history |
| [devvit-leaderboards](skills/devvit-leaderboards/SKILL.md) | Score validation modes, accepted attempts, personal bests, metric-specific boards, ties, ranks, pagination, accurate statistics |
| [devvit-realtime](skills/devvit-realtime/SKILL.md) | Durable snapshots, event ordering, reconnect/resync, presence expiry, scoped channels, committed updates and subscription cleanup |
| [devvit-analytics](skills/devvit-analytics/SKILL.md) | Event contracts, counting units, start/completion/CTA metrics, dedupe, duration, bounded aggregates, disabled trackers, optional Journeys |
| [devvit-reddit-integration](skills/devvit-reddit-integration/SKILL.md) | Custom posts, menus/forms, navigation, result sharing, explicit comment/subscription actions, attribution, retry behavior |
| [devvit-admin-tools](skills/devvit-admin-tools/SKILL.md) | Admin entrances, server authorization, post/date scope, dashboards, CSV/JSON/clipboard export, configuration and bounded resets |
| [devvit-release-qa](skills/devvit-release-qa/SKILL.md) | Repository checks, rendered UX, cold media, rollover/concurrency tests, real Reddit playtest, permissions and accurate handoff |

Examples after installation:

```text
Use devvit-ad-ux and devvit-ad-campaigns to polish this branded quiz's result screen.
Use devvit-daily-puzzles and devvit-leaderboards to fix rollover and duplicate results.
Use devvit-media to adapt our transparent sticker animation for mobile playback.
Use devvit-release-qa to verify this build before the campaign handoff.
```

Skill descriptions support automatic selection as well as explicit invocation. Installing the full set does not require loading every skill on every task. Companion skills are optional; supporting references stay inside their owning skill so individual installs work.

## Where the conventions come from

The collection distinguishes explicit user preferences, recurring code patterns, current platform requirements, and recommended safeguards. [The source map](docs/provenance.md) records the inspected projects and important limits of the evidence. It uses available local repositories, not claimed access to a complete past-chat history.

Source apps include the HFTF campaigns and E*TRADE, LETTERSET, Sandwords, Karma Claw, Karma Crunch, Reddictionary, Redd Libs, and Syllacrostic. Existing prototypes are evidence of a pattern, not proof that every implementation is complete or correct. Campaign-specific identities, assets, destinations, and payloads are not copied into the skills.

Payments, push notifications, external service integrations, and other optional features are not made universal app requirements. Use current docs when a task calls for them; add a dedicated skill when there is a concrete workflow to preserve.

## Maintain and verify

Installing skills does **not** require this development setup. To edit and validate the collection itself:

```bash
npm ci
npm run validate
npm run skills:list
```

The validator checks YAML metadata, unique names, and that local documentation links remain inside each independently installable skill. CLI discovery checks compatibility with the pinned framework version. Script and behavior checks are described in [validation notes](docs/validation.md).

Keep entrypoints focused, move substantial optional procedures into linked references, and update the source map when a new convention is observed. Confirm platform APIs against installed SDK types and current official docs. Do not bake an old template's versions or an advertiser's settings into global defaults.

The adapted docs skill retains Reddit's BSD-3-Clause license and attribution. See [third-party notices](THIRD_PARTY_NOTICES.md).
