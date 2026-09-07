---
name: devvit-reddit-integration
description: Add Devvit custom posts, result sharing, comments, community subscription, forms, and Reddit navigation. Use when connecting an app or game to Reddit user actions and post lifecycle.
---

# Devvit Reddit integration

Redd Libs supplies the recurring pattern of a builder, stored completion, explicit comment submission, and separate community subscription. Ad apps supply configurable post creation and CTA navigation. Apply only the requested part of that flow.

## Navigation and creation

- Use the installed SDK's `navigateTo` for Reddit/external navigation. Avoid navigating the iframe with `window.location`. Validate configured destinations and retain supplied campaign query parameters.
- Connect custom post creation to a configured entrypoint and the correct post data. Keep small public post configuration separate from per-user/private Redis records.
- For menus and forms, verify both the configuration mapping and the server handler. Derive the community, identity, and permitted scope from server context; validate submitted settings before creating a post.
- Render missing/deleted content or inaccessible Reddit destinations as recoverable errors. Show success only after the requested operation succeeds.

## User actions

Consult the current [user actions documentation](https://developers.reddit.com/docs/capabilities/server/userActions) and installed types before implementation. These platform requirements apply to posting, commenting, and subscribing:

- Use a clear, separate action for each operation. Replaying or continuing a game must not implicitly publish a result or subscribe the user.
- Configure the exact required permissions; choose app-account versus user-account posting intentionally. Supply required user-generated content metadata for user-created custom posts.
- Handle logged-out players and permission failure without losing their game result or draft. Keep subscription independent of access to gameplay.
- Build shared results from the accepted server record when scores matter. Keep spoilers out of daily-puzzle share text unless the user asks for them.
- For score comments, follow the documented user-account flow replying to a single stickied comment. The documentation permits a top-level comment when the player can add a custom message to their score; preserve that option when requested. Story-sharing and other UGC have their own product context; do not apply a score template indiscriminately.
- Disable duplicate submission while pending and remember successful publication. For an ambiguous timeout, reconcile known state before retrying a public mutation; do not promise exactly-once posting if the external operation and local record are not atomic.
- Approval status can change attribution during playtesting. Test the real attribution and permissions rather than inferring them from an owner-only success.

For plain text sharing, clipboard output is a useful existing pattern. Confirm clipboard success before showing a toast; if unavailable, show a selectable text fallback. Do not automatically publish copied text.

## Verification

Exercise success, cancel, duplicate click, expired session, denied permission, and failed network response for the changed action. Preserve generated result text through errors. A UI review can use stubs; sending a real post/comment/subscription requires authorization for that live action.

## References

- [Navigation](https://developers.reddit.com/docs/capabilities/client/navigation)
- [Creating custom posts](https://developers.reddit.com/docs/capabilities/creating_custom_post)
- [Menu actions](https://developers.reddit.com/docs/capabilities/client/menu-actions)
