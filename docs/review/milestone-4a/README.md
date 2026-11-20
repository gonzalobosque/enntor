# Milestone 4A teaching review

Self-review updated 20 November 2026 after the independent review. Final re-review and a product-owner hands-on trial of F01.02 and F01.03 are required before merge. Source is the [authoritative curriculum v1.1, F01](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#2-f01--execution-state-and-references). The product sequence is F01.01 → F01.02 → F01.03. F01.01 content stays at lesson edition 1.3.0, with prior completed editions accepted for progression. This entry does not implement O00 placement or an F01 module gate.

The three-lesson boundary lets the learner move from expression dependencies to time-varying bindings and then to two kinds of comparison. Identity uses list construction and indexing as a minimal bridge. F01.04 can reuse the identity diagrams when it introduces mutation. It would be premature to introduce mutation or copying while the learner is still distinguishing arrows and contents.

| Synthetic state | Evidence |
| --- | --- |
| The Climb, desktop, one old-edition completion and one locked lesson | [Prerequisites and report link](climb-progression.jpg) |
| Reassignment, desktop, a wrong prediction | [Investigate and learner-confirmed hypothesis](reassignment-investigate.jpg) |
| Reassignment, incorrect intermediate binding | [Graded state table](reassignment-trace.jpg) |
| Identity, narrow dark theme after the handoff trace | [Identity and equality checked separately](identity-transfer-trace.jpg) |
| Reassignment, worked trace requested after repeated mistakes | [Worked explanation and continuation](reassignment-worked-trace.jpg) |
| Reassignment, failed Make with a synthetic unused calculation | [Code-aware coaching beside public results](reassignment-make-coaching.jpg) |
| Reassignment, desktop, coached Make followed by unaided transfer | [Saved result](reassignment-report.jpg) |
| Identity, narrow dark theme and blank editor | [Make contract, hint disclosure and editor](identity-make-dark-mobile.jpg) |

The browser script prepares a fresh profile, uses synthetic records and blocks external requests. Screenshots reflect fallback fonts under those conditions. Reproduce using the [authoring workflow](../../curriculum-authoring.md#verify-and-share-the-review-evidence).

## F01.02 · Variables and reassignment

**Source and version.** Curriculum v1.1 §5, F01.02; lesson 1.2.0, Modify, Make and transfer 1.1.0, other exercises 1.0.0, pack 1.6.0. Objective is to trace a name across assignments and integer updates, and retain an earlier reading after another name is rebound. Prerequisite is completed F01.01 and the ability to trace an expression, use basic signed integers and read a tiny function. New ideas are state rows, two names sharing an integer and changing one binding with an ordinary assignment or integer augmented assignment. Reference cue P01. Estimated effort 15 minutes.

**Sequence and evidence.** Learn uses a four-assignment trace with a checkpoint of 9 and final reading of 7. Predict asks for the difference after two updates. Zero could follow from changing both names in the trace. The lesson invites confirmation and follows an incorrect prediction with a different state sequence. A four-row state table directly checks both bindings after each assignment, including the unbound first row. The paired updates pattern gives specific feedback only when both later rows move both names together. Modify changes which name the caller receives. Build gives both a snapshot and update, asks which reading a score doubles, and leaves the return to the learner. Make requires writing the battery report from two distinct readings and a blank editor. The transfer is a signed calibration with a weighted checkpoint rather than summing two nonnegative readings.

**Hints and boundaries.** Modify and Build have H0. Make has H0 (locate the two readings), H1 (preserve both names), H4 (worked implementation and a zero-top-up check). Before H4, the editor contains a comment only. Transfer has no hints. Cases include zero and signed updates, depletion, no consumption, no top-up, all zero and crossing zero. Wrong fixtures report the updated value alone, double the earlier Build value, count the top-up twice, or weight the wrong calibration reading.

**Gate and limitations.** Finish requires prediction investigation and checked Modify, Build and Make work. After implementation help, an unseen transfer requires an unaided pass. If the only variant was seen earlier, a successful repeat finishes as practice with no new independent coding evidence. An assisted Make can complete if its help was conceptual, and the report records that assistance. Cases observe behavior, so an equivalent correct expression may pass without writing a separate named snapshot. Editorial review should check that the surrounding trace and Build elicit the intended mental model and that the calibration context is sufficiently distinct. There is one transfer variant per edition.

## F01.03 · Identity and equality

**Source and version.** Curriculum v1.1 §5, F01.03; lesson 1.2.0, Make and transfer 1.2.0, other exercises 1.0.0, pack 1.6.0. Objective is to trace shared and separate lists and distinguish object identity from equality of contents. Prerequisite is completed F01.02, earlier assignment and arithmetic skills, and ordinary function reading. New ideas are aliases, list creation, zero-based indexing, identity and equality comparisons, and converting the comparison to an integer. The lesson teaches these small mechanisms before requiring them. Reference cue P01. Estimated effort 15 minutes.

**Sequence and evidence.** The first worked example contrasts a shared alias with a separate equal list. The second retrieves two entries and converts the comparisons to integers. Predict counts two identity checks. Two is consistent with treating contents as identity. The learner can confirm or reject that explanation, then trace a different selection in the follow-up. Before Modify, a graded trace asks which named object is referenced and separately checks identity and equality. Modify switches a contents check on separate readings. Build supplies the selected object and asks what to return for equal-but-distinct lists. Make constructs a rack of three slots and assigns outcomes 0, 1 or 2. Post-solution transfer uses two successive rebindings and an optional reattachment to an archived list. A separate graded handoff trace compares identity and equality while both names can be rebound. The coding contract counts distinct equal objects across two updates instead of assigning a badge to a static rack slot. It can be solved using the syntax already taught.

**Hints and boundaries.** Modify and Build have H0. Make has H0 (draw the arrows), H1 (distinguish the two checks), H4 (worked code and a distinct-equal comparison). No transfer hints. Public cases include repeated Make aliases, equal and unequal distinct lists, zero, and separate first-only and second-only handoff matches. The restore case rejects counting a reattached object as a duplicate. Scalar alternatives for both Make and transfer pass the public cases.

**Gate and limitations.** Same assessment and assistance rules as F01.02. No identity tests use interned scalars. Code grades measure the behavioral contract and do not enforce source shape. Trace evidence separately records answers, missed cells, observed patterns, revision, prior exposure and the checks that supported completion. The report distinguishes a first correct check, correction after feedback, and a previously seen trace. A reviewer should assess the cognitive cost of following the reference handoff and whether the new temporal arrangement transfers the intended concept. There is one transfer variant and no module-level mastery claim.

## Verification record

The content report and automated suite executed the existing pilot and both new lessons on the pinned Pyodide runtime. All 14 tests, typecheck and the production build passed. Chromium checked the pilot editor and saved reports, the Gym including competing writes, and the new lesson path including direct locked routes, old-edition evidence, focus, narrow layout, resumed draft, H4 disclosure, unaided transfer and the optional rating.

## Independent review checklist

Read both lessons in order alongside the full curriculum. Verify the stated prerequisites, copy, intended and alternative solutions, exact levels of disclosure, and how fresh transfer differs from Make. Review the checks for cases in which a shallow implementation passes. Inspect the keyboard route, history boundaries, both themes and responsive screenshots. Physical Android, Safari and screen-reader behavior were outside the synthetic Chromium checks. There are no durable cross-device or comprehensive multi-tab guarantees. The authoring report checks reliable executable and structural conditions; pedagogical review and learner outcomes require separate evidence.


## Trace assistance and owner trial

All three gated tables offer a conceptual hint, a more concrete tracing method and a learner-requested worked explanation for each row. A wrong check never opens the answer. Learners can use the worked trace to correct their own table and submit it. Each help exposure stores the trace ID, edition, level and time separately from the answers and correctness. The report labels passes with trace guidance or the worked explanation as assisted. Coding passes and transfer gates retain their existing rules.

For the owner trial, try both lessons on the local development instance. Submit a wrong intermediate binding or comparison twice, ask for each help level, reload and use the worked explanation to finish the table. Check that the subsequent activity opens and that the saved report describes the trace assistance and coding outcome separately. In F01.03, try the same flow on the handoff trace after revealing the Make solution.


## Product-owner teaching corrections

The F01.02 trial exposed concrete problems with feedback placement, the Modify contract, missing Build premises and the chronology of Make. The owner's positive response to the state table supports varying activities with a clear purpose. These observations describe one trial. They do not measure population difficulty or establish a misconception.

Build questions now introduce the whole rule before the choices. The content validator checks each Build planning example against both its public fixture and executed reference. Editorial review still checks that the wording and choices can be solved from the premises supplied. The Make timeline separates the starting charge from the two logged readings and its example is executable.

Climb coaching checks syntax and runtime outcomes with the shared Gym execution diagnostics. A narrow Python analysis can find an unused arithmetic assignment in a straight-line function. Other cases use actual inputs and results. The learner sees one question before the test table. A repeated observation gives way to an unused failed case where one exists. Saved evidence distinguishes coaching exposure, checks that later passed the discussed case, and independent coding. A coached pass within a fresh transfer can finish without claiming unaided performance. H4 on the original Make still requires another problem.

F01.01 content and older evidence remain intact. Current editions retain the practice identity of the prior wording-only revisions. Drafts from the previous unfinished edition are offered when the new edition has no draft. Prior results remain in their original session. The next product-owner trial is F01.03, with attention to the Build premises, Make and transfer wording, and how coaching feels during repair. Independent re-review remains required.
