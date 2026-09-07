---
name: devvit-game-loops
description: Build or change Devvit arcade and word-game mechanics, run lifecycles, timing, physics, replay, and result transitions. Use for gameplay behavior and interrupted sessions, rather than general page styling.
---

# Devvit game loops

Carry the requested mechanic through a complete playable run. Inspect the existing engine, entry points, result endpoint, and persisted state before adding behavior; retain the project's React, canvas, or Phaser approach.

## Keep rules separate from presentation

- Define the run's actual states, such as loading, ready, playing, resolving, completed, and failed. Add paused or surrendered only when that game needs them. Specify which actions each state accepts.
- Keep board rules, scoring, legal moves, power-up consumption, and terminal conditions together. The UI should render their result. Animation completion must not award an extra turn or score when a component remounts.
- Word games need one normalization contract, a known dictionary version, duplicate-word rules, and explicit rules for required tiles or locked positions. Shared validation helps client feedback match server acceptance; hiding a dictionary in a client bundle is not a security boundary.
- Resolve competing terminal events once: a timer expiring while a final move lands, the last collectible entering a goal, or surrender during an animation. Freeze the completed run's result before replay begins.
- For time-based physics, base simulation on elapsed time or the engine's step system, not rendered frame count. Bound catch-up after suspension so a returning tab does not simulate a giant jump.

## Respect the Reddit surface

Inline play supports taps and clicks. Put gameplay that requires dragging, swiping, text entry, or scroll capture in expanded mode, with an explicit launch control. Feed scrolling must still work over the inline post. Verify the current [view-mode requirements](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points) against the installed SDK.

In expanded gameplay, handle input cancellation and pointer release outside the board. Scope input listeners to the active game and release them with timers, animation frames, physics instances, and subscriptions when leaving or restarting. A modal covering the board should prevent unintended game actions beneath it.

Choose what hidden time means for this game: a live community deadline continues; a casual solo run may pause. Recompute deadline displays from time instead of decrementing a counter. Do not silently grant extra ranked time by switching tabs.

## Finish and recover deliberately

- Separate the visible win/loss reveal from result persistence. Show a save failure without erasing the completed run, and retry with the same attempt identifier. Disable repeated submission while a request is pending; server deduplication is still needed.
- Replay creates a fresh attempt and resets run-local timers, input locks, selections, effects, and pending callbacks. Keep user preferences, previous results, and any intended lifetime collection.
- If resume is requested, persist enough state to restore the same attempt: puzzle/version, board and inventory, random generator state where applicable, consumed effects, score history, and timing policy. Run-start metadata alone cannot restore a board. Discard or migrate incompatible saves explicitly.
- Distinguish playable guest mode from eligible ranked submissions according to the product's rules. Keep an identity change from attaching another player's saved attempt.

Observed conventions include reducer-based word rules, staged end-game reveals, physics playfields, and separate start/finalize events. Durable mid-run resume and deterministic replay are recommended options when needed; they were not universal features of the source apps. Likewise, plausible client-reported scores are not equivalent to server-verified gameplay.

Verify the changed behavior with a representative successful run, failure or surrender where present, replay, interrupted network submission, and leaving during an active animation. For rule changes, test the affected scoring and terminal cases independently of rendering.
