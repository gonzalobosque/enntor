# Release gates and independent review

The implementer owns scoped implementation, self-review, reproducible checks and a reviewable PR. An independent reviewer examines the actual source, behavior and evidence, with expertise in learning design, UX and engineering as required. The product owner decides changes to educational policy, consequential new interactions, branding, billing, high-risk data handling, licensing and release. Routine reversible implementation choices need evidence and documentation proportional to impact. Self-review, a green build and an open draft each serve a different purpose from approval.

## Gates

| Gate | Required evidence |
| --- | --- |
| 0 · Source alignment | Identify the accepted requirements, lesson/version and impacted routes/contracts. Record genuine departures and seek approval for policy changes. Link the source ledger. |
| 1 · Teaching and grading | Verify the mental model, prerequisite and symbol ordering, authored examples and answers, valid inputs, edge cases, failing starter, passing reference and discriminating wrong solutions. Review the scaffold fade, fresh transfer, hint disclosure and assistance classification with a person. |
| 2 · Execution | Exercise real runtime semantics, public deterministic verdicts, return values vs prints, exceptions, time/output limits, cancellation, and succeeding after Stop. Check that errors, timeouts and cancelled checks cannot become passes. |
| 3 · Persistence | Exercise save, reload, retry, reset, drafts, past versions and completed reports. Verify supporting IDs on events, exactly one completion, repeatable rating updates and visible recovery on failed save. Test storage quota and conflicting writes when affected. Preserve earlier records on migration. |
| 4 · UX and accessibility | Check current tokens and semantic typography, both themes, distinguishable status, reading/reflow, accessible names and alerts, focus and editor Tab escape, and mobile input as appropriate. Attach synthetic evidence of the states that changed. |
| 5 · Privacy and security | Check tracked/untracked paths, diffs, historical commits being exposed, workflow logs and PR media. Review permissions, third-party code and licenses, client/runtime trust boundaries and outbound communications. Use synthetic evidence only. |
| 6 · Regression | Run the relevant existing Climb, Gym and implemented assessment checks, plus a meaningful negative test. Document covered and untested paths. Avoid a release claim for preview-only surfaces. |
| 7 · Independent review | Reviewer samples runnable behavior or inspects replayable evidence and source. Review new teaching patterns, major navigation and high-impact ambiguous experiences with the owner at a hands-on checkpoint. Routine repetitions of accepted patterns can use reviewer sampling. |
| 8 · Release approval | Close blockers, document remaining limitations, obtain explicit approval before release/merge, preserve public history, and verify the deployed revision if applicable. |

Wrong teaching, a solved starter or leaked answer, false completion or independence, silent lost work, an inaccessible critical action or a keyboard trap, and privacy, billing or execution-boundary violations are blockers regardless of aggregate scores. Unavailable checks are listed with impact and reviewed at the appropriate gate. Review output gives severity (Blocker, Major, Minor or Suggestion), domain, exact file/line or state, observed evidence, learner impact and a concrete correction or test. Treat uncertainty as such. Group cosmetic polish when it does not impair an accepted goal.

## Runtime and storage review

The stack is React, strict TypeScript, Vite, CSS tokens, CodeMirror 6, a Pyodide Web Worker and local evidence. Keep stable IDs and boundaries between platform UI, authored Course Packs, progression, runtime, grading, evidence and reasoning. Runtime adapters should stay subject-neutral. Add an abstraction when a real requirement needs it.

Run trusted educational code in the worker with timeout, output budget, cancellation and reset. Route stdout, stderr, returned values and exceptions into safe distinct views. Avoid untrusted HTML or evaluating learner code in the application context. Browser-side tests and verdicts are inspectable. Browser Python is not hard isolation for malicious multi-tenant code and the browser controls memory. A future external execution service needs its own isolation, authorization and resource review. Before supporting a new package, measure load/runtime effects and test the declared dependency. Preserve the lockfile, and review the security and provenance of new dependencies.

Record versioned course, lesson, exercise, runtime and grader evidence with stable attempt/session IDs. Avoid overwriting submissions, the assistance they received or their outcomes. Retain failed and interrupted activity without inventing a verdict. Record results against attempt IDs and completion against the session for idempotence. Migrations need old-format fixtures, a safe fallback or rollback, and evidence of preserved drafts and completions. In a future synced store, preserve both conflicting source drafts and require account-scoped authorization, idempotent event replay, retention controls and tests for deletion across devices. The pilot uses origin-scoped localStorage with quotas and no cloud backup; use one editing tab and do not promise cross-device recovery.

## Public and provider boundaries

