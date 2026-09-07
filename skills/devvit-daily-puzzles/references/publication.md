# Publication and rollover

The reusable source patterns are a day-to-post index, per-post puzzle metadata, an explicit current-post pointer, and finalized round summaries. Existing implementations vary in how strongly they protect concurrent publication. The steps below are recommended safeguards when adding or repairing that workflow.

1. Resolve and validate the logical day, puzzle, and publication intent. A delayed job should use its intended date where available rather than silently adopting a different day.
2. Look up the stored day/puzzle-to-post mapping. Reuse a valid mapping for a repeat invocation.
3. Serialize concurrent creation for that scope using the supported store primitives. Give temporary reservations an expiry and ownership token; release only a reservation still owned by the worker. Keep slow external work out of a Redis transaction.
4. Recheck durable state after acquiring ownership. For an earlier partial failure, recover the specific existing post using recorded metadata or a narrowly scoped lookup before submitting another.
5. Create the post and promptly record its ID and puzzle mapping. Track subsequent setup separately so a flair, pin, or notification failure does not cause another post on retry. A Redis transaction cannot roll back a Reddit post creation.
6. Make each remaining operation safe to resume, and return a result distinguishing reused, created, in-progress, and failed. A pending worker should not trigger an unbounded retry loop.

For timed community rounds, derive acceptance from persisted bounds and server time even when the finalizer is late. Recheck the deadline at the authoritative commit boundary. Finalization should produce one stable summary and stop accepting further contributions; reopening or correcting a finished round is a separate explicit operation.

Rollover may close a previous round and publish a new one. Persist enough progress to retry either operation without repeating the other. A stale client should receive the ended-round state and the current post reference instead of having its input redirected into the new round.

Exercise failures after post creation but before mapping persistence, during optional setup, and between old-round finalization and new-round creation. Inspect the resulting mappings and number of posts, not just the route's success response.
