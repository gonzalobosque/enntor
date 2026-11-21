# ENNTOR architectural decisions

Accepted amendments and reversible engineering choices · 18 November 2026

The original Product Experience & Behavior Master Spec v1.0 and Curriculum v1.1 remain authoritative. The accepted amendments below supersede conflicting original delivery priorities. The curriculum defines 22 modules and 135 lessons, including placement. These are content specifications awaiting authoring and executable validation.

For review and implementation guidance, see the [source reconciliation](../quality/REQUIREMENT_TRACEABILITY.md), [release gates](../quality/RELEASE_GATES.md) and [open decisions](../quality/OPEN_DECISIONS.md). The standards apply the accepted amendments; policy proposals require separate approval.

## Accepted product amendments

1. **Reusable learning platform.** Separate the platform from subject content. Python/ML is the first Course Pack. Future packs may teach SQL or other skills.
2. **Editable curricula.** Store official content in structured, versioned files, reviewed through Git. A visual course editor may follow later.
3. **Progress preservation.** Retain historical attempts and completion evidence against their original content versions. Use stable IDs across editorial changes. Significant new requirements may add bridge lessons or assessments. Never erase historical completion to introduce a new requirement.
4. **AI autonomy.** AI may generate personalized supplementary explanations and exercises. It cannot autonomously change the official curriculum. Promotion into official content requires explicit human review and a versioned content change.
5. **Model routing.** Select models by task difficulty, quality requirements, measured teaching performance, and availability. Keep provider-specific models outside curricular content. Routing must obey the authorization and billing restriction below.
6. **No additional AI charges.** Billable API requests are prohibited unless the user explicitly changes this decision in the future. ChatGPT integration remains a core goal. Investigate eligible subscription-based authorization when integration work begins. Eligibility is unverified. A subscription must never be assumed to grant application API access. Milestone 1 contains no AI provider integration or external AI calls.
7. **Learning context.** With appropriate consent, AI may access the complete learner history. Retrieve only relevant context for each request, preserving evidence links and data minimization. Give the learner control over sharing and retention.
8. **Public GitHub project.** Prepare the repository for public review. Document both educational theory and application development. Never commit credentials, tokens, or personal learner data. Publishing is a separate user-authorized action.
9. **Online-first MVP.** Prioritize high-quality intelligent teaching and reliable coding exercises. Full offline functionality is deferred and remains a future goal. This supersedes offline delivery as the first release gate and brings AI teaching work earlier in the original sequence.
10. **Reasoning-aware feedback.** Analyze the learner's implementation, cite actual evidence, identify plausible misconceptions, and teach better reasoning. Clearly distinguish an observation from a hypothesis. Deterministic results remain authoritative for executable correctness.
11. **Independent coding.** Writing correct Python from scratch is a central educational objective. Use fresh transfer tasks, preserve assistance history, and require independent evidence after solution-level help.

## Engineering decisions for Milestone 1

### E01 · React, TypeScript, and Vite

Accepted. Build a small browser application using React and strict TypeScript. Vite provides local development and production bundling. Use ordinary CSS with shared tokens. No component suite, backend, authentication, deployment stack, or state library is necessary for this milestone. Dependency versions are locked in package-lock.json. Change the build tooling independently of course contracts.

### E02 · Explicit feature boundaries

Accepted. Keep platform/navigation, course content contracts, lesson progression, learner evidence, execution/grading, and mentoring in separate folders. These are source boundaries, not a plugin framework or separate services. Only navigation and theme persistence have runtime implementations today.

### E03 · Versioned content contracts

Accepted. Start with TypeScript contracts for a normalized Course Pack containing modules, lessons, and exercises. Ordered arrays and explicit prerequisites express the authored path. Teaching blocks and mentor tips carry stable IDs. Exercise contracts include concepts, activity type, hints, runtime requirements, resource limits, rubric, public cases, and versioned fixture references.

