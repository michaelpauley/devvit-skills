---
name: devvit-ad-ux
description: Apply interaction polish to Devvit ads and branded experiences, including nonselectable creative text, pointer buttons, image controls, and accessible pressed and disabled states. Use when building or reviewing an ad surface.
---

# Devvit ad UX

The user's explicit ad defaults are **no selectable presentation text** and **a pointer cursor on enabled buttons**. Apply them to the creative surface, including intro, selection, result, and CTA screens. Preserve the task's design and any explicit exceptions.

Other recurring patterns are semantic image buttons, nondraggable art, decorative overlays that pass clicks through, and visible pressed states. Accessibility and duplicate-action protections below are engineering safeguards; these are not claims that every past app already implements them.

## Selection and cursor defaults

Scope selection rules to the ad surface. Preserve selection, editing, and copying in inputs, textareas, editable regions, and explicitly copyable content such as promo codes or admin exports. A starting point, adapted to the project's CSS system:

```css
.ad-surface,
.ad-surface * {
  -webkit-user-select: none;
  user-select: none;
}

.ad-surface :where(
  input,
  textarea,
  [contenteditable]:not([contenteditable="false"]),
  [contenteditable]:not([contenteditable="false"]) *,
  [data-selectable],
  [data-selectable] *
) {
  -webkit-user-select: text;
  user-select: text;
}

.ad-surface button:not(:disabled):not([aria-disabled="true"]),
.ad-surface a[href]:not([aria-disabled="true"]) {
  cursor: pointer;
}

.ad-surface button:disabled,
.ad-surface [aria-disabled="true"] {
  cursor: not-allowed;
}
```

Keep a text cursor on text entry fields. Do not apply pointer cursors to static labels, decorative art, or inactive cards. Disabling text selection does not justify disabling keyboard focus, browser zoom, screen-reader text, or all context menus.

## Controls and hit areas

- Use `<button type="button">` for actions, including controls whose artwork contains their label. Supply an accessible name with visible text, appropriate image alt text, or `aria-label`. Decorative images inside an already named control can use empty alt text.
- Keep keyboard activation and a visible `:focus-visible` treatment. Hover may enhance the control, but touch users must receive pressed feedback too.
- Set `draggable={false}` on creative images. Use `pointer-events: none` on purely decorative overlays and particles so they cannot intercept taps. Keep the actual control interactive and its hit area aligned with the visible art.
- Preserve supplied normal, pressed, selected, and disabled assets. A shared image-button component should keep its layout stable when the asset changes.
- Use native `disabled` where possible. `aria-disabled` alone does not stop activation; custom controls must enforce it in their handler. Disable or guard submission while a transition or request is pending so rapid taps cannot advance twice.
- For delayed press animations, cancel timers on unmount and ignore repeated activation while pending. A canceled touch should not commit a selection.
- Keep CTA and background-tap handlers from counting or executing the same action twice through event bubbling. Make the whole surface clickable only when the creative explicitly calls for it.

## Reddit interaction constraints

Check the configured view before implementing gestures: current inline mode accepts taps/clicks and passes scrolling to Reddit. Dragging, swiping, and keyboard game controls belong in an appropriate expanded experience. Do not impose a page-wide `touch-action: none` to fight the host's scrolling. Confirm behavior against the installed SDK and [view-mode documentation](https://developers.reddit.com/docs/capabilities/server/launch_screen_and_entry_points/view_modes_entry_points).

Use the project's Devvit navigation helper for outgoing CTAs; verify its installed types against [Navigation](https://developers.reddit.com/docs/capabilities/client/navigation). Keep the action connected to a committed user interaction and preserve the platform's external-link confirmation.

## Verify the changed surface

Check the actual intro, selection, result, and CTA states affected by the change:

- Dragging across creative copy does not select it; artwork does not start a browser drag.
- Enabled controls show a pointer; disabled controls cannot fire; editable and copyable exceptions still work.
- Keyboard focus and activation work wherever the view supports them; image controls have meaningful accessible names.
- Mobile taps reach the correct target, pressed feedback is visible, and overlays do not block controls.
- Repeated taps, screen transitions, and failed requests do not duplicate navigation, votes, or completion events.

For broader layout, media, or campaign work, use `devvit-responsive-layout`, `devvit-media`, or `devvit-ad-campaigns` if installed. This skill works independently.
