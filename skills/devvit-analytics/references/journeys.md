# Devvit Journeys integration

Use this reference only when integrating or modifying native Journeys. Check the installed `@devvit/analytics` types and current [Devvit Journeys documentation](https://developers.reddit.com/docs/capabilities/analytics/devvit-journeys) before choosing API methods and framework adapters.

Map the actual flow to readiness, explicit start, meaningful progress/interactions, and terminal outcome. Readiness and passive views must not start a journey. Events should correspond to committed actions. Keep developer-defined metadata free of personal data.

The documentation currently describes `permissions.journeys`, a reviewed journey map, and server-side activation/allowlisting. Confirm the app's current setup and event receipts instead of inferring ingestion from an SDK call resolving. Do not treat setup changes as authorization to publish the app.

Choose the documented client routing adapter that fits the app's server framework, or use server events with the active journey correlation. Inspect the SDK's behavior for auto-start, stored journey IDs, and terminal cleanup so pre-start interactions and replay cannot create unintended sessions. Keep these mechanics separate from any existing custom session IDs.

Validate [Journeys receipts](https://developers.reddit.com/docs/capabilities/analytics/journeys-receipts) in development: distinguish recorded, skipped, rejected, rate-limited, and unconfirmed outcomes. Keep diagnostic receipts out of player-facing UI and avoid blind retries. A successful HTTP response alone does not establish that an event was ingested.

Check the [Journeys dashboard](https://developers.reddit.com/docs/capabilities/analytics/journeys-dashboard) for its aggregation window and metric definitions before comparing its results with custom campaign reports.