Use schemaVersion for format compatibility, version for content semantics, and stable namespaced IDs for identity. Editorial title changes retain IDs. A materially different objective gets a new ID or explicit version migration. Future file ingestion must validate schema, references, prerequisites, and runnable fixtures at runtime/build time. TypeScript alone cannot validate external JSON. No loader or completed course pack ships in this milestone.

### E04 · Execution and grading boundaries

Accepted. ExecutionEngine accepts versioned requests and an AbortSignal, and returns actual output or explicit failure states. engineId and language support future Python and SQL adapters. Engines must enforce limits and cancellation. Separate GradeResult from execution output and tutor prose. Trusted grading owns fixtures and verdicts. A Web Worker alone is insufficient for unrestricted hostile code, and client-delivered tests cannot be secret.

The Python runtime, trust boundary, package policy, test harness, and cancellation behavior need a narrow feasibility milestone before adoption. No execution adapter is implemented yet.

### E05 · Preserve evidence and assistance

Accepted. Attempt records reference original pack, lesson, exercise, grader, and runtime versions. Retain raw test evidence separately from inferred misconceptions. Progress references supporting attempts. Future migrations derive current requirements without rewriting historical attempts. Persistence, export, account isolation, and conflict handling remain future implementations.

### E06 · AI boundary and quality

Accepted. Mentoring contracts describe the task, permitted hint depth, consent reference, relevant attempt IDs, difficulty, and quality requirement. They do not execute requests. AI feedback must cite observations and label uncertain misconceptions. No automatic mastery or official curriculum mutation is delegated to a model. Test reasoning-aware feedback against reviewed correct and incorrect attempts when an authorized integration is available.

### E07 · Hash navigation and local theme preference

Accepted. Native hash links provide reloadable routes and browser back/forward without an additional router dependency. Route changes update the document title and focus the main content. Unknown routes resolve to Home. Switch to a routing library when nested lessons and recovery flows justify it.

Light/dark preference uses localStorage with system preference on first visit. A failed preference write displays a status message. This store holds appearance only. Sensitive data and future learner history need their own reviewed storage design. The theme initializes before React to avoid an initial light flash. Motion respects the OS reduced-motion preference.

### E08 · Foundation visual language

Accepted as a reversible starting point. Warm neutral surfaces, moss text accents, generous space, expressive sans typography, and three restrained geometric illustrations identify the learning areas. Use CSS forms rather than image downloads. Keep future coding workspaces quieter than Home. DM Sans and Space Grotesk load through Google Fonts with system fallbacks. External fonts may be self-hosted before a wider release to remove the third-party font request and improve offline readiness.

## Next decision gates

- Choose the first contiguous authored lesson segment and define its independently verifiable learning outcome.
- Validate structured content files and cross-references before trusting imported Course Packs.
- Compare Python execution options, enforce resource limits, and verify real grading/cancellation before building a larger course.
- Investigate subscription-authorized ChatGPT access before selecting any AI integration. If unavailable, report the limitation and preserve the no-billable-requests decision.
- Define learner data consent, persistence, migration, and public-repository hygiene before collecting real learner evidence.

## E09 · Product rename to ENNTOR

Accepted · 18 November 2026. ENNTOR is the finalized product name, replacing the working title ENHTOR. The application wordmark, accessible brand label, page titles, metadata, package identity (`enntor`), README, and current architecture documentation use the new name. Earlier Git commits retain their original messages and contents.

The two original product/curriculum specifications remain byte-for-byte unchanged as historical sources, including their filenames and original terminology. Documentation links retain those filenames. This amendment supersedes the original product-title choice without changing educational requirements, stable content IDs, routes, or behavior.

Retain the internal `enhtor.theme` localStorage key for compatibility with existing saved preferences. It is a persistence identifier rather than a visible product label. A brand change does not justify invalidating user preferences or migrating a working storage key.

At the time of the rename, the physical project folder was `Enhtor`. The existing development URL remains valid. GitHub publication and Milestone 2 require separate approval.