Inspect outgoing commit payloads, commit metadata and paths for credentials, tokens, secrets, real code/evidence or exports, personal career/employer details, private paths and unreviewed third-party content. Keep private archives and handoff material outside the checkout and out of artifacts, previews, test logs and screenshots. Verify ignore rules with representative environment, credential, learner and build paths. Inspect diffs manually because pattern scans cannot tell whether an ordinary-looking example is private. Public source should include educational rationale and system design. Licensing and publishing require authorization.

No billable AI is allowed under the current decision. Verify eligibility, consent, billing and limits with official sources before offering an authorized provider. Separate the ENNTOR account from the provider connection. Access to an approved history need not entail transmitting it. Retrieve only relevant evidence, show and honor the scope, and keep revocation, deletion and local deterministic learning possible. Never include keys in client JS or logs. Treat prompts, retrieved content, tutor text and learner source as untrusted input. Model prose cannot override deterministic grading or silently alter official content. Evaluate feedback against a versioned reviewed set of correct and incorrect work, disclosure levels, real evidence links, rejection/fallback and learning usefulness. See [accepted amendments](../architecture/DECISIONS.md#accepted-product-amendments).

## Automated evidence

From the repository root with supported Node.js, run:

```sh
npm ci
npm run typecheck
npm test
npm run build
```

For a reviewable PR, record exit status, test count, runtime/browser environment and uncovered paths. The basic CI workflow uses a standard public GitHub-hosted runner with read-only contents permission and a pinned action revision. It collects compile, test and build results. Browser flow and independent review are additional evidence. See [GitHub billing and usage](https://docs.github.com/en/actions/concepts/billing-and-usage).

## Browser and visual evidence

1. Check out the exact PR head in the sanitized development checkout. Start Vite with the README commands. Do not clear any personal profile or reuse it for evidence.
2. Install Playwright and Chromium with the README steps. Run the relevant editor, results and, when present on the reviewed branch, Gym flow scripts with `ENNTOR_TEST_ORIGIN` set to the test server. Existing scripts create fresh browser contexts and use synthetic submissions. For further checks, launch another fresh Playwright context or disposable browser profile with no persistent user history, and add only fabricated attempts or the authored examples. Give clear reproduction steps when using manual states.
3. Capture a small, intentional set of screenshots with the browser's screenshot function or Playwright's `page.screenshot`. Use desktop light and narrow/mobile dark, and swap themes when contrast is in scope. Include a negative state and its recovery, progressive help, and the separate report for changes to those flows. Use browser-level keyboard checks and verify accessible names and visible focus. Review physical Android, macOS Safari, screen reader, reduced motion, 200% zoom and relevant other device checks explicitly rather than inferring them from headless viewport tests.
4. Choose states appropriate to the diff. Examples include Home doors, Learn's semantic symbols, prediction committed and correct/incorrect feedback, initial unsolved Modify and partially scaffolded Build, blank Make, pass/fail and full-transfer paths. For Gym capture no-history or relevant-practice entry, warm-up, a failed check with one nudge, worked solution and transfer as applicable, report with success or unsuccessful completion, and a new attempt distinct from old success. Include restored drafts or failure recovery when affected. For future Room work include the disclosed rules, timer/assistance state and debrief.
5. Before sharing, inspect each image and its metadata, title, fixture and any attached log for personal evidence, identity or machine paths. Attach just the needed synthetic media to the PR with route, fixture, viewport, theme and finding in the caption or alt text. A supported, approved isolated preview may help. An independent reviewer cannot normally open the implementer's localhost. Include commands and diff links for reproduction. Screenshots cannot test a keyboard escape or verify that a save actually persisted.

## Review workflow and authoring scale

Start from a clean verified public base, preserve existing history with feature refs, inspect outgoing commits and push a scoped review branch. Use draft PRs for work awaiting independent review. Keep governance and feature changes separate when each can be reviewed against main. Document intent, changed paths/content versions/routes/schema, how old drafts behave, teaching evidence, actual verification, risks and one or two review questions. Confirm the remote head and base after publication. No force push or automatic merge is needed for review.

A reviewer reads activities in order, checks source/test evidence and reproduces key failures and recoveries. In a content batch, sample across levels and fully inspect novel activity forms, grading changes, generators, numerical or ML risk, and changed prerequisites. An implementer resolves findings on the same branch and reruns affected checks. The owner reviews genuinely consequential questions and signs off on release. Neither an assistant nor an independent reviewer should claim to continuously watch another session.

Before large-scale authoring, establish version/ID and prerequisite validations, executable snippets, refs and fixtures, author-facing validation reports, semantic reference checks, near-copy detection for review, a hint disclosure and assistance audit, source-linked manifests, and exercised synthetic progress states. Include cross-lesson reuse, prior-version data and delayed retrieval in test planning. A small representative contiguous unit is the proposed way to validate the pipeline before widening batch sizes. See the [learning review rubric](LEARNING_STANDARDS.md#review-before-release) and [open decisions](OPEN_DECISIONS.md).
