# Milestone 4B teaching review

Implementer self-review, 21 November 2026. This draft builds on PR #3 at 2fdfc63. Independent academic, UX and engineering review is pending. The owner’s F01.03 trial remains a separate checkpoint.

The source for all three lessons is [curriculum v1.1 §5, F01 · Execution, state and references](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#2-f01--execution-state-and-references). All three lessons, exercises and traces start at edition 1.0.0. The pack is 1.8.0, the module is 1.5.0, and the earlier three lesson editions and draft keys carry forward. The worked programs and problem scenarios were authored for ENNTOR.

## F01.04 · Mutable and immutable types

**Objective and prerequisite.** Understand list mutation versus integer/string rebinding, predict the effect of a list update through another reference, and explain why aliases observe a shared edit. F01.03 supplies identity versus equality, names, list construction and zero-based indexing. F01.04 adds list-slot assignment, last-position indexing, list concatenation and type-dependent augmented assignment. Budget 20 minutes. Mentor notes ask the learner to distinguish an object edit from moving a name, then draw the aliases to an in-place update. [P02](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#p02) · [P03](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#p03)

**Teaching and evidence.** The worked examples show an alias surviving an edit, an alias staying behind after a rebind, and the difference between integer, string and list updates. Predict commits to the length visible through a watcher before running Python. Follow-up contrasts concatenation with in-place extension. In the required table, the learner chooses an A/B object label for the active binding and independently reports both list lengths. A particular wrong row can prompt a question about which name the assignment targets.

**Scaffolding and transfer.** Modify starts with a function whose returned list looks right, while the caller’s input remains unchanged. The new requirement specifies the caller-visible result and leaves the edit open. Build asks the learner to explain why the caller sees the mutation, then provides the label text and asks the learner to update the list and return its count. The blank Make changes a board’s first slot and reports values from two moments. The itinerary transfer moves to an outer append and a prior-last-stop/current-count report. H0 asks about objects or timing, H1 focuses the relevant state, and H4 provides a worked implementation on request.

**Assessment and first-read review.** Six cases each cover empty inputs where permitted, singleton endpoints, duplicates, order, and zero or negative readings. In the single-entry board, that entry is both first and last, so its old and new values differ in the report. The fixtures reject a rebind presented as a mutation and a last value captured too early. Check that the label-tagging Build still makes the required edit worth reasoning about. Correct input effects and returns alone leave the learner’s explanation of shared identity to the trace. [Lesson source](../../../src/courses/f01-04.ts)

## F01.05 · Copy, shallow copy and nested lists

**Objective and prerequisite.** Compare assignment, full slicing, list construction, the copy method and deep copy. Select a copy boundary, deliberately edit the nested data, and check what the original caller observes. F01.04 supplies in-place versus new-object edits, appending, and first/last indexing. The examples introduce nested slots, shallow versus deep copies, and the one needed standard-library import. Budget 22 minutes. Mentor notes use two outer boxes with arrows to one inner list, and recommend a deliberate nested mutation to test isolation. [P02](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#p02)

**Teaching and evidence.** One worked example compares all four assignment and shallow-copy techniques on the same data, then demonstrates outer-only and inner edits. The deep example starts with equal contents and uses an empty inner row to remove any expectation that equality establishes sharing. Predict asks for two lengths after two edits, and the follow-up checks isolation after deep copying. The required table compares outer identity, first-row identity and original row length across assignment, full slicing and deep copy. A matching wrong row can prompt the learner to consider which level a slice copies.

**Scaffolding and transfer.** Modify repairs unwanted source mutation while keeping the preview’s result. Build uses a shallow copy for an outer-only addition and asks the learner to distinguish a group from its contents. Blank Make makes two inner edits in a preview, including the case where both belong in one leg. Transfer reverses the direction: packing staff need a real edit to their box and a preserved pre-edit report. H0 locates at-risk objects, H1 identifies the relationship between time or copy depth and the contract, and H4 walks through the effect on both outcomes.

**Assessment and first-read review.** Inputs specify separate row objects. Equal contents and empty rows remain valid, including a one-leg route that receives both markers in departure-then-arrival order. Public checks reject a shallow preview that leaks data changes even when its return is correct. One alternative copies only the at-risk row where that meets the contract. A reviewer should evaluate the transition from the outer-only Build to the first/last inner edits and whether the scenarios make the reason for each copy clear. The executable cases observe contents at return. The direct trace supplies reference evidence. [Lesson source](../../../src/courses/f01-05.ts)

## F01.06 · State tracing laboratory

**Objective and prerequisite.** Combine evaluation order, name bindings, identity and contents, mutation and copy depth in a dry-run table without hints. Follow state across successive function calls. F01.05 supplies the two copy depths and nested-reference model. The lab combines existing syntax across calls, including a parameter pointing to the passed object. It uses no future-module control flow or general function decomposition requirements. Budget 25 minutes. The mentor cue asks the learner to keep identity and contents in separate columns during assignment, slicing and mutation. [P03](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#p03)

**Teaching and evidence.** A worked dry run follows two calls, with a rebind from a shallow copy to a deep one between them. Another example replaces a slot in the copied outer list. Predict uses an empty shared row and weights two reported sizes. Its follow-up checks the effect of replacing a copied slot between calls. The required table compares first-row identity and contents and tracks when the weighted score is bound. A matching incorrect score can prompt a question about expression grouping. A correct trace with requested help is reported as assisted even if later coding work is independent.

**Scaffolding and transfer.** Modify repairs a drifting report around two live calls. Build supplies the copying step and first invocation, then asks the learner to continue the same rehearsal and score it. Blank Make requires two complete checkpoints for a rehearsal, first with an appended entry and then with a replaced row. Live-adjustment transfer changes an original reading twice and preserves a complete intermediate checkpoint. That changes the required ownership, the kind of edits, and the shape of the result. H0 asks the learner to place observations on a timeline, H1 singles out the state that must survive, and H4 runs through the resulting states.

**Assessment and first-read review.** Cases cover empty first rows where permitted, unchanged rows, duplicates, signed changes and a live adjustment that returns to its initial value. Wrong fixtures overwrite the first checkpoint, restart each event from the original data, group the expression incorrectly, or reuse a shallow snapshot. The contract allows an equivalent implementation that computes the right observables with fewer calls. Multi-call reasoning is checked separately in the dry run. Review whether the F01.06 combined demand is manageable and the rehearsal-to-audit progression requires meaningful transfer. [Lesson source](../../../src/courses/f01-06.ts)

## Session completion and the curriculum gate

The required trace, Modify, Build and Make checks use the existing lesson flow. Full solution help on Make requires a separate passing Final MAKE. Conceptual, guidance and worked trace help stay available by request. A helped transfer pass can finish as practice. Fresh unaided evidence is recorded separately, and previously seen variants remain practice. Learners who pass Make can choose the transfer as optional reinforcement. The saved report identifies the evidence used for completion.

Curriculum v1.1 sets a distinct F01 module gate of **two novel blank-editor functions at foundation difficulty, passing required edge cases without full-solution hints**. This draft delivers the teaching sequence and records per-task evidence. The two-task module gate, multi-variant freshness policy and general readiness thresholds need separate implementation and review. Lesson completion carries no module-level mastery finding. Each new lesson has one Make and one transfer, and all delivered fixtures are public. Trace tables capture structured reasoning. Independent explanation and retention need separate evidence.

## Verification and synthetic browser evidence

- The content validator checks authoring order and symbol scope, executes all six new worked examples, every prediction and follow-up, and all three trace probes on Pyodide. It checks 72 public cases across the twelve new coding activities, including failing starters, reference solutions, wrong solutions and alternative valid implementations.
- Local checks use Node 24, content validation, strict TypeScript, the automated suite, a production build, and Chromium with synthetic records. Earlier F01.01–F01.03 Climb, pilot editor and reports, and Gym have separate browser suites. The new flow exercises all twelve coding activities, unlocking, case-based coaching, help, save/resume, and assisted and unaided outcomes.
- Chromium evidence covers a keyboard workflow and 390px mobile reflow. Physical devices, macOS Safari and screen-reader testing remain outside this draft’s verification. Images use fallback fonts because external requests are blocked in the disposable test context.

| Synthetic state | Evidence |
| --- | --- |
| Desktop light · F01.04 after tracing the edit, rebind and subsequent update | [Different bindings and lengths](mutation-binding-trace-desktop-light.jpg) |
| Desktop light · F01.05 starter returns the expected preview and leaks the nested edit | [Failed input-state cases and coaching](shallow-copy-failure-desktop-light.jpg) |
| Mobile dark · F01.05 after requested help on Make and Final MAKE | [Saved report and assistance classification](copy-assisted-report-mobile-dark.jpg) |
| Mobile dark · F01.06 after an unaided multi-call trace | [Identity, contents and evaluation order](laboratory-trace-mobile-dark.jpg) |

With the isolated development server running, reproduce the images using the existing Playwright setup and a disposable profile.

~~~sh
ENNTOR_TEST_ORIGIN=http://127.0.0.1:5177 \
  ENNTOR_REVIEW_SCREENSHOTS=/tmp/enntor-4b-review \
  node scripts/check-f01-state-browser.mjs
~~~

Independent reviewers should read F01.04 → F01.06 before looking at solutions. Paraphrase the singleton board, one-leg route and two-checkpoint rehearsal on first reading. Run the shallow-preview regression and check that the feedback leaves a correction for the learner to discover. Inspect the lab’s separate trace and coding outcomes and confirm the module boundary is visible in the review documentation.
