---
name: devvit-responsive-layout
description: Fit Devvit ads and games to Reddit inline and expanded viewports, including art stages, short screens, mobile keyboard layouts, and touch-safe overlays. Use when building or repairing responsive interaction layouts.
---

# Devvit responsive layout

Recurring patterns include aspect-aware layouts in ads and Redd Libs, a scaled art stage in a game demo, and container measurement plus safe-area spacing in Sandwords. Choose the pattern that fits the interaction; fixed art coordinates are not the default for forms or reading interfaces.

## Choose the layout model

- **Authored scene or playable creative:** preserve a logical artboard. For available width `W`, height `H`, and design size `Dw × Dh`, use `scale = min(W / Dw, H / Dh, maxScale)` if fitting the entire scene. Center the scene and keep hit regions in the same coordinate system. Any crop must preserve the CTA and gameplay targets.
- **Text, forms, dashboards:** use reflowing CSS with constrained widths, flexible content, and intentional scroll regions. Avoid scaling body text until it becomes unreadable.
- **Different portrait/wide compositions:** switch based on available aspect and height when content needs a real rearrangement. A desktop user can still have a narrow or short post container.

Measure the actual app container with `ResizeObserver` where possible. Account for the visual viewport and on-screen keyboard when positioning expanded input controls. Clean up observers/listeners and batch resize work. Use safe-area insets when the host exposes them; they are additional spacing, not a substitute for checking the actual host.

## Respect the host and controls

- The [inline mode contract](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points) allows taps/clicks while preserving feed scroll and zoom. Do not apply global `touch-action: none`, wheel cancellation, or document-wide touch prevention to an inline post.
- Use expanded mode for drag, swipe, or keyboard-heavy gameplay. Limit pointer capture and gesture suppression to the control that needs them; release on cancel and teardown.
- Decorative art and animation overlays use `pointer-events: none`. Interactive descendants opt back in deliberately. Check transparent images and oversized layers for accidental interception.
- Keep accessible names, visible keyboard focus, usable touch targets, and actual disabled states. Do not remove focus outlines without a replacement.
- For canvas controls, map CSS pointer coordinates through the scene offset and scale. Keep rendering pixel ratio separate from game coordinates.
- An ad's presentation text should be nonselectable and enabled buttons should show a pointer cursor, per the user's convention. Use the optional `devvit-ad-ux` skill for the scoped CSS and editable-text exceptions.

## Review the rendered result

Exercise a narrow phone, a short wide container, a normal desktop post, and expanded mobile. These are scenarios, not permanent hardcoded breakpoints. Check the primary action, readable text, image crop, modal dismissal, keyboard-open form, orientation change, and scrolling past an inline post. For visual changes, inspect screenshots or browser output when available; a passing CSS build does not establish fit.