## Public documentation and history

The public specifications generalize individual educational and project background and employer assessment details. Lesson definitions, mentor tips, research citations, and technical requirements carry forward. The public repository starts with the reviewed snapshot. The original specifications and development history are retained privately.

## E10 · Semantic teaching prose and pilot evidence

F01.01 authors prose as text or an ordered array of text and tagged inline symbols. Use the function role for callable names, the variable role for names and parameters, and the code role for neutral syntax and literals. The shared React renderer escapes text and uses existing theme tokens.

The pilot stores one versioned localStorage record per lesson session. Prediction commits, follow-up attempts, hypothesis responses, hints, and submissions save at interaction boundaries. A submission receives an ID before execution, and its result updates that record. An interrupted submission remains visible in history. Submission elapsed time uses a monotonic clock and measures checking time only. Finish writes a single completion object on the existing session after checking supporting activity evidence. Storage errors are visible and completion appears only after its write succeeds.

Evidence and drafts live in the current browser origin. Existing Modify drafts remain readable in the initial pilot session, and subsequent sessions use separate draft keys. The store has no backend, sync, account identity, or remote transmission. Browser storage is clearable and quota-limited. Concurrent editing is unsupported, and writes detect a changed saved snapshot before saving. Sleep or time between sessions is excluded from check duration.

Make checks distinguish unaided work from conceptual help, implementation help, and repeated passes. Conceptual hints allow lesson completion with an assisted result. Implementation help requires another passing exercise, so the pilot offers a separate Make transfer problem. Reopening a finished session displays its saved evidence. A separate session requires an explicit action.

## E11 · Guided construction, editor, and lesson report

Build records a requirement check and a graded scaffolded function before Make. The stage teaches the declaration and indented return statement with a subtractive problem before asking the learner to write a different function from scratch. Tagged teaching symbols are checked against activity-scoped inventories. The README defines the human checks for teaching order and hint quality.

CodeMirror 6 is loaded when an exercise editor opens. Its Python parser governs indentation and highlighting. Draft text uses the existing draft keys and persistence behavior. Modify's hint revision has a new exercise version and retains its prior draft key.

The version 1 local evidence record gained optional Build fields. Earlier sessions and completion timestamps are retained. Unfinished sessions resume with the Build requirement, and their existing submissions remain readable. Finish writes completion before opening the report route. Ratings update that completion in place, and older completions remain valid without Build evidence.

## E12 · Teaching consistency

Teaching prose uses explicit semantic roles for functions, variables, keywords, and ordinary code. Exercise hints disclose one action at a time and retain revealed levels in the existing evidence record. [Progressive independence with controlled difficulty](../teaching-guidelines.md) defines the authoring and review standard.

## E13 · Evidence-based Gym pilot

An F01.01 adapter converts Climb sessions and Gym attempts into dated observations for one concept. The recommendation rules work on observation IDs, activity, result, and assistance. A pass clears earlier misses on the same activity for recommendation purposes. Two distinct misses without a later pass can prompt practice, unless a later independent result supports reinforcement. Incomplete execution supplies no correctness signal. A confirmed hypothesis describes that attempt only. Unconfirmed and rejected hypotheses do not support a diagnosis. Sweat is context only.

Gym writes version 1 browser-local records under its own key prefix. A submission keeps its ID from start to finish and stores the exercise revision, concept, code, outcome, assistance, and recommendation reason and evidence IDs. Revealed hints persist for this workout across reloads. Failed writes remain retryable in memory and are excluded from recommendations until saved. Gym never writes Climb records. This heuristic covers one concept and one workout, with no mastery updates, schedule, analytics, or remote service.

## E14 · Gym warm-up and deterministic coaching

The Gym loads on navigation. Authored warm-up content is separate from the workout and the reusable warm-up component. The version 1 Gym store accepts a warm-up decision record. Existing attempt records remain readable.

