---
name: devvit-state-storage
description: Design or repair Devvit Redis state, persistence, concurrent updates, key migrations, and game recovery. Use when player progress, post configuration, results, or shared state must remain consistent across requests and app updates.
---

# Devvit state storage

Read existing key builders, serializers, migration code, and the callers that depend on them before changing storage. Follow installed package types for Redis operations. Do not import an old Blocks storage wrapper into a Web app merely because it appears in a related project.

## Map state to its owner

Distinguish immutable puzzle/post configuration, attempt state, accepted results, user preferences, shared aggregates, and disposable cache data. Keep authoritative records separate from indexes that can be rebuilt.

Use stable key builders with the scopes actually needed, for example `app:v1:post:<id>:config` and `app:v1:puzzle:<id>:player:<id>:result`. Versioned key builders recur in the source apps; preserve existing prefixes when compatibility matters. Prefer server-derived player IDs for new records, and keep username-based legacy lookup compatible when migrating.

Devvit Redis is isolated by app installation/subreddit. A key named `global` does not create cross-subreddit storage. Redis also lacks an installation-wide key scan: maintain collection indexes for records that must later be enumerated, migrated, or deleted. Verify supported commands and capabilities in the [Redis guide](https://developers.reddit.com/docs/capabilities/server/redis).

Persist data that must survive releases on the server. Browser storage is suitable for disposable preferences or recovery caches, but Devvit app updates change the iframe origin and can clear it. It also does not provide cross-device continuity. See the [Web storage limitation](https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview).

## Preserve invariants across requests

- Use atomic increments for independent counters. A read-modify-write of a whole JSON object can lose another request's change.
- A multi-record operation needs one explicit invariant, such as accepting an attempt and crediting it once. Protect every record read to decide that invariant, not just the final write target.
- Read [concurrency and recovery](references/concurrency.md) for transactions, operation IDs, leases, and interrupted writes. Match the installed SDK's success/abort semantics; an awaited request is not proof that a conditional commit succeeded.
- Store parsed, bounded values with a schema version. Handle absent, malformed, legacy, and unsupported future records distinctly when recovery behavior differs. Avoid silently replacing a corrupt saved game with a fresh one.
- Use expiry for temporary reservations and caches. Choose retention for authoritative results deliberately; a short cache TTL must not erase the only copy of player progress.
- Batch related reads where supported and bound scans of known collections. Use resumable batches for large repair or migration work instead of loading every result in one request.

## Evolve without losing history

Older post records and player history were explicitly preserved during source-app migrations. First identify which old post types and key formats remain in use. Add readers or a bounded migration that accepts those schemas; do not rename prefixes and assume old data follows.

When migrating, make re-running safe, write and verify the replacement before deleting a source record, and retain a progress marker for large jobs. Rebuild derived indexes from canonical records and check counts or samples before switching readers. Do not remove legacy keys merely to tidy the code.

Verify the changed invariant under two simultaneous requests, a repeated operation ID, failed persistence, malformed saved state, and a relevant old-format record. Browser-only mocks cannot verify the server's transaction behavior; use the project's backend test harness where available.
