---
name: devvit-app-foundations
description: Build or extend a Devvit Web app's client/server boundary, configuration, launch entrypoints, and API wiring. Use for scaffolding and platform integration, not an unrelated UI-only edit.
---

# Devvit app foundations

Use the target project's working architecture. The recurring layout is `src/client`, `src/server`, and `src/shared`, with HTML entrypoints and `devvit.json`. React/Vite and Hono or Express recur; tRPC is an option, not a requirement. Phaser and legacy Blocks projects also exist. A template's AGENTS.md is not proof of its actual dependencies.

## Establish the runtime

Read the target's instructions, package scripts, lockfile, Devvit configuration, build configuration, and a working client/server request. Determine the installed SDK and whether this is Web, legacy Blocks, or a mixed migration before changing imports. Use installed declarations and [official documentation](https://developers.reddit.com/docs/llms.txt) for current APIs; do not upgrade or migrate the app incidentally. The optional `devvit-docs` skill provides a cached source lookup.

## Preserve these boundaries

- Keep Redis, Reddit API calls, settings/secrets, and privileged validation on the server. Derive user and post identity from server context rather than request-body identity claims.
- Put shared request/response types and pure rules in `src/shared`; exclude server imports and private configuration from the client dependency graph. Keep unrevealed answers server-side when the game requires secrecy; client-delivered puzzle data is inspectable, including in intentionally client-validated games.
- Use the app's existing same-origin API transport. Validate request data at the server boundary even when the client has TypeScript types. Return a usable failure state and make retries safe for mutations.
- Devvit servers are request-scoped: await required writes before returning. Use supported persistence and scheduled actions for durable work; process globals and detached timers are not durable state.
- External service calls belong on the backend with the appropriate configured permissions. Bundle approved frontend assets or use supported Reddit-hosted media; do not assume an arbitrary client CDN request will work in the iframe.

## Connect the post to the build

1. Trace each entrypoint name from `devvit.json` to HTML, client module, and emitted build output. Determine whether the Devvit Vite plugin infers inputs or the project maintains an explicit input list.
2. Keep the feed launch entrypoint fast; load the full game or detailed tools only where needed. A single inline ad can remain a single entrypoint.
3. Enter expanded mode from a clear user action using the installed client SDK. Inline interactions must leave Reddit feed scrolling intact; drag/pan gameplay belongs in expanded mode.
4. Register each new menu, form, trigger, or scheduled action in the matching configuration and server route. Keep client-callable routes distinct from platform-internal callbacks.
5. Define usable loading, missing-post, logged-out, and failed-request states where relevant. A guest preview should not impersonate a persistent user.

## Verify the connection

Run the actual repository's local type/lint/build checks after inspecting their scripts for side effects. Verify the built entrypoint exists and can reach its endpoint in the target runtime. Creating posts or publishing is a separate action from compiling an app; use the task's existing authorization.

## Platform references

- [Devvit Web architecture and limitations](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview)
- [Configuration and authoritative schema guidance](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_configuration)
- [View modes and entrypoints](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points)

These are reusable defaults inferred from existing apps. The target's explicit requirements determine stack, modes, and scope.
