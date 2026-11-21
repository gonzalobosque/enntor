# UX and coach voice standards

ENNTOR is a youthful, confident editorial sports/fashion brand. Home is expressive and the editor is quiet. Use warm neutral spaces, dark readable ink, generous breathing room, restrained curves and three graphic ideas: ascent for The Climb, rings/training for The Gym, and a threshold for The Room. Preserve the three doors and the line **Build the skill. Own the room.** Avoid corporate dashboard clutter, neon terminal clichés and cartoon-school styling. Bring energy through type and form rather than animation that distracts from the code. A prominent contextual Continue action is a design recommendation when meaningful progress exists.

## Type and color

Use the existing definitions in [styles.css](../../src/platform/styles.css). `--accent` is the olive brand accent (light `#687944`, dark `#b7cf8b`). `--teaching-code-accent` is the established text-specific olive (light `#566a35`, dark aliases `--accent`). Use the token rather than copying the values into components. Pair primary controls, semantic emphasis, focus and progress with appropriate foreground and surface tokens. Keep Stop, Reset and navigation neutral. Check contrast in both themes and communicate status through text or an accessible label too.

- **Space Grotesk** for the ENNTOR. wordmark and display headings. Main stage headings LEARN, PREDICT, INVESTIGATE, MODIFY, BUILD and MAKE use the shared `.pilot-stage-heading` treatment: uppercase, weight 700, `--teaching-code-accent` and consistent hierarchy. Use proper heading elements and leave subordinate exercise titles and instructional prose in natural case.
- **DM Sans** for body and controls. Use readable widths, paragraph breaks and a shared type scale. Editor/code use monospace with enough room for nested indentation. Current fonts have system fallbacks.
- Use the shared [TeachingText renderer](../../src/learning/TeachingText.tsx) and explicit spans. Functions and methods such as `print()` are olive monospace. Variables and parameters are bold olive in the body face without an underline. Keywords such as `def`, `return` and `pass` are bold monospace. Ordinary operators, expressions and literals use neutral monospace. Inline sizes, baselines and line spacing should match neighboring text. Apply in explanations, hints, instructions and reports. Do not infer roles with regex or render arbitrary HTML.
- Give warnings an accessible icon or label and restrained styling. Show the explicit prediction trap after the prediction is committed, while teaching the underlying rule before Predict.

## Learning surfaces

Give each section a meaningful stage label, goal and obvious next action. Show current progress without a dense dashboard or confetti. Users should be able to identify the route, open or resume the right draft, see what a check proved, and tell whether it saved. Prior work is reachable. Unfinished or unimplemented work is labeled honestly. Historical success should never look like a property of a fresh blank editor.

**Home and Climb.** Keep the doors distinct and preserve a concise orientation. Reopen completed work in its real saved state and provide a report link. Offer an explicit restart that retains past evidence. If a prerequisite blocks a later lesson, explain which requirement remains and the available next action. Base lesson progression on the applicable content contract. A pilot with one playable lesson should not display an invented next lesson.

**Editor.** Preserve CodeMirror 6 and Python-aware coloring of keywords, definitions, calls, literals, strings and comments, line numbers, bracket matching, undo and redo, stable cursor, four-space Tab, Shift+Tab outdent, and parser-aware Enter indentation inside and after nested blocks. Escape then Tab leaves the editor; expose this instruction near it. Keep visible focus, scrollability, keyboard selection and readable code at narrow widths. Use input and syntax tests, including typing with a real Android soft keyboard before a device release where feasible. Avoid automated answer insertion. Optional editor font controls and richer line diagnostics require usability evidence.

**Runs and checks.** Use Check solution as the execution control in current graded editors, including Gym warm-ups. Stop aborts the worker and permits a clean recheck. Predictions have a separate execution action because their printed result is part of the exercise. Show one overall execution summary, one public-case table with inputs, expected, actual and verdict, and technical stdout, stderr and exceptions as relevant. A correct returned value can have empty console output. Predict calls the learner-facing output **Printed result**. Put the verdict in an accessible status immediately below the printed result. Use Investigate for explanation and follow-up. Put a grounded coaching question above or alongside failed return-value evidence. Keep runtime, correctness, activity complete, independent skill, lesson completion and save/failure states distinct.

**Drafts and recovery.** Label restored drafts. Reset returns the selected editor to the authored starter. Try again from scratch starts an explicit fresh effort without silently discarding edited text, past attempts or hints already seen. Leave prior drafts reachable. A failed save must be visible with a recoverable next step where possible. Reload, reopening a completed route, and reviewing past work must leave attempt identity intact. Explain origin-local storage and disclosure limits. Use fewer competing save actions.

**Gym.** Present one trainable concept and why it was suggested, or say there is insufficient evidence and offer optional reinforcement. Warm-up remains independently accessible across reload, reset and new attempt. Make warm-ups combine theory and a tiny executable Modify in a different context. After a checked failure present one evidence-based nudge without interrupting typing. Requested help reveals one action at a time, retains earlier hints, and labels full solution and fresh-transfer implications. Keep active check, latest finished outcome and earlier history separate. A successful warm-up and a finished workout describe different activities.

## Reports and Sweat

