---
name: devvit-ad-campaigns
description: Build or adapt Devvit branded campaigns with coherent creative assets, product or result mappings, CTA destinations, campaign timing, and tracking integration. Use for interactive ads, quizzes, configurators, and promotional experiences.
---

# Devvit ad campaigns

Build around the supplied campaign brief and the existing app. Recurring app patterns include shared brand assets and fonts, image buttons, selection-to-result flows, product-specific destinations, countdown creative, and aggregate interaction tracking. Reuse these patterns where they serve the campaign; do not invent a promotion, mechanic, data collection feature, or required external integration.

## Establish the campaign contract

Inspect the relevant entrypoints, flow components, theme/font files, asset maps, shared config, API contracts, and existing tracking. Identify:

- Approved copy, logos, typography, colors, legal/disclaimer content, and supplied creative references.
- The actual flow: for example intro → choices → result → CTA, with replay/back behavior only where requested.
- Product/category/result identifiers and how each maps to displayed art, copy, and destination.
- CTA label, destination, approved query parameters, and any campaign start/end behavior.
- Which interactions already feed reporting, and which states are intentionally disabled or unfinished.

Preserve the approved wording and factual content. If a required destination or asset is absent, prepare the remaining implementation and make the missing field explicit; do not substitute a previous advertiser's URL or publish an invented offer.

## Keep brand and data mappings coherent

- Keep reusable brand tokens, asset paths, font definitions, campaign copy, and CTA mapping in existing shared modules. Avoid duplicating destination strings and product mappings across screens. A small campaign does not need a generic campaign engine.
- Follow supplied artwork and font weights. Preserve intrinsic aspect ratios, transparent padding, and intentional crop/edge-to-edge differences. Avoid stretching logos or replacing approved art with approximate CSS or generated imagery without a request.
- Wrap image controls in semantic buttons with accessible names, nondraggable images, pointer cursors when enabled, and nonselectable presentation text. Preserve editable and explicitly copyable content.
- Treat each displayed result as one validated mapping: product identifier, image, name, and CTA must agree. Unknown or unavailable items need a deliberate fallback that does not silently advertise a different product.
- Preload the assets needed for the next interactive state, including pressed button artwork. Keep a usable loading/failure state and avoid enabling controls whose outcome still depends on missing data.
- When the campaign has a countdown, configure an unambiguous timestamp and expected expired state. Clamp the display at zero and recalculate after tab visibility changes. Enforce an actual eligibility or voting cutoff on the server; a visual timer alone cannot enforce it.

## CTA navigation and attribution

Use the installed Devvit `navigateTo` API in a user-action handler. The official [Navigation documentation](https://developers.reddit.com/docs/capabilities/client/navigation) describes external-link confirmation and accepted targets; check package types before choosing an import or argument shape. Do not replace it with iframe `window.location` navigation or a new popup.

- Use the exact approved destination and attribution parameters. Parse and validate configurable URLs; allow the intended schemes and destinations, and preserve existing parameters without duplicating them. Do not strip or rewrite a supplied tracking redirect without establishing the intended final URL.
- Name the measurement for the observed action: a CTA click/navigation request is not proof that the destination loaded, a purchase happened, or an app was installed.
- Record a CTA event once from the committed handler. Analytics failure must not prevent navigation; do not wait for a tracking request before invoking the navigation action. Document that best-effort click delivery may be lost during dismissal.
- Keep replay, shop, download-app, and share actions distinct in both behavior and metrics. A button labeled “Download the app” may be an external destination; do not infer a file download implementation.
- Add third-party tracking only when it is part of the requested campaign. Client fetches are restricted to the app's webview domain and server `/api/` routes; external service calls need the platform's server HTTP integration and allowed domains. Browser pixel snippets are not a drop-in Devvit integration. See [HTTP Fetch](https://developers.reddit.com/docs/capabilities/server/http-fetch).

## Campaign verification

Walk every changed path from entry to result and CTA using representative narrow and wide post sizes. Confirm the chosen result, artwork, copy, destination, and event metadata stay together through back, replay, and repeated taps. Check asset failures, disabled controls, and campaign expiry when applicable. Verify navigation inside Reddit, since a standalone browser cannot prove host behavior.

Report missing campaign inputs and any platform checks that could not be exercised. If installed, `devvit-ad-ux`, `devvit-media`, and `devvit-analytics` provide focused companions; none is required to use this skill.
