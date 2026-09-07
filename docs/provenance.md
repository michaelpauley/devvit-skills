# Convention source map

Reviewed on 2026-09-07. This is an inventory of available local project evidence, not a claim of exhaustive memory of every previous app or conversation. Paths are relative to each named source repository and serve as provenance; installed skills do not depend on those repositories being present.

## How to interpret the guidance

| Kind | Meaning |
| --- | --- |
| Explicit preference | The user requested nonselectable ad presentation text and pointer cursors on buttons. These are the ad defaults, with functional input/copy exceptions. |
| Observed pattern | A reusable approach found in the inspected source. Its applicability depends on the new app. |
| Platform requirement | Checked against current official Devvit documentation. Installed SDK types and current documentation should be checked again when implementing. |
| Recommended safeguard | A correctness or usability improvement motivated by the observed flow. It is not a claim that every past implementation already had that protection. |

Project-specific release hours, usernames, destinations, campaign IDs, asset files, thresholds, or data payloads are not portable defaults. The source map records filenames and behavior without redistributing application source or campaign assets. Source AGENTS files supplied project context; their instructions were not adopted as this repository's policy.

## Ads and branded interactions

| Convention | Representative source evidence | Skill |
| --- | --- | --- |
| No selection and explicit pointer cursors | `hftf-mcds/src/client/index.css`; corroborated by Samsung, Vital Farms, and Levi's client CSS | `devvit-ad-ux` |
| Copyable admin output exception | `hftf-levis/src/client/index.css` | `devvit-ad-ux`, `devvit-admin-tools` |
| Image buttons, pressed assets, accessible names, duplicate-tap guards, timer cleanup | `hftf-mcds/src/client/components/ImageButton.tsx`, `PrimaryButton.tsx` | `devvit-ad-ux` |
| Nondraggable art and decorative layers that pass taps through | `hftf-mcds/src/client/components/MapScreen.tsx`; `hftf-seph/src/client/components/CtaScreen.tsx`; `151-reddit-etrade/src/client/components/AppHeader.tsx` | `devvit-ad-ux`, `devvit-responsive-layout` |
| Brand fonts, deliberate crops, result/product artwork, narrow/wide composition | `hftf-seph/src/client/components/CtaScreen.tsx` | `devvit-ad-campaigns` |
| Shared campaign copy and selection-dependent CTA destinations | `hftf-levis/src/shared/postconfig.ts`, `src/client/components/OutfitBuilderFlow.tsx` | `devvit-ad-campaigns` |
| Timestamp countdown and distinct scene/CTA actions | `hftf-apple/src/client/splash.tsx` | `devvit-ad-campaigns` |
| Typed event contract and aggregate dimensions | `hftf-mcds/src/client/lib/analytics.ts`, `src/shared/api.ts`, `src/server/analytics-aggregate.ts` | `devvit-analytics` |
| Per-post counters, hourly windows, retention | `hftf-apple/src/server/routes/api.ts`, `src/client/hooks/useAnalytics.ts` | `devvit-analytics` |
| Session-counting intent and duration sum/count reporting | `hftf-levis/analytics/README.md`, `src/server/routers/vote.ts` | `devvit-analytics` |
| Tracker disabled pending flood protection | `151-reddit-etrade/src/client/analytics.ts` | `devvit-analytics` |

## Layout, media, and platform integration

| Convention | Representative source evidence | Skill |
| --- | --- | --- |
| Client/server/shared split, HTML launch/game entrypoints, Devvit navigation, registered menu routes | `hftf-apple/AGENTS.md`, `151-reddit-etrade/AGENTS.md`, `Sandwords/AGENTS.md`, and their source/configuration | `devvit-app-foundations` |
| Aspect-aware compositions | `redd-libs/src/client/hooks/useIsWideAspect.ts`; equivalent hooks in `hftf-fd-3` and E*TRADE | `devvit-responsive-layout` |
| Authored scene scaling and visual viewport observation | `hftf-rm-test/src/client/hooks/useStageScale.ts` | `devvit-responsive-layout` |
| Container measurement, reduced motion, safe areas, visibility-aware playback | `Sandwords/src/client/splash.tsx`, `src/client/index.css` | `devvit-responsive-layout`, `devvit-media` |
| Small prebuffered sticker pool and single-stream color/mask compositing | `hftf-apple/skill.md`, `src/client/components/AlphaMaskedVideo.tsx`, `src/client/splash.tsx` | `devvit-media` |
| First-gesture audio preparation and media preload hooks | `Sandwords/src/client/audio.ts`; `hftf-rm-test/src/client/audio.ts`, `src/client/hooks/usePreloadVideo.ts` | `devvit-media` |
| Hidden admin entrance and server-authorized reporting | `hftf-apple/src/client/splash.tsx`, `src/server/routes/api.ts`; `Sandwords/src/client/splash.tsx`, `src/server/routes/admin.ts` | `devvit-admin-tools` |
| Selected-scope JSON/clipboard reporting and username export | `hftf-apple/src/client/components/AnalyticsModal.tsx`; `Sandwords/src/client/admin.tsx` | `devvit-admin-tools` |
| Builder, completion record, explicit comment and community subscription | `redd-libs/src/client/BuilderApp.tsx`, `src/client/game.tsx`, `src/server/routes/api.ts`, `src/server/storage.ts` | `devvit-reddit-integration` |
| Configurable post-creation form and post snapshot | `photo-review/src/server/routers/menu.ts`, `src/utils/snapshot.ts` | `devvit-app-foundations`, `devvit-reddit-integration` |
| Type/lint/build scripts with distinct upload/publish side effects; boundary tests | `hftf-apple/package.json`, `Sandwords/package.json`, `Sandwords/src/server/core/roundTime.test.ts` | `devvit-release-qa` |

