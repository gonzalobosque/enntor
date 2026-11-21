# Author and validate a curriculum batch

Use [Learning Standards](quality/LEARNING_STANDARDS.md) and [Release Gates](quality/RELEASE_GATES.md). Read the curriculum row and neighboring lessons before choosing the scope. The [4A review manifest](review/milestone-4a/README.md) models how to record an objective, newly introduced prerequisites, scaffold distance, evidence, hint levels and known limits.

## Add content

1. Choose the official lesson ID and objective from [curriculum v1.1](Python_AI_Interview_Learning_Curriculum_v1.1.md). Give the lesson and each exercise stable IDs and explicit editions. Add the lesson to the ordered module and identify prerequisite lesson IDs in [the pack](../src/courses/course.ts). Module prerequisites refer to completed modules, currently meaning all of that module's authored lessons. Do not present an unfinished module as a mastery gate. Use a bridge requirement for a new prerequisite or materially different objective rather than treating an old completion as if it checked new material.
2. Write one content module per lesson. Use the shared Python builders for this sequence and the existing semantic spans. Introduce symbols before using them in explanatory prose. Supply a worked example, numeric prediction and follow-up, a local edit in Modify, explicit planning and partial code in Build, then a blank Make and unaided transfer. Use clear input bounds, edge cases and output contracts. Use a tentative diagnosis only when the prediction gives a defensible reason to suggest it.
3. Add evidence fixtures in [foundation fixtures](../scripts/content/foundation-fixtures.mjs). Provide exact worked output, reference code, a plausible wrong implementation and the public case that should reject it. For a direct reasoning objective, add a trace grid and a separate executable probe for each required binding or comparison. Preserve behaviorally equivalent implementations and use the trace to assess reasoning directly. Add a zero or boundary case only if it belongs to the contract. Keep authored H4 text explanatory and keep executable solution code out of earlier hints.
4. Add a review manifest. Record exact lesson/exercise versions, introduced and assumed prerequisites, explanation/scaffold decisions, why transfer is new, whose assistance is being measured, test evidence and where editorial review is needed.

The [structural loader](../src/courses/load-course-pack.ts) checks ownership, uniqueness, ordered prerequisite edges and the activity sequence independently of Python. The registered sequence uses numeric predictions and supports integer returns and structured list cases with the existing Python runtime and UI. A future subject with these activity shapes can reuse the pack rules. A different response, engine or stage shape requires its own adapter. Lessons in this unit are trusted typed source modules, and this release has no arbitrary content import. The six F01 lessons are currently bundled together. Measure download size and split packs or lesson batches as the registry grows before enabling the full catalog.

## Validate a lesson and its neighbors

```sh
npm run validate:content -- F01.02
npm run validate:content
npm run typecheck
npm test
npm run build
```

The command resolves source curriculum IDs and titles, checks structural references, verifies outputs in the pinned Pyodide runtime, exercises starters, references, released H4 code and wrong fixtures, and checks tagged symbol scope from Python syntax. It reports per-lesson evidence or exits with an error. The full validation is part of the automated suite. The checker establishes that the examples and given cases agree with executable code. An independent reviewer still needs to assess explanation clarity, difficulty, whether the public tests measure the intended skill, near-copy answers and hint disclosure. Browser-delivered fixtures are public.

Keep the pack ID and stable lesson IDs when releasing more content. Update the pack edition and bump affected lesson/exercise editions for meaningful changes. Completed old editions stay readable and continue to satisfy their stable prerequisites under the current policy. Unfinished old editions remain in history with their own draft keys; they are not replayed as a new edition's active session. Archive reporting uses saved outcome data and original edition. Opening a transfer records the exact exercise edition, even without a submission. A correct repeat of an already-seen transfer can close a practice session without new independent evidence. Completed trace checks retain their own versions and attempt IDs. F01.01 has an explicit compatibility shim for its original Modify key and historical completion policy. The pilot uses browser-local storage, and one editing tab remains the supported workflow.

## Verify and share the review evidence

Run development Vite, install Playwright locally as described in the README, and run the browser suites. Use a disposable browser context and save only synthetic screenshots.

```sh
ENNTOR_TEST_ORIGIN=http://127.0.0.1:5173 \
  ENNTOR_REVIEW_SCREENSHOTS=/tmp/enntor-review \
  node scripts/check-climb-browser.mjs
```

Without `ENNTOR_REVIEW_SCREENSHOTS` the script captures no images. Include relevant screenshots and reproduction commands in the PR. Inspect the files before publishing. Also run the existing pilot editor/results and Gym browser checks. The current batch verifies keyboard and narrow-layout behavior in Chromium. Test physical devices or assistive technologies separately when the release requires them.


### First-read contract and revisions

Use the [first-read exercise review](quality/LEARNING_STANDARDS.md#first-read-exercise-review) before accepting a task. Choose semantic spans for names, operators, exact input tokens, object labels and decisive conditions. Text must still identify the meaning of each span without relying on its color. A trace with a fixed choice vocabulary may declare object-label choices and use accessible selects.

Version an exercise when the contract wording or help changes materially. Explicitly register a resumable prior edition only when starters, assessment cases, trace IDs and expected answers remain compatible. Pin the assessment editions used by the saved session. A clarification can change the presentation while new attempts and help events record the presentation edition separately. Treat older versions of the same behavioral exercise as previous exposure when judging independence. Earlier records remain in history even when incompatible editions cannot resume in place.

### List and input-state cases

Use \`return-and-arguments\` for cases that require a return value and an observable input state after the call. Provide the complete argument list in order before and after, including scalar parameters. The current Python sequence admits safe integers, strings and ordered lists of those shapes. It checks Python value types before JSON serialization so a tuple with the same items cannot pass as a list. \`listCase\` in the Python authoring helpers pairs the first argument’s post-call list with the unchanged remaining arguments. Include a case that returns the right value but breaks a caller-visible state requirement. Also test an equivalent implementation that satisfies the same contract.

Nested input fixtures cross the worker boundary as JSON, so exercise statements specify separate input rows. Direct authored trace probes exercise identity and alias graphs. The grader records values at return and preserves the existing numeric behavior. It makes no claim about Python object identity, transient edits, or later modifications to returned objects.

In [the F01 state fixtures](../scripts/content/state-fixtures.mjs), the executable H4 implementation is the reference for each new exercise. Keep the separately authored outputs, trace probes, plausible wrong implementations and valid alternatives in fixtures. Test every execution path against both the return and argument state when configured. Explanations accompanying H4 code still need a manual check.
