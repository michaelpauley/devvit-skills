---
name: devvit-leaderboards
description: Build or repair Devvit scoring, personal bests, ranks, result eligibility, and community statistics. Use for leaderboard correctness, repeated submissions, tie rules, and efficient retrieval of ranked results.
---

# Devvit leaderboards

Read the scoring rules, result endpoint, stored result schema, ranking keys, and current UI together. Determine what the board measures: best attempt, first completion, fastest solve, cumulative contributions, or a particular achievement. Preserve that product meaning when changing storage or presentation.

## Define and enforce the result contract

- Specify scope (puzzle, post, season, installation), score direction, tie-breaker, replay policy, and eligibility for each board. Different categories may need different winning attempts; do not update a fastest-time board only when a run also beats the player's best score unless that coupling is intentional.
- Derive player identity and resource access on the server. Validate the submitted shape, finite numeric values, allowed ranges, puzzle version, and outcome. New ranked flows should bind submissions to a known attempt and prevent the same attempt from being credited twice.
- Prefer recomputing scored actions from server-known puzzle/rule data when the requested competition needs score integrity. At minimum, validate legal words or items and bounds appropriate to the game. A maximum-score check cannot prove that the reported moves occurred.
- Record the validation mode when it affects trust. Some source apps explicitly use `client_reported` results with plausibility checks. Preserve that honest distinction rather than claiming full server authority; stronger replay validation is a recommended improvement when needed.
- Keep finalization separate from its accounting. Repeated submission returns the same accepted result. Decide whether an ineligible result is rejected or retained for the player's history, and avoid adding it to competitive aggregates.

## Maintain results and ranks together

Use the result record as the source of the displayed score and a sorted set as its ranking index. Include the accepted attempt, personal-best update, and associated aggregate changes in the same protected commit where they must agree. For cumulative scoring, credit an accepted contribution once; replaying a response must not award it again.

Use stable player IDs as new members and store display names separately. Existing username-based boards need a compatibility path. Make read-dependent best-score replacement safe under simultaneous finishes so an older, weaker result cannot overwrite a better one.

Ranking encodings that combine score and completion time need documented bounds and numeric precision checks. Keep the raw score separately, and test equal scores, equal times, negative/zero scores where legal, and maximum supported values. Rank numbering and tie treatment should match the product, not emerge accidentally from member ordering.

For rank reads, Devvit sorted sets provide `zRange`, `zScore`, `zRank`, and `zCard`. Rank ranges use zero-based inclusive endpoints. Read a bounded page and the current player's score/rank separately; verify ordering with the installed API. See [Redis sorted sets](https://developers.reddit.com/docs/capabilities/server/redis#sorted-set).

An installation-wide board is local to that subreddit. Cross-community ranking requires an explicit shared-data design; a Redis key called `global` is insufficient.

## Make standings understandable

- Show the period or puzzle, ranking metric, current player's result, and empty/loading/error states. Fetch display information for the visible page in batches rather than looking up every player sequentially.
- Show the accepted raw score, not a packed ranking value. Keep personal best, current attempt, and lifetime total distinct.
- Match statistic labels to their population: attempts, unique players, finishers, and eligible ranked results are different counts. Do not calculate an overall average from a top-results page and label it as all players.
- For large boards, use maintained aggregates or bounded background aggregation for distributions. Do not fetch millions of rows on every modal open merely to find one player's rank.
- If realtime refresh is already used, send updates after persistence and refetch standings on reconnect. Treat events as a way to refresh the view, not the only durable result record. Follow the [Realtime lifecycle API](https://developers.reddit.com/docs/capabilities/realtime/overview) for cleanup.

Verify a duplicate finalization, simultaneous worse/better attempts, each metric's ordering and ties, a player outside the first page, an empty board, and a persisted result whose follow-up refresh fails.
