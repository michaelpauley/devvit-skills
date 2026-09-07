---
name: devvit-daily-puzzles
description: Implement Devvit daily puzzles, scheduled rounds, archives, publication windows, and daily streak rules. Use when a game must consistently map dates, puzzle identities, and Reddit posts across rollover and retries.
---

# Devvit daily puzzles

Inspect the existing puzzle catalog, date helpers, scheduled routes, post metadata, and completion model. Preserve the app's publication hour, timezone, puzzle families, and archive rules. Daily puzzles, weekly themed puzzles, and community rounds need not share the same cadence.

## Give each day a stable meaning

- Separate puzzle identity, puzzle number, logical date, publication instant, and Reddit post ID. A repost must not accidentally create a new puzzle or erase a player's result.
- Store the puzzle identity on the post and resolve that post's puzzle on load. An old post must not silently become today's puzzle because the server date changed.
- Compute the active day on the server using the configured publication boundary. For a fixed UTC release hour, the current published date is the UTC date after subtracting that hour; midnight and release time are different boundaries.
- Use one helper for today's label, archive visibility, remaining time, and streak eligibility. Return server time and the applicable end time so client clocks do not decide whether submissions count.
- Validate date strings by round-tripping the calendar date, not only matching `YYYY-MM-DD`; reject impossible dates. If local civil time is a product requirement, use its named timezone and handle daylight-saving transitions instead of adding a fixed 24 hours.

UTC windows and scheduled daily posts recur in the source apps, but their release hours differ. Treat UTC as an observed convention, not a requirement to change an existing timezone.

## Publish and close safely

Register scheduled work and its matching internal route using the project's installed SDK and the current [Scheduler guide](https://developers.reddit.com/docs/capabilities/server/scheduler). Manual posting and scheduled posting should call the same core operation with explicit puzzle/date input.

Read [publication and rollover](references/publication.md) when implementing posting, retries, or round finalization. Its central requirement is to recover an already-created post instead of assuming a failed response means nothing happened.

For pre-authored puzzles, validate the selected record before posting. If content is missing, report the missing date or puzzle and follow the app's configured fallback; do not silently reuse yesterday's board. Snapshot or version published rules and content so later catalog edits do not invalidate active games.

## Preserve archive and completion semantics

- Keep archive ordering and pagination deterministic. Hide unpublished content unless preview was explicitly requested. Load old puzzles by identity and version, with their own results and boards.
- Define whether repeat play replaces a personal best, whether only the first completion counts, and whether surrender counts as completion. Store attempts separately when those distinctions matter.
- Credit a daily streak once per eligible logical date. Explicitly preserve the app's policy for archive solves, late finishes, missed days, replay, and corrections. Do not invent a streak policy from the existence of an archive.
- Test immediately before and at release, month/year boundaries, leap day, an old post after rollover, a duplicate scheduled invocation, and missing content. For local-time schedules, include daylight-saving transitions.
