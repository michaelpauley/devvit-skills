---
name: devvit-analytics
description: Implement or review Devvit ad and game telemetry, including event contracts, session boundaries, deduplication, aggregate Redis metrics, and optional Devvit Journeys. Use when measuring clicks, flow completion, gameplay, or campaign reporting.
---

# Devvit analytics

Existing apps commonly use typed event names, same-origin tracking endpoints, post-scoped aggregate counters, and session-level completion measurements. Some legacy trackers use only client guards or are intentionally disabled. Inspect the implementation before claiming reliable delivery or uniqueness. Preserve a disabled tracker until the reason it was disabled is resolved within the task.

## Define what each number means

Start from the requested report and the app's existing event contract. For each changed metric define its trigger, counting unit, allowed dimensions, and replay/retry behavior. Use a small table when multiple events need alignment. Common candidates are:

| Metric | Observable trigger | Counting distinction |
| --- | --- | --- |
| App ready | Assets and data permit interaction | Separate from starting a game |
| Session/run start | User commits to begin | Define whether replay starts a new run |
| Choice | User commits a valid option | Selection changes versus final choices |
| Completion | Defined terminal result or accepted submission | Once per intended run/attempt |
| CTA click | User activates the CTA | Navigation attempt, not conversion |
| Duration | Defined start to terminal event | State units and paused/hidden-time treatment |

Keep existing public event names and export columns stable unless the task includes a migration. Do not label mount counts as impressions, starts as unique people, or CTA clicks as sales. Define rate denominators explicitly; counts from different time windows or populations cannot form a meaningful conversion rate.

## Wire events to committed actions

- Prefer one event owner per action: the committing handler or authoritative server mutation. Avoid duplicate tracking through render effects, both pointer and click handlers, parent bubbling, or client and server calls for the same action.
- Separate run/session reset from component mount. React remounts, retry responses, and reopening result screens must follow the metric's stated counting rule.
- Client guards prevent accidental double clicks, but they do not enforce server uniqueness. For metrics that promise one accepted event per run, validate a run/event identifier and atomically deduplicate together with the counter update. Bound dedupe lifetime and document the scope; a fresh client-generated ID alone does not prevent abuse.
- For an authoritative vote, result, or score, emit the metric after the server accepts the operation. Do not trust client-supplied previous selections to decrement counts without verifying stored state.
- Keep observational telemetry from blocking gameplay or CTAs. Handle errors and non-success responses, and describe delivery as best effort unless an acknowledged, idempotent path establishes otherwise. Avoid unbounded automatic retries.
- Server endpoints must await the writes they promise before returning success. A detached promise after sending a response is not a durable queue in a [serverless runtime](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview). If a durable deferred path is necessary, use a supported platform mechanism with bounded retries.

## Validate and store bounded aggregates

Use a runtime-validated allowlist of event names and metadata values. Derive trusted post/installation context on the server. Reject malformed payloads, unexpected dimensions, nonfinite values, unreasonable durations, and oversized strings. Avoid accepting arbitrary event names or JSON as new Redis fields.

Prefer aggregate counters by the dimensions the report needs, such as post, event, screen, outcome, product, and time bucket. In branded selection apps, a field called `playerId` may identify a depicted athlete or character; clarify the meaning instead of treating it as a Reddit user identifier.

- Use atomic increment commands for independent counters. Use a transaction when deduplication or related state must commit consistently. Follow the installed Redis API and [current Redis documentation](https://developers.reddit.com/docs/capabilities/server/redis).
- Redis storage is scoped to an installation/subreddit. Label the report's coverage; do not present installation totals as cross-subreddit totals.
- Keep discoverable indexes or stable collection keys for reporting. Bound dimension cardinality, query ranges, export sizes, and any retention/expiry policy. Avoid a raw event log when aggregates answer the request.
- Use a declared reporting timezone and bucket boundary. Preserve the numerator and denominator for durations and rates; zero qualifying sessions should show an unavailable average rather than division by zero.
- Apply server-side admission/rate controls appropriate to traffic. Public `/api/` telemetry endpoints can be called directly; TypeScript types and hidden UI do not protect them. See [HTTP Fetch endpoint constraints](https://developers.reddit.com/docs/capabilities/server/http-fetch).

For custom campaign analytics, prefer aggregate data without usernames, raw Reddit user IDs, free text, or persistent device identifiers. This is a privacy-conscious default drawn from aggregate ad implementations, not a claim that the platform forbids user state for all app features. If correlation is necessary, minimize its scope and lifetime, and keep it out of reports unless explicitly required. Avoid logging raw payloads. Protect report and reset endpoints with the project's existing server authorization.

## Optional native Journeys

When the task asks for Devvit Journeys or the app already uses it, read [references/journeys.md](references/journeys.md). Do not automatically replace custom campaign metrics or add a second event stream. Journeys and custom aggregates need clearly distinguished counting semantics.

## Verify the changed measurements

Exercise a normal run, replay, double activation, remount, failed request, invalid payload, and duplicate delivery where applicable. Test concurrent duplicates if claiming server deduplication. Check that the expected counter changes once, totals reconcile with their dimensions, duration units are correct, and zero-data reports remain valid. Confirm failed telemetry does not break the primary action.

Use fixtures or the app's test environment and existing checks. Do not reset live analytics to make a test convenient. Report whether telemetry delivery and reporting were observed end to end or only checked locally.
