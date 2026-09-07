# Concurrency and recovery

The source apps use single-command increments, unique contribution claims, conditional transactions, and temporary creation leases. Those mechanisms solve different problems. Pick the smallest one that protects the requested invariant rather than applying a lock to every read.

## Conditional commit

For a read-dependent update, watch all relevant keys, read the current values through the transaction client, evaluate the precondition, queue writes, and inspect the commit result. Release transaction resources on early exits. On contention, retry from a fresh read with a small bound or return a retryable conflict; never reuse stale computed totals. Check current signatures and abort behavior in the [transaction documentation](https://developers.reddit.com/docs/capabilities/server/redis#transactions).

Keep Reddit API calls, network fetches, and expensive computation outside the transaction. A transaction coordinates storage; it does not make remote side effects atomic. Validate serialized values and command arguments before queuing writes, and handle command errors as well as conflicts instead of assuming database-style rollback for every failure.

## Duplicate requests

Use an operation identifier scoped to the actor and resource: for example an attempt ID for finalization or a submission ID for a shared contribution. Persist the accepted outcome with the accounting it controls. A repeated request should return that outcome rather than increment totals again.

A client flag only reduces duplicate clicks in one running page. It cannot protect against two tabs, a page reload, or a retry after the server succeeded but its response was lost.

Check the relationship among identity, resource, and operation ID on the server. For new ranked attempts, prefer an attempt identifier issued or registered by the server. Client timestamps may be useful metadata; they are not evidence of a legitimate start or duration.

## Reservations and external work

A reservation needs a scope, owner token, expiry, and an explicit recovery state. Avoid an unconditional delete during release: an expired worker could delete a newer worker's lease. If ownership is checked separately from deletion, account for that race or use a conditional transaction for release.

Before retrying a post creation or another external action with an uncertain outcome, reconcile its durable operation record with the external resource. Retry only a known missing step. Do not claim exactly-once external behavior from a Redis lock alone.

If a result saved successfully but refreshing a leaderboard or sending a realtime update failed, keep the result saved. Return enough status for the client to recover the view, and repair the derived data without crediting another result.
