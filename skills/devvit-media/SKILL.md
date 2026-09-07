---
name: devvit-media
description: Prepare and integrate Devvit image, font, audio, video, and transparent animation assets with fast first interaction and correct cleanup. Use for creative/game media loading, playback, compositing, or performance issues.
---

# Devvit media

Preserve supplied campaign art, fonts, proportions, and existing asset naming. Inventory the target assets and where they appear before changing formats or paths. Use generated visuals only when the task calls for them; an existing logo or vector asset is not a request to regenerate it.

## Load what the interaction needs

- Bundle static assets through the project's build or use supported Reddit-hosted media. Verify emitted paths, filename case, and runtime requests. The [media documentation](https://developers.reddit.com/docs/capabilities/server/media-uploads) describes supported upload paths; do not assume arbitrary external media is available inside the iframe.
- Prioritize the launch background, logo, and first action. Defer large game/media dependencies to the screen using them. Reserve image dimensions to prevent layout jumps and verify font loading before accepting text wrapping.
- For a small tap-to-reveal asset set, prepare media elements ahead of the first tap and reuse them. For a larger library, preload the next likely assets and provide a visible fallback. Measure payload and first-frame latency on the target device.
- `preload="auto"` is a browser hint, not a promise of complete download or decoding. Handle readiness, stalled/error events, and rejected `play()` promises. A poster or still fallback must leave essential controls usable.

## Playback lifecycle

- Use `muted` and `playsInline` for decorative video intended to autoplay. Start audible sound from a user interaction and provide a mute control.
- Stop or mute hidden/offscreen playback and suspend needless rendering. Resume according to app state and the player's sound preference, not blindly from every visibility event. See [view-mode sound requirements](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points).
- Respect reduced-motion preferences with a still or quieter transition when practical. Do not make an animation the only indication that an action succeeded.
- Give each asset/loop an owner. On scene exit or component teardown, cancel animation callbacks, detach listeners, pause owned media, release decoded resources, and dispose graphics resources. A borrowed element should not be destroyed while another owner still uses it.
- Scale canvas backing resolution to an appropriate device pixel ratio while keeping layout coordinates stable. Limit simultaneous decoders and expensive per-frame allocations.

## Transparent animated stickers

For the stacked MP4 color/mask technique used in the Apple creative, read [the alpha-video reference](references/alpha-video.md). It covers shared timing, compositing, and fallbacks. Do not assume all projects need this pipeline or that native alpha formats fail everywhere.

## Acceptance

Check first tap on a cold load, repeated replay, mute/unmute, background/return, asset failure, mobile playback, and cleanup after unmount. Confirm transparent edges and art alignment visually. Distinguish measurements from assumptions; do not promise zero latency from preload settings.

The preload semantics are defined in the [HTML standard](https://html.spec.whatwg.org/multipage/media.html#attr-media-preload).