| Destination | Save for later | Finish | Return from report |
| --- | --- | --- | --- |
| The Climb | Preserve draft/session and return to The Climb | Requires the lesson gate, saves once, opens the separate learning report | Back to The Climb; offer revisit |
| The Gym | Preserve unfinished session and return to The Gym | Requires an evaluated main/transfer attempt; a failed workout can finish truthfully | Back to The Gym; offer history and unfinished resume when applicable |

Report actual attempts and supporting outcomes, independent versus assisted evidence, corrections where demonstrated, and observed versus tentative or learner-confirmed explanations. Give a relevant next action rather than a global mastery claim. If saving completion fails, stay in recoverable work and show the failure. Changes to the rating update the same saved record.

Ask **Did you break a sweat?** at completion with the established wording and internal values:

| Choice | Value |
| --- | ---: |
| Nah, piece of cake! | +1 |
| Just a little droplet | +0.5 |
| Crunched my brain a little | 0 |
| Almost gave me a nosebleed | −0.5 |
| O_O | −1 |
| Skip for now | unanswered |

Use neutral copy for skipping and avoid showing a numerical score to the learner. A missing answer is distinct from the neutral choice. Treat the response as subjective challenge. The Gym pilot stores the response and does not use it to select practice.

## Coach voice and intervention

Write as a competent mentor who is direct, occasionally witty, and willing to explain the mechanism. The tone can be firm about a habit while respectful of the learner. Vary replies by actual evidence, such as a repeatedly missed boundary, an inefficient but correct approach, a welcome correction, or the first unaided transfer. Reserve encouragement for work that supports it. Avoid exaggerated praise, intelligence labels, invented professional biography, psychological inference or promises of hiring. Be concise by default and explain more when the problem requires it.

- “Your zero-input case fails. What should the function return when the count is zero?” explains what to investigate without giving replacement code.
- “That answer is consistent with adding first. Is that how you grouped it?” leaves the reasoning open to correction.
- “This was an assisted pass. Try a fresh case to see if you can use the same idea on your own.” makes the next step clear.
- Describe defects in the work. If the grader may be wrong, preserve the evidence and provide a way to review the discrepancy. Do not invent an excuse on the grader's behalf.

Stay silent during independent thinking and typing. After explicitly checked work, offer one useful observation or question. A future **HELP!** entry should be easy to reach, let the learner inspect and consent to any shared context, avoid covering the editor unnecessarily, and still offer authored local help when live coaching is unavailable. Deterministic feedback and an AI conversation have different provenance. Future warm/direct/firm preferences can alter wording within professional bounds.

## Device and feature boundaries

Validate both themes, contrast (AA target), visible focus, accessible names, status announcements, progress and radio semantics, keyboard-only journeys and 200% zoom when applicable. A narrow Chromium viewport is useful evidence for reflow. Identify real Android keyboard, macOS Chrome/Safari and screen-reader passes separately. Respect `prefers-reduced-motion`; keep progress cues readable without animation and keep saving reliable under a future battery saver.

The Room is a preview. Its intended review target is a quiet interview lobby with explicit conditions, allowed tools and libraries, timer and pause/restart policy, no implied live human, and an unaided route with deliberate assisted exceptions if supported. The proposed practice surfaces include short single tasks, mixed screens, a 20-minute screen and a 30-minute live-coding simulation. Disclose question count, navigation rules and permitted help before starting. Label interruption and recovery. Debrief correctness, edge cases, debugging, explanations and assistance against the learner's history. Preserve settings goals for Light/Dark/System, independent lesson/code text scale, motion, battery saver, account and AI consent, export/deletion and safe cleanup. Describe offline readiness only after verifying it. For the eventual offline experience, use one non-blocking status on entry, distinguish lost connectivity from an unavailable provider, and show which resources are actually ready. Keep settings sync, storage cleanup and destructive data deletion separate. See [open decisions](OPEN_DECISIONS.md) for deferred implementation.

For independent visual review, compare brand coherence, type and contrast, focus/cognitive load, guidance and progression, error/loading/recovery, keyboard/screen-reader semantics, mobile input, current versus historical evidence, report closure and coach tone. A trap, inaccessible primary action, lost work, false save or misleading outcome blocks release. If benchmarking would resolve a design choice, record the current source, date, exact interaction seen and fit, and whether to adopt, adapt or reject. Inspect professional editors, interactive learning, focused productivity and coaching experiences for specific patterns. Preserve the approved visual identity and original content. See [synthetic visual evidence](RELEASE_GATES.md#browser-and-visual-evidence).


**Semantic emphasis in instruction.** Keep ordinary prose at the existing text weight. Render Python functions and identifiers with the existing semantic styles. Use monospace for operators such as `is`, `==` and `+=`, and for exact response tokens such as `unbound`. Use bold prose for abstract object labels and for conditions whose omission would change the answer. Name the expected response explicitly in the control label, including on narrow or dark layouts. For fixed object labels, provide a keyboard-accessible choice and retain any invalid saved answer as an explicitly labeled previous response. Current feedback follows the current input.

**Final MAKE and continuation.** Label a required action **Final MAKE exercise** and explain why it is needed. Name optional practice separately. Expose one help level at a time and distinguish assisted completion from independent credit in reports. When a compatible older edition can resume, identify the saved edition and explain what changed in the interface. Preserve the original session, draft keys and assessment references.
