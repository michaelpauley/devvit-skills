# Stacked MP4 alpha animation

This technique was used for transparent animated stickers in the Apple Devvit ad. Reuse the approach when native alpha-video support is unsuitable for the target Reddit clients. It is not necessary for ordinary video or static transparency.

## Asset contract

Use one video containing RGB in its top half and a grayscale alpha mask in its bottom half. The mask is white for opaque and black for transparent. The halves must have matching frame dimensions, timing, frame count, and orientation. Validate these inputs before stacking or normalizing them with an asset tool.

A single decode stream keeps color and alpha on the same frame. Two independently playing videos can drift after a stall, seek, or loop. Preserve original artwork and use a distinct derived output filename.

## Rendering

1. Allocate the output at the intended display aspect of one half, not the entire stacked frame.
2. Upload a ready video frame as one texture. Sample color and mask from their respective halves and output RGB with the mask channel as alpha.
3. Use blending that matches the chosen straight/premultiplied alpha convention. Clear to transparent before each draw to avoid trails.
4. Verify UV orientation, pixel-store Y flip, and DOM positioning together against a known asymmetric test image. Do not apply multiple Y flips by rote.
5. Render only when a frame is available and the sticker is visible. Use video frame callbacks if supported or a managed animation-frame loop.

For Canvas 2D fallback, draw the color half and mask half into suitable buffers, transfer the mask channel to output alpha, clear before drawing, and budget for the pixel-copy cost. A still fallback is preferable if the device cannot sustain compositing. Handle lost WebGL contexts without blocking the CTA.

## Prebuffering and ownership

Prepare a bounded set of small video elements before interaction, with muted inline playback and an appropriate preload hint. Reuse them when revealing stickers; re-creating a decoder on every tap loses that benefit. Readiness/error handling remains necessary because preload is advisory. Give the preload pool and renderer an explicit ownership contract so a render unmount does not invalidate media still needed for replay.

## Diagnose by symptom

| Symptom | Inspect |
| --- | --- |
| Color/mask edges separate over time | Independent streams, mismatched source timing |
| Grayscale output or opaque black box | Half selection, mask channel, blend setup |
| Flipped sticker | UV coordinates and pixel-store orientation |
| Trails/ghosting | Missing frame clear, stale content after seek |
| Flash on first tap | Readiness, decoder recreation, absent poster |
| Mobile jank after several reveals | Decoder count, backing resolution, allocation, inactive loops |

Check loop boundaries, replay, rotation, unmount, context loss, and fallback rendering on the target clients. No fixed payload budget or first-frame latency from the original campaign is a platform guarantee.