## Games, daily content, and shared state

| Convention | Representative source evidence | Skill |
| --- | --- | --- |
| Pure rules/reducer and explicit run transitions | `devvit-letterset/src/client/engine/reducer.ts`, `rules.ts`, `src/client/App.tsx` | `devvit-game-loops` |
| Phased claw motion, physics playfield, animation teardown | `karma-claw/src/client/components/ClawController.tsx`, `PhysicsSnooBallZone.tsx` | `devvit-game-loops` |
| Client visual physics separated from accepted community contributions | `Sandwords/src/client/pilePhysics.ts`, `src/server/core/round.ts` | `devvit-game-loops`, `devvit-realtime` |
| Publication-hour logical day, archive filtering, daily streak eligibility | `devvit-letterset/src/server/data/dailyDate.ts`, `src/server/routers/results.ts` | `devvit-daily-puzzles` |
| Shared scheduled/manual daily post creation | `devvit-letterset/src/server/core/dailyPost.ts`, `src/server/routers/schedule.ts` | `devvit-daily-puzzles` |
| UTC windows, post reuse/reservation, finalization, durable round snapshots | `Sandwords/src/server/core/roundTime.ts`, `roundTime.test.ts`, `round.ts` | `devvit-daily-puzzles`, `devvit-state-storage` |
| Daily/themed puzzle families, old-post metadata, archives and completion indexes | `reddit-syllacrostic/game_maintenance/docs/MenuActionsSchedulesKeys.md` | `devvit-daily-puzzles`, `devvit-state-storage` |
| Stable scoped/versioned key builders | `devvit-letterset/src/server/keys.ts`; `Sandwords/src/server/core/roundKeys.ts`; `redd-libs/src/server/storage.ts` | `devvit-state-storage` |
| Legacy post/history preservation through migrations | `karma-crunch-v2/README.md`; `reddictionary/src/server/core/redis-keys.ts`, `dictionary.ts` | `devvit-state-storage` |
| Explicit client-reported validation mode, plausibility checks, attempt finalization, ranked categories | `devvit-letterset/src/server/routers/results.ts` | `devvit-leaderboards` |
| Collectible inventories and scoreboards | `karma-claw/src/server/index.ts` | `devvit-game-loops`, `devvit-leaderboards` |
| Bounded ranking reads and accepted contribution accounting | `Sandwords/src/server/core/round.ts` | `devvit-leaderboards` |
| Time-based ranking and personal statistics | `reddit-syllacrostic/syllacrostic/src/api/leaderboard.ts` | `devvit-leaderboards` |
| Typed events, refresh on connection, subscription teardown, visibility-aware heartbeats, server-time presence expiry | `Sandwords/src/shared/api.ts`, `src/client/splash.tsx`, `src/server/core/round.ts` | `devvit-realtime` |

## Important limits and deliberate improvements

- LETTERSET records run-start metadata, but the reviewed flow does not establish durable mid-run board restoration. Resume and deterministic replay are options to implement when needed, not recalled universal features.
- LETTERSET explicitly labels some results `client_reported`. Plausibility bounds and dictionary checks are not proof that the reported gameplay occurred. Karma Claw's historical payload handling is also not a template for authoritative scoring.
- Some LETTERSET alternate boards update inside a best-score gate. The leaderboard skill asks whether each metric needs its own winning attempt rather than carrying that coupling into every game.
- A client ref can prevent a local duplicate without ensuring server uniqueness. Levi's session-counting intent motivates stronger dedupe where the reported metric promises it.
- A detached Redis write after an HTTP response is not a durable queue. The analytics skill uses the awaited-write pattern and describes best-effort client delivery honestly.
- E*TRADE's disabled tracker should stay disabled until its stated protection work is addressed. Existing disabled code is not an invitation to turn tracking on.
- Sandwords' IDs and reconnect fetches motivate revision/resynchronization safeguards. A full monotonic revision protocol was not established by the reviewed implementation. Maximum-counter reconciliation cannot handle resets or decreasing presence.
- A day/post index and timed reservation do not make external Reddit post creation exactly once. The publication reference adds bounded reconciliation after partial failures.
- The Apple media notes provide the stacked-video technique. Their claims that preload forces decoding and guarantees zero latency are not carried forward: preload is advisory and readiness must be measured.
- Some source files are old templates. `karma-dex` is largely a Phaser starter, `slop-shop` contains a separate generation workflow, and `syllacrostic-app` is React Native/Expo. These were not treated as evidence for universal Devvit implementation rules. Legacy Syllacrostic informs product conventions, not new SDK imports.

## Official sources

The adapted docs skill comes from [`reddit/devvit-skills` at `71ce34c6`](https://github.com/reddit/devvit-skills/tree/71ce34c6bec0d6f7c2f2c4cb7d70c509013bcbae). Its [notice](../skills/devvit-docs/NOTICE.md) describes the adaptation. The installation layout and commands were checked against the [skills CLI](https://github.com/vercel-labs/skills) and exercised with version 1.5.24.

Platform details were checked against the official [docs index](https://developers.reddit.com/docs/llms.txt), [Web overview](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview), [view modes](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points), [navigation](https://developers.reddit.com/docs/capabilities/client/navigation), [Redis](https://developers.reddit.com/docs/capabilities/server/redis), [scheduler](https://developers.reddit.com/docs/capabilities/server/scheduler), [realtime](https://developers.reddit.com/docs/capabilities/realtime/overview), [user actions](https://developers.reddit.com/docs/capabilities/server/userActions), [Journeys](https://developers.reddit.com/docs/capabilities/analytics/devvit-journeys), and linked capability pages in each skill. Exact numerical limits and mixed-generation imports are intentionally resolved at use time.