The diagnostic interface takes the exercise and completed submission evidence and returns a factual observation, an optional tentative explanation, and a conceptual question. The warehouse rule uses the existing Lezer Python parser to recognize a direct reversed-subtraction return. Two failed public cases must corroborate the pattern. Other wrong results receive a question about one actual case. Runtime errors retain their existing execution feedback. No diagnostic changes grading.

The attempt can store the observation, hypothesis, displayed nudge, and learner response separately. Each nudge is shown at most once per workout version. Later checks reference earlier nudges and link any previously missed case that now passes. A recent assisted Gym pass is shown alongside repeated unresolved Climb misses. Targeted nudges and revealed hints count as assistance, and the general optional warm-up is recorded separately. All evidence remains browser-local.

## E15 · Repeatable Gym workouts and results

The existing version 1 Gym prefix now accepts session records and optional session and activity references on attempts. Older records remain readable. A session finalizes once with references to its attempts and the latest evaluated outcome. A Python exception can end an unsuccessful workout. Warm-up checks and cancelled checks do not qualify on their own. Sweat updates the completion in place. The first session keeps access to the prior draft key and later sessions start with separate drafts.

Warm-up presentation is chosen by the upcoming learning activity, with evidence used to focus the authored refresher. The Make warm-up includes a separate executable Modify task. Warm-up choices and drafts persist independently of the main editor and do not affect the independent classification of the main workout.

Python errors, missing numeric returns, selected boundary failures, and corroborated expression patterns are evidence categories. Exact structural rules are limited to the warehouse exercise. The fallback describes an actual result and asks the learner to check it against the requirements. Recommendations prefer distinct unresolved activities when available. Hint levels, coaching exposure, and corrected cases remain separate. A full solution unlocks a distinct transfer exercise, and an assisted pass on the original exercise remains assisted.

## E16 · Reusable Climb sequence and curriculum validation

The Climb uses ordered module and lesson prerequisites, a stable route keyed by the lesson ID, and one player for the registered prediction-to-transfer sequence. The Course Pack loader validates graph and activity references independently of the execution runtime. The first adapter is the existing numeric Python sequence. More lessons that use this sequence add content, fixtures and review manifests without adding navigation, storage or assessment UI.

Pack `python-ai-pilot` retains its storage identity in edition 1.7.0. F01.01 preserves its saved route, earlier evidence, original Modify draft mapping and prior-completion policy. Edition 1.4.0 adds optional help to the existing final MAKE contract. Older finished evidence remains readable and can satisfy stable prerequisites. Earlier evidence keeps its original edition. For the wording-only 1.2.0 lesson updates, the player can restore an earlier unfinished draft when the current edition has no draft, and equivalent exercises retain recorded exposure across the revised wording. Reports select a completed record within the lesson; ratings write to that record with the existing expected-value check. F01.02 and F01.03 record current hints separately from historical solution exposure and require a passing transfer after solution help. A passing transfer after conceptual check coaching or prior exposure can close a practice session without new independent evidence. An original Make pass after implementation help still needs a separate passing transfer. Climb records check-coaching exposure and later passed cases separately from hints and independence. Optional versioned trace grids capture direct reasoning separately from behavioral code tests. Their attempts and completion links are additive to the existing evidence schema.

[Authoring and executable validation](../curriculum-authoring.md) adds a per-lesson check for source IDs, structural integrity, teaching symbols, outputs, references and wrong submissions. Editorial coverage and areas outside this sequence stay visible in the [lesson manifests](../review/milestone-4a/README.md).

Compatible unfinished F01.03 editions 1.1 and 1.2, F01.02 edition 1.2 and F01.01 edition 1.3 can now resume their original sessions. The edition mapping pins changed exercise references while exposing clarified wording, answer controls and requested help. New attempts and disclosures store the presentation edition. Stored sessions and draft keys are unchanged, and older incompatible editions stay in history. Final MAKE requires a passing check under the existing trace and progression gates. After help it can finish as practice, while independent credit still requires eligible fresh unaided work.
