---
name: devvit-admin-tools
description: Build or repair Devvit campaign dashboards, moderator controls, configuration forms, and data exports with server authorization. Use for administrative app features, not ordinary player UI.
---

# Devvit admin tools

Observed apps use hidden multi-tap entrances, dedicated admin entrypoints, per-post/all-post analytics, and clipboard exports. These are optional presentation patterns. A hidden icon, tap sequence, or client-side username check never grants authority.

## Access and scope

- Determine whether the target app grants access to configured operators, subreddit moderators, or another explicit role. Preserve its intended model; do not copy usernames from another campaign.
- Check identity and authorization on every privileged server endpoint, including export and reads. The frontend access check only controls affordances. Deny when identity or scope is missing.
- Validate any requested post, date range, campaign, or community before using it to read or mutate data. A user-supplied ID is not proof of access.
- Keep admin payloads out of ordinary initialization responses and avoid exposing full operator lists to clients. Return a clear denied state without leaking the protected dataset.

## Dashboard and export behavior

- Display the selected scope, date/time convention, and metric definitions. Keep total counts and unique users visibly distinct; zero activity is a valid state.
- Fetch only the requested window; paginate or bound queries as data grows. Do not copy a small demo's unbounded full-history scan into a mature app.
- Preserve loading, empty, denied, and error states. Abort or ignore stale responses when the operator changes selection.
- Generate CSV/JSON from the same filtered data the dashboard shows. Quote CSV delimiters/newlines and neutralize spreadsheet formulas in untrusted text when producing a spreadsheet-oriented export.
- Include only fields needed by the authorized workflow. An observed username export is not a default to collect or expose player identities in every app.
- Use an explicit copy/export control. Check clipboard success and provide selectable fallback text when needed. Scope ad nonselection CSS so operators can select and edit report contents.

## Controls that change state

Show the exact target and effect before a destructive reset, backfill, or campaign-state change. Reuse existing authorization and UI confirmation conventions; a read-only dashboard does not need a new permission ceremony. Validate server-side, use bounded operations, preserve durable IDs/key compatibility, and report the resulting state.

## Verification

Request a privileged endpoint directly as an ordinary/logged-out user and check denial, rather than only hiding the entrance. Check wrong-post scope, empty data, clipboard failure, and CSV values containing quotes/newlines or formula prefixes if export code changes. Do not run a live reset as a smoke test.

For platform wiring and available configuration use [menus](https://developers.reddit.com/docs/capabilities/client/menu-actions), [settings](https://developers.reddit.com/docs/capabilities/server/settings-and-secrets), and the installed SDK. The optional `devvit-analytics` skill defines event semantics.
