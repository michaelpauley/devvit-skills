---
name: devvit-realtime
description: Build or repair Devvit live community state, event synchronization, reconnect recovery, and presence. Use when multiple viewers must see accepted shared actions consistently, including live game rounds and counters.
---

# Devvit realtime

Inspect the existing snapshot endpoint, persisted shared state, event types, channel naming, and client lifecycle. Use realtime for updates that help the requested interaction; a solo game or an infrequently changing page may only need an ordinary fetch.

The reusable source pattern is a durable round snapshot plus accepted contribution events, refresh on connection, and expiring presence heartbeats. Revision ordering and buffered resynchronization below are recommended safeguards when synchronization requires them, not claims that every source app already implements them.

## Persist actions before announcing them

- Accept and validate shared actions on the server using the current actor and round. Deduplicate the operation and persist its result before broadcasting. Client-side physics, optimistic animation, or an incoming message must not directly award authoritative score.
- Give accepted actions stable IDs and the resource identity. Add a schema version and monotonic revision when event ordering matters. Keep event payloads small: an accepted word or capture plus relevant totals can drive local animation without writing positions every frame.
- A failed broadcast after a successful commit must not turn the action into a rejected contribution. Return the accepted result and let reconnect, snapshot refresh, or a deliberate repair path update other viewers.
- Keep durable records recoverable through an ordinary server read. Do not require a viewer to have received the full history of broadcasts to learn the current round, totals, or completion state.

Devvit clients subscribe to channels while the server sends messages. Channel names cannot contain `:` under the documented API; do not reuse colon-separated Redis keys as channel names. Follow the installed SDK and [Realtime guide](https://developers.reddit.com/docs/capabilities/realtime/overview) for connection and teardown signatures.

## Avoid snapshot and event races

- Refresh the authoritative snapshot after connecting or reconnecting. For ordered state, connect and buffer incoming events while fetching a snapshot with a revision; install the snapshot, then apply only later events in order.
- Deduplicate event IDs and optimistic actions. An action returning through both its HTTP response and realtime must appear and count once.
- Detect missing revisions or incompatible events and refetch instead of guessing. If no revision protocol exists, use events to invalidate/refetch authoritative state or another explicitly race-safe reconciliation strategy.
- Guard asynchronous responses with the current round/resource and request generation. A slow response from the previous round or an earlier refresh must not overwrite newer state.
- Apply a counter maximum only when that counter truly cannot decrease within the same round. It is unsuitable for presence, resets, undo, or moderation corrections. Round changes need a new baseline, not a maximum against yesterday's total.
- Show a reconnecting state when useful and keep read-only content visible. Do not reconnect in a tight loop; bound any application-managed retry and avoid competing with SDK-managed recovery.

## Treat presence as approximate

When presence is part of the requested experience, send periodic visible/active heartbeats and expire entries by server time. A leave event is best effort: closing a tab or losing connectivity cannot be the only way to remove a player. Count sessions or unique players deliberately; multiple tabs must not unexpectedly inflate a player count.

Stop heartbeats when the surface is hidden or the round ends. Prune stale entries before reading presence, and broadcast a membership change only when the displayed information changes. Keep presence failure from blocking gameplay.

## Keep subscriptions scoped

Channels are not a private-data authorization boundary: the documented client can subscribe by channel name. Send only information intended for that audience. Keep unrevealed answers, private attempts, and admin data behind authorized server reads instead of placing them in a public event and hiding them in the UI.

Disconnect, cancel timers, and remove listeners on unmount, post change, and finalized rounds when live updates are no longer needed. Handle a connection resolving after the component was disposed by closing it immediately. Do not let a remount accumulate duplicate subscriptions.

Verify two concurrent viewers, duplicate and delayed events, a reconnect during a contribution, a snapshot resolving after a newer event, a round change with an old request pending, and a viewer disappearing without a leave event.
