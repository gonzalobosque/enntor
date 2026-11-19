# ENNTOR architectural decisions

Accepted amendments and reversible engineering choices · 18 November 2026

The original Product Experience & Behavior Master Spec v1.0 and Curriculum v1.1 remain authoritative. The accepted amendments below supersede conflicting original delivery priorities. The curriculum defines 22 modules and 135 lessons, including placement. These are content specifications awaiting authoring and executable validation.

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
