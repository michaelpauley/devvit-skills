---
name: devvit-release-qa
description: Verify a Devvit ad or game change for build correctness, real Reddit behavior, and launch readiness. Use for release checks, playtest preparation, or regression review; publication follows the user's authorized scope.
---

# Devvit release QA

Use a check set proportional to the change. Existing projects have different type-check/test script names, and scripts named `deploy`, `dev`, or `launch` may upload, playtest, or publish. Read their definitions before running them.

## Establish what is being checked

Record the changed feature, installed Node/SDK versions, relevant scripts, and intended entrypoint/runtime. Compare the build's entrypoint outputs with `devvit.json`; check configured routes/forms/jobs when they change. Preserve an existing app name, test community, and production data namespace unless the task changes them.

## Choose applicable checks

| Change | Useful evidence |
| --- | --- |
| Ad UI, CTA, responsive layout | Rendered phone/desktop/short-height states; selection and cursor behavior; one tap produces one action; feed scroll works |
| Media or animation | Cold first interaction, playback rejection/fallback, mute, background/resume, repeated replay and cleanup |
| Game rules or scores | Pure rule tests, end-state transition, invalid/replayed submissions, eligibility and deterministic tie behavior |
| Daily rounds or persistence | Boundary/rollover test, duplicate job/request, older record read, refresh/resume and missing state |
| Admin, analytics, export | Direct unauthorized request, selected scope, duplicate events, empty window, export correctness |
| Reddit action | Explicit choice, identity/permissions, pending/error/retry, correct target and attribution in the approved test context |

Run the applicable existing type, lint, test, and build commands. Add focused tests when a rule, boundary, or failure needs lasting protection; a small styling change does not require tests that match source text. Use the project's installed test runner; consult [Devvit testing](https://developers.reddit.com/docs/guides/tools/devvit_test) when SDK mocks are needed.

## Real runtime checks

A local page or simulator does not prove host navigation, permissions, CSP, audio, or mobile input behavior. Use [Devvit playtest](https://developers.reddit.com/docs/guides/tools/playtest) when available and authorized. Account for the fact that playtest uploads and can affect a shared development app/community. Use the task's existing authorization; do not repeatedly request permission for already authorized steps.

At minimum for a changed flow, check first entry, primary action, completion/error, and return/replay where applicable. Check logged-out behavior when identity is involved. Expand the matrix only for unresolved risks or new failures.

## Handoff or release

Report what changed, commands/results, the actual runtime exercised, and any unverified behavior. Do not describe a build as mobile-tested or claim publication from an upload. If release is requested, complete the build and relevant validation before the external step; preserve existing authorization and stop for a missing required deployment decision only when necessary. A skills-authoring or UI task alone is not a request to publish a Reddit app.
