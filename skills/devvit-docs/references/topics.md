# Devvit documentation search map

Read only the row relevant to the task, then fetch current docs using the skill's helper. These paths were checked against official docs revision [`dac6e8ec8d88ee9e6272b96d7bbcfc8b0b453e9e`](https://github.com/reddit/devvit-docs/tree/dac6e8ec8d88ee9e6272b96d7bbcfc8b0b453e9e) on 2026-09-07. They are discovery hints, not a frozen API reference. Begin with the corresponding path under the selected versioned root when available, and fall back to `docs/` with an explicit version caveat.

All paths below are relative to the official repository's `docs/` directory.

| Task | Where to look | Search terms |
| --- | --- | --- |
| Runtime boundaries and project layout | `capabilities/devvit-web/devvit_web_overview.mdx`; `capabilities/client/overview.mdx`; `capabilities/server/overview.md` | `@devvit/client`, `@devvit/server`, client, server, limitations |
| App configuration, routes, entrypoints, assets, permissions | `capabilities/devvit-web/devvit_web_configuration.md` | `devvit.json`, entrypoints, server, permissions, media, forms, scheduler |
| Inline/expanded views, launch behavior, splash migration | `capabilities/server/launch_screen_and_entry_points/`; `guides/migrate/inline-web-view.md` | `requestExpandedMode`, view mode, entrypoint, launch, splash |
| Ad CTAs and navigation | `capabilities/client/navigation.mdx`; `capabilities/devvit-web/devvit_web_configuration.md` | `navigateTo`, external, URL, gesture, domains |
| UI input, forms, menu actions, toasts | `capabilities/client/forms.mdx`; `capabilities/client/menu-actions.mdx`; `capabilities/client/toasts.mdx` | `showForm`, menu, submit, toast |
| Scores, leaderboards, cooldowns, persistence | `capabilities/server/redis.mdx`; `capabilities/server/post-data.mdx`; `capabilities/server/cache-helper.md` | sorted sets, transactions, expiration, post data, cache |
| Shared games and realtime updates | `capabilities/realtime/overview.md` | channel, subscribe, message, limits |
| Post creation, previews, sharing, Reddit data | `capabilities/creating_custom_post.md`; `capabilities/server/reddit-api.mdx`; `api/redditapi/` | `submitCustomPost`, post data, thumbnail, preview, RedditClient |
| Logged-out play, identity, login, sharing | `guides/logged-out-users.mdx` | `context.userId`, `showLoginPrompt`, `getShareData`, reload |
| Secrets, campaign settings, external services | `capabilities/server/settings-and-secrets.mdx`; `capabilities/server/http-fetch.mdx`; `capabilities/server/external-endpoints.mdx` | settings, secret, scope, HTTP, allowlist, endpoint |
| Scheduled rounds, daily content, triggers | `capabilities/server/scheduler.mdx`; `capabilities/server/triggers.mdx` | cron, job, schedule, AppInstall, AppUpgrade |
| Game telemetry and analytics | `capabilities/analytics/devvit-journeys.md`; `capabilities/analytics/journeys-dashboard.md` | readiness, journey, telemetry, permissions, allowlist, completion |
| Test tools, local preview, playtest, logs | `guides/tools/` | devvit test, simulator, playtest, logs, CLI |
| Publishing, review, current restrictions | `guides/launch/launch-guide.md`; `devvit_rules.md`; `changelog.md` | publish, review, install, restrictions, deprecation |
| Legacy Blocks or SDK migration | `guides/migrate/public-api.md`; `guides/migrate/public-api/`; versioned docs | `@devvit/public-api`, Blocks, migration, configuration |

For ad behavior not covered in public docs, inspect the current project's documented integration and supplied campaign requirements. Do not infer an ads SDK, analytics event names, target URL, or feature entitlement from a different campaign.

One useful search from `repoDir`, after choosing the relevant roots:

```bash
rg -n -g '*.md' -g '*.mdx' -g '!**/api/public-api/**' 'navigateTo|requestExpandedMode' docs/capabilities
```

Use the actual `searchRoots` from the helper for a version-sensitive question. Keep the generated API exclusions in every fallback search. If the excluded legacy API material is needed for the task, locate the corresponding official guide and inspect the installed SDK's types; report any unresolved documentation gap.
