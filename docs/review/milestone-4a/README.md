# Milestone 4A teaching review

Self-review on 19 November 2026. Independent educational, UX and engineering review is pending. Source is the [authoritative curriculum v1.1, F01](../../Python_AI_Interview_Learning_Curriculum_v1.1.md#2-f01--execution-state-and-references). The product sequence is F01.01 → F01.02 → F01.03. F01.01 content stays at lesson edition 1.3.0, with prior completed editions accepted for progression. This entry does not implement O00 placement or an F01 module gate.

The three-lesson boundary lets the learner move from expression dependencies to time-varying bindings and then to two kinds of comparison. Identity uses list construction and indexing as a minimal bridge. F01.04 can reuse the identity diagrams when it introduces mutation. It would be premature to introduce mutation or copying while the learner is still distinguishing arrows and contents.

| Synthetic state | Evidence |
| --- | --- |
| The Climb, desktop, one old-edition completion and one locked lesson | [Prerequisites and report link](climb-progression.jpg) |
| Reassignment, desktop, a wrong prediction | [Investigate and learner-confirmed hypothesis](reassignment-investigate.jpg) |
| Reassignment, desktop, assisted Make followed by unaided transfer | [Saved result](reassignment-report.jpg) |
| Identity, narrow dark theme and blank editor | [Make contract, hint disclosure and editor](identity-make-dark-mobile.jpg) |

The browser script prepares a fresh profile, uses synthetic records and blocks external requests. Screenshots reflect fallback fonts under those conditions. Reproduce using the [authoring workflow](../../curriculum-authoring.md#verify-and-share-the-review-evidence).

## F01.02 · Variables and reassignment

**Source and version.** Curriculum v1.1 §5, F01.02; lesson and exercises 1.0.0, pack 1.4.0. Objective is to trace a name across assignments and integer updates, and retain an earlier reading after another name is rebound. Prerequisite is completed F01.01 and the ability to trace an expression, use basic signed integers and read a tiny function. New ideas are state rows, two names sharing an integer and changing one binding with an ordinary assignment or integer augmented assignment. Reference cue P01. Estimated effort 15 minutes.

**Sequence and evidence.** Learn uses a four-assignment trace with a checkpoint of 9 and final reading of 7. Predict asks for the difference after two updates. Zero could follow from changing both names in the trace. The lesson invites confirmation and follows an incorrect prediction with a different state sequence. Modify changes which name the caller receives. Build gives both a snapshot and update, asks which reading a score doubles, and leaves the return to the learner. Make requires writing the battery report from two distinct readings and a blank editor. The transfer is a signed calibration with a weighted checkpoint rather than summing two nonnegative readings.

**Hints and boundaries.** Modify and Build have H0. Make has H0 (locate the two readings), H1 (preserve both names), H4 (worked implementation and a zero-top-up check). Before H4, the editor contains a comment only. Transfer has no hints. Cases include zero and signed updates, depletion, no consumption, no top-up, all zero and crossing zero. Wrong fixtures report the updated value alone, double the earlier Build value, count the top-up twice, or weight the wrong calibration reading.

**Gate and limitations.** Finish requires prediction investigation and checked Modify, Build and Make work. After implementation help, finish requires a fresh unaided transfer. An assisted Make can complete if its help was conceptual, and the report records that assistance. Cases observe behavior, so an equivalent correct expression may pass without writing a separate named snapshot. Editorial review should check that the surrounding trace and Build elicit the intended mental model and that the calibration context is sufficiently distinct. There is one transfer variant per edition.

## F01.03 · Identity and equality

**Source and version.** Curriculum v1.1 §5, F01.03; lesson and exercises 1.0.0, pack 1.4.0. Objective is to trace shared and separate lists and distinguish object identity from equality of contents. Prerequisite is completed F01.02, earlier assignment and arithmetic skills, and ordinary function reading. New ideas are aliases, list creation, zero-based indexing, identity and equality comparisons, and converting the comparison to an integer. The lesson teaches these small mechanisms before requiring them. Reference cue P01. Estimated effort 15 minutes.

**Sequence and evidence.** The first worked example contrasts a shared alias with a separate equal list. The second retrieves two entries and converts the comparisons to integers. Predict counts two identity checks. Two is consistent with treating contents as identity. The learner can confirm or reject that explanation, then trace a different selection in the follow-up. Modify switches a contents check on separate readings. Build supplies the selected object and asks what to return for equal-but-distinct lists. Make constructs a rack of three slots and assigns outcomes 0, 1 or 2. Transfer varies both selected slots and asks for just the distinct-equal case. It introduces no new identifier or operator semantics.

**Hints and boundaries.** Modify and Build have H0. Make has H0 (draw the arrows), H1 (distinguish the two checks), H4 (worked code and a distinct-equal comparison). No transfer hints. Public cases include repeated aliases at different indices, selecting the same alternate object twice, equal/unequal distinct lists, negatives, zero and reversed selection. Wrong implementations swap identity and equality or award points to aliased objects.

**Gate and limitations.** Same assessment and assistance rules as F01.02. No identity tests use interned scalars. The instructions intentionally request comparison of both identity and contents. The grader checks the behavioral contract and cannot establish the actual comparison strategy for an equivalent special-case solution. A review should check the cognitive cost of indexing and integer scoring and whether comparing two arbitrary slots shows enough transfer beyond Make. There is one transfer variant and no module-level mastery claim.

## Verification record

The content report and automated suite executed the existing pilot and both new lessons on the pinned Pyodide runtime. All 12 tests, typecheck and the production build passed. Chromium checked the pilot editor and saved reports, the Gym including competing writes, and the new lesson path including direct locked routes, old-edition evidence, focus, narrow layout, resumed draft, H4 disclosure, unaided transfer and the optional rating.

## Independent review checklist

Read both lessons in order alongside the full curriculum. Verify the stated prerequisites, copy, intended and alternative solutions, exact levels of disclosure, and how fresh transfer differs from Make. Review the checks for cases in which a shallow implementation passes. Inspect the keyboard route, history boundaries, both themes and responsive screenshots. Physical Android, Safari and screen-reader behavior were outside the synthetic Chromium checks. There are no durable cross-device or comprehensive multi-tab guarantees. The authoring report checks reliable executable and structural conditions; pedagogical review and learner outcomes require separate evidence.
