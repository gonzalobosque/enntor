# Python & AI Technical Interview Learning Curriculum
**Research-backed curriculum blueprint · Version 1.1 (mentor notes) · 17 November 2026**
**Purpose:** A teaching-first, app-ready learning staircase from *“I know basic Python”* to *“I can independently write and explain reliable Python/ML solutions in timed technical interviews.”*

> **Status:** Research-guided mentor notes added lesson by lesson; curriculum architecture and lesson specifications are designed; individual lesson narratives, executable examples, question variants, and automated test cases must be authored and validated during app production. This is not a claim that a complete course app already exists.

## Executive decision
The strongest fit is **a hybrid of formal instruction and deliberate code construction**: Harvard CS50P/Helsinki for clear fundamentals and tests; Exercism/PRIMM for concept dependencies and gradual transfer from reading to writing; NeetCode/HackerRank/Grokking for interview patterns; NumPy/pandas/Google MLCC and scikit-learn for applied numerical/ML competence; Kaggle/Dataquest and FSDL/Made With ML for authentic project contexts. [R01][R02][R14][R32][R33][R34][R36][R37][R24][R38]

**Scope:** 22 modules including placement; **135 explicitly specified lessons**. A baseline teaching cycle of six exercise types per lesson suggests **at least 810 original exercise instances** over full build-out; repeated variants and assessments would increase that number. These are planned content targets, not exercises already written.

**Curriculum bias:** 60–65% coding construction and code modification across assessed work; remainder code tracing/debugging and mathematical/ML reasoning. Early instruction contains more tracing, and late assessments contain more blank-editor tasks. No endorsement that time spent equals mastery.

## 1. Problem definition and learner profile
This curriculum is designed for learners who understand Python fundamentals and applied ML concepts and want more practice implementing short algorithms and reading unfamiliar numerical code under time pressure. It combines targeted Python refreshers, deliberate coding practice, and applied ML exercises.

### What success means
- From a fresh prompt, extract **inputs, outputs, constraints and edge cases** in a structured way.
- Produce working Python **without auto-completed answer code or hidden AI generation**; test and repair it.
- Recognize and implement common **scans, counters, dictionaries/sets, pair searches, two pointers, windows, stacks and simple graph traversal**, explain complexity.
- Complete **NumPy/pandas/ML mini-implementations** with correct shapes, axes, metric denominators and leakage boundaries.
- Complete unfamiliar **20-minute mixed screens** and **30-minute live-coding simulations** with consistent unaided performance, not just recognition scores.

### Teaching constraints
- Target: **junior applied AI/ML engineering, Python-first**, not FAANG-hard algorithms or advanced ML research.
- Main lessons should be **self-contained, original and interactive**, with optional reference links and no copying copyrighted course problems.
- The app must remain useful without paid AI: prewritten lesson explanations, deterministic tests, structured hints and local progress work offline where feasible.
- Every major topic ends in a **transfer test**: a changed problem surface that requires the underlying technique, not memorized code.

## 2. Research method, selection and limitations
**Date checked:** 17 November 2026. **Method:** targeted web review of publicly available official syllabi, course pages, roadmaps, tables of contents and official technical tutorial indices. This is a comparative curriculum-design review, **not** an enrollment, completion, empirical efficacy trial or full audit of all paid lessons.

Each course was assessed qualitatively for: (1) teaching clarity and prerequisite order; (2) transfer to blank-editor Python; (3) automated exercise/checking model; (4) high-yield algorithmic thinking; (5) numerical/DS/ML implementation; (6) realistic interview relevance; (7) feasibility on a browser/PWA. Ratings in the comparison below are editorial suitability judgments, not independently validated course quality scores.

**Source boundaries:** [R01]–[R35], [R39] are courses, specializations, interview paths or exercise tracks; [R36]–[R38] and [R40] are authoritative tutorial/book/practices references. Multiple tracks from the same provider count as distinct **learning sequences**, not independent providers. The research encompasses **36 learning sequences** plus four reference sources.

### Comparative catalog — all 40 references
| Ref | Course / curriculum | Observed coverage | What to borrow | What to avoid |
|---|---|---|---|---|
| [R01](#r01) | Harvard CS50P | Python, functions, control flow, tests, exceptions, files, OOP | Excellent baseline and testing | introduction assumes beginner pace |
| [R02](#r02) | University of Helsinki: Introduction to Programming | Progressive fundamentals, loops, functions, collections, many graded exercises | Strong micro-scaffolding | much initial content already known |
| [R03](#r03) | University of Helsinki: Advanced Course in Programming | Objects, classes, methods, larger Python exercises | Use selected objects/refactoring | not full OOP detour |
| [R04](#r04) | MIT 6.100L | Computational thinking, algorithms, data structures, debugging, complexity | Adopt reasoning and debugging, omit full academic scope | Do not follow unselected sections verbatim |
| [R05](#r05) | UC Berkeley CS61A | Abstraction, environments, recursion, objects, iterators | Adopt environment diagrams and function composition | defer interpreters/macros |
| [R06](#r06) | Python for Everybody (PY4E) | Variables through collections, files, web, databases | Useful approachable sequencing and data-context problems | Do not follow unselected sections verbatim |
| [R07](#r07) | Google Python Class | Strings, lists, sorting, dictionaries, files, word-count exercises | Adopt short function-completion and combined text tasks | Do not follow unselected sections verbatim |
| [R08](#r08) | Microsoft Learn Python Fundamentals | Variables, strings, conversion, conditionals, guided units | Useful short explanatory lesson format | Do not follow unselected sections verbatim |
| [R09](#r09) | Microsoft Learn Python Building Programs | Loops, collections, functions, guided project blocks | Adopt tight concept-to-task transitions | Do not follow unselected sections verbatim |
| [R10](#r10) | Kaggle Intro to Programming | Arithmetic, functions, types, conditions, lists | Baseline and warmup only | too little construction for interview goals |
| [R11](#r11) | Kaggle Python | Functions, Boolean logic, lists, loops, comprehensions, strings, libraries | Dense refreshers | add from-scratch graded tasks |
| [R12](#r12) | freeCodeCamp Python Programming Fundamentals | Python basics, sequences, dictionaries, errors, classes | Adopt browser-native progression, not every beginner project | Do not follow unselected sections verbatim |
| [R13](#r13) | freeCodeCamp Scientific Computing with Python | String processing, numerical algorithms, recursion, graph paths, sorting | Take projects-as-proof | do not lift problem statements |
| [R14](#r14) | Exercism Python track | Concept exercises and independent practice; feedback and mentoring | Critical model for prerequisite concept graph and transfer tasks | Do not follow unselected sections verbatim |
| [R15](#r15) | Real Python: Core Fundamentals | Basics, data structures, functions, errors, scope, comprehensions | Reference for clear micro-explanations and edge cases | Do not follow unselected sections verbatim |
| [R16](#r16) | Real Python: Classic DSA | Stacks, queues, lists, search, sorting, hash tables | Focused algorithm reference, not entire intermediate Python universe | Do not follow unselected sections verbatim |
| [R17](#r17) | Automate the Boring Stuff, 3e | Debugging, lists, dicts, files, regex, JSON, real utilities | Practical transfer mini-projects | trim unrelated automation domains |
| [R18](#r18) | Boot.dev: Learn Python for Beginners | Functions, scope, testing, collections, errors, type hints | Adopt frequent exercises and feedback, not backend specialization | Do not follow unselected sections verbatim |
| [R19](#r19) | Dataquest: Data Scientist in Python | Python, NumPy, pandas, stats, ML, SQL and projects | Strong application sequence | truncate web scraping/visual polish |
| [R20](#r20) | Dataquest: Data Analyst in Python | Python, data cleaning, visualization, SQL, projects | Adopt data transformation practice | lower priority for SQL reporting |
| [R21](#r21) | Kaggle Pandas | I/O, indexing, summary functions, grouping, missing data, combining | Use for compact DataFrame lessons and autograded transformations | Do not follow unselected sections verbatim |
| [R22](#r22) | Kaggle Intro to Machine Learning | Basic models, validation, overfitting, random forests | Useful low-cost baseline but beneath existing conceptual background | Do not follow unselected sections verbatim |
| [R23](#r23) | Kaggle Intermediate Machine Learning | Missing data, categorical variables, pipelines, CV, leakage | Use exact evaluation-workflow distinctions | require implementation |
| [R24](#r24) | Google Machine Learning Crash Course | Linear/logistic regression, metrics, data, overfitting, nets, LLMs | Adopt interactive visuals and metric reasoning in code | Do not follow unselected sections verbatim |
| [R25](#r25) | DeepLearning.AI Machine Learning Specialization | Supervised/unsupervised learning, optimization, neural nets, recommender systems | Take model mathematics and implementation milestones | no deep recap |
| [R26](#r26) | fast.ai Practical Deep Learning for Coders | Top-down model building, experimentation, training and deployment | Adopt motivating real applications | don’t begin with high-level APIs |
| [R27](#r27) | Stanford CS229 | Linear algebra, regression, classification, optimization, kernels, PCA | Selective linear algebra and PCA only | avoid research-level derivations |
| [R28](#r28) | PyTorch Learn the Basics | Tensors, DataLoader, autograd, optimization, save/load | Short applied code-reading and inference practice | Do not follow unselected sections verbatim |
| [R29](#r29) | Hugging Face LLM Course | Transformers, tokenization, datasets, fine-tuning, demos | Applied AI context only, since basic concepts already strong | Do not follow unselected sections verbatim |
| [R30](#r30) | Full Stack Deep Learning | Testing, infrastructure, deployment, data, monitoring | Adopt production-quality checks | defer substantial cloud setups |
| [R31](#r31) | Made With ML | Data, training, evaluation, code/data/model tests, reproducibility | Take minimal engineering/testing habits relevant to code interviews | Do not follow unselected sections verbatim |
| [R32](#r32) | HackerRank Interview Preparation Kit | Arrays, dicts, sorting, strings, search, recursion, stacks | Source high-yield topic coverage, not questions or company percentages | Do not follow unselected sections verbatim |
| [R33](#r33) | NeetCode Roadmap | Arrays/hashing, two pointers, stacks, binary search, windows, graphs | Adopt ordered pattern families | postpone hard DP and tries |
| [R34](#r34) | Grokking the Coding Interview | Two pointers, windows, fast/slow, graph patterns and mixed recognition | Teach recognition cues but prevent template memorization | Do not follow unselected sections verbatim |
| [R35](#r35) | Interview Query: Data Science Interview | Python, probability, statistics, experiments, preprocessing, ML | Use balanced DS interview reasoning | avoid extensive product analytics |
| [R36](#r36) | Official NumPy Beginner and User Guides | ndarrays, shapes, broadcasting, axes, views/copies, operations | Authority for numerical semantics and shape-first teaching | Do not follow unselected sections verbatim |
| [R37](#r37) | Official pandas Getting Started | I/O, indexing, columns, summaries, joins, reshaping, time series | Authority for modern pandas and transformation exercises | Do not follow unselected sections verbatim |
| [R38](#r38) | scikit-learn Common Pitfalls | Leakage, preprocess consistency, pipeline correctness | Authority for ML workflow anti-pattern tests | Do not follow unselected sections verbatim |
| [R39](#r39) | Real Python: ML with Python | Classical ML through NLP, CV, LLM applications | Reference for applied challenge framing, not a full rerun | Do not follow unselected sections verbatim |
| [R40](#r40) | Python for Data Analysis, 3e | NumPy, pandas, data wrangling, grouping, cleaning and modelling | Reference for realistic data operations | respect reproduction rights |

### Cross-curriculum conclusions
1. **Teach Python semantics first, but do not restart at Hello World:** CS50P, PY4E, Helsinki and Real Python share foundations → collections → functions → error handling/testing. The learner needs targeted refreshers and repeated independent construction, not slow introductory syntax coverage. [R01][R02][R06][R15]
2. **Teach by gradual release:** Exercism separates concept exercises from broader practice; PRIMM recommends Predict → Run → Investigate → Modify → Make. We will explain a concept, trace an example, modify code and then require an independent new function. [R14][P01][P02]
3. **Teach DSA patterns after blank-editor basics:** NeetCode, HackerRank and Grokking converge on arrays, hashing, sorting, two pointers, stacks, searches and windows, but only NeetCode/Grokking center advanced graph/DP. We include simple graph traversal and postpone advanced DP/tries. [R32][R33][R34]
4. **Bring ML mathematics into code:** Kaggle and Google MLCC teach evaluation and data flows; NumPy and pandas guides specify the programming mechanics. Learning to code PCA/metrics should follow shape/axis, dot product and covariance lessons. [R21][R23][R24][R36][R37]
5. **Assess practical correctness and reproducibility:** scikit-learn and FSDL/Made With ML emphasize leakage, testing and production discipline. Our mini-model and data tasks have unit tests and train/test separation as explicit acceptance criteria. [R30][R31][R38]
6. **Avoid two extremes:** An ML-theory-first course is redundant for learners who already understand core ML concepts; an endless interview-problem list does not teach prerequisite syntax, mental models or problem decomposition. The program interleaves these instead.

### Pedagogical basis
- **PRIMM (Predict–Run–Investigate–Modify–Make):** originally developed for teaching programming; evidence and adoption are primarily in educational settings, so efficacy for adult learners preparing for technical interviews is an informed adaptation rather than a proven guarantee. [P01][P02]
- **Worked examples with fading scaffolds:** begin with a known function, modify it, then independently create a structurally related but distinct solution. This directly targets the observed recognition→production gap. [P01][P02]
- **Metacognitive coaching:** prompt for plan→execute→check→reflect, with modeled and guided use before independent use. [P03]
- **Mastery and spaced transfer:** repeated retrieval and new-context tasks are design choices; thresholds below are operational heuristics, not validated psychometric certification.

## 3. Concept dependency structure
```text
Placement (O00)
    ↓
F01 State → F02 Control flow → F03 Strings/lists → F04 Dicts/sets
    ↓                           ↓
F05 Functions & decomposition → F06 Debugging & tests
    ↓
A01 Complexity → A02 Hashing/search → A03 Pointers/windows/stacks
    ↓                                            ↓
A04 Sorting/binary/prefix → A05 Recursion/graphs
    ↓
D01 NumPy shape/axes/broadcast → D02 Matrix/PCA ↘
    ↓                                            ↓
D03 pandas/data → S01 Math/probability → S02 Statistics/metrics
    ↓                                            ↓
M01 Safe ML pipelines → M02 From-scratch ML → M03 Applied AI coding
    ↓
I01 Live coding routines → I02 Timed mixed assessments
```
**Placement policy:** a competent student may bypass individual lessons using fresh challenges, but **never bypass the unaided production gate for a concept merely because of multiple-choice performance**. Individual D01/S01 topics can be practiced concurrently once prerequisites are met; the ordered path above remains the simplest default.

## 4. Standard teaching lesson: the app must TEACH before examining
For every lesson, the user sees the following exact kind of staircase (adjustable duration, not a rigid timer):
1. **Why this matters (2–3 min):** a single real-world failure scenario and a concrete goal.
2. **Concept explanation (4–8 min):** plain-English explanation, 1–2 visual mental models and a Python code example. For math, show operations and units before formulas.
3. **Worked example (3–5 min):** teacher narrates constraints, pseudocode, code and tests, including one edge case.
4. **Predict (1–2 min):** learner predicts output of a fresh short snippet; must commit an answer before Run.
5. **Run & investigate (2–4 min):** learner executes in sandbox, inspects state, explains why prediction differed.
6. **Modify (4–7 min):** alter provided code under one changed requirement, graded by hidden tests.
7. **Make (6–15 min):** independent, related but new function in a blank editor, with optional tiered hints.
8. **Transfer and reflection (3–8 min):** different surface story and one minute of explain/edge-case analysis; record hints, retries and time.
A lesson is **not** marked mastered from watching or a quiz alone. All content and feedback in the app should be available before an optional timed challenge; speed is introduced only after correctness has stabilized.

### Hint ladder
H0: encourage specific input/output and edge-case thinking; H1: name an invariant or a data structure; H2: pseudocode (no Python solution); H3: partial code skeleton; H4: fully explained reference solution, followed by a **new** independent transfer task. Each level logs help used, and answers shown at H4 never count as independent mastery.

### Difficulty calibration
- **0 Warmup:** direct trace/edit, one control structure, no speed requirement.
- **1 Foundation:** blank function using one known pattern, 5–10 minutes initially.
- **2 Interview-easy:** 1–2 patterns, small edge cases, target 3–6 minutes after learning.
- **3 Junior-intermediate:** 2–3 interacting concepts or numerical library semantics, target 6–12 minutes.
- **4 Stretch:** no pattern label, new combination of techniques; optional for baseline readiness.

## 5. Detailed lesson-by-lesson curriculum
**How to read entries:** each lesson states what to teach, what observable proof of understanding is required, and an original exercise family for the app. The app generator will turn each family into multiple graded variants; it must not reuse proprietary employer assessment questions.

### 1. O00 — Placement and study mechanics
**Domain:** Orientation. **Intent:** Baseline: calibrate prior knowledge, reading speed and unaided writing before unlocking lessons.
**Reference anchors:** [R01], [R02], [R14], [R32].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **O00.01** What the app measures | Separate recognition, tracing, implementation, debugging and time-to-solution | Explain the difference with an example | A diagnostic covering the five competencies |
| **O00.02** Decode a prompt | Extract inputs, outputs, constraints, examples and edge cases | Complete a specification card before coding | Interpret four short new requirements |
| **O00.03** Trace existing code | Predict, run and explain state transitions | Trace small functions and loops without execution | Three variable tables |
| **O00.04** Independent mini-function | Write a short function with no supplied body | Submit a working function and add two tests | Two fresh easy tasks |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **O00.02 — Decode a prompt**
  1. Before coding, underline the nouns (data), verbs (operation), and quantifiers (all, any, exactly, first). Quantifiers often reveal the tricky tests. *(mentor heuristic)*
  2. Turn each example into an input → output pair; if the specification is ambiguous, record an assumption before implementing. *(mentor heuristic)*
- **O00.03 — Trace existing code**
  1. Start at the requested print/return to identify its dependencies, then trace execution forward; do not confuse backwards analysis with execution order. *([P03](#p03))*
  2. Draw a small table with one row per state change; for mutation, track the object as well as the variable name. *([P03](#p03))*
- **O00.04 — Independent mini-function**
  1. Write down a normal case and a counterexample before the first line of code. One counterexample is worth more than ten nearly identical happy-path tests. *([P09](#p09))*

**Gate:** establish initial confidence score for five competencies; do not mark later content completed from recognition alone.

### 2. F01 — Execution, state and references
**Domain:** Core Python. **Intent:** Repair the mental model that underlies everything else: what executes, in what order, and what changes.
**Reference anchors:** [R01], [R05], [R14], [R15].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **F01.01** Expressions and evaluation order | Distinguish expressions, statements and outputs | Trace dependency chains backwards, then execute forwards | Predict the output of a dependent expression |
| **F01.02** Variables and reassignment | Understand names bound to objects, rebinding and arithmetic updates | Trace variable tables across assignments | Track state for four assignments |
| **F01.03** Identity and equality | Distinguish is from == and aliasing from equal contents | Explain shared versus distinct objects | Compare three name-to-object diagrams |
| **F01.04** Mutable and immutable types | Understand list mutation versus integer/string rebinding | Predict side effects of changing a list | Explain why two references change together |
| **F01.05** Copy, shallow copy and nested lists | Compare =, slicing, list(), copy() and deep copy | Select the right copy and verify nested effects | Fix a mutation bug in nested data |
| **F01.06** State tracing laboratory | Combine all prior ideas in one trace | Complete a dry-run table without hints | Trace a multi-call function with state |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **F01.01 — Expressions and evaluation order**
  1. An expression *produces a value*; an assignment *binds a name*; print *displays* a value. When tracing, keep those three events separate. *([P01](#p01))*
  2. In a nested expression, resolve the smallest inner dependency first while respecting Python's documented evaluation and short-circuit rules. *([P04](#p04))*
- **F01.02 — Variables and reassignment**
  1. Picture variables as sticky labels on objects, not boxes containing permanent copies; `b = a` reuses a reference. *([P01](#p01))*
  2. With `x += ...`, first ask about the type: mutable containers may change in place, whereas integers create a new value and rebind the name. *([P01](#p01))*
- **F01.03 — Identity and equality**
  1. Ask two different questions: `==` means “same value?”; `is` means “same object?”. Do not use object identity to compare numeric or string contents. *([P01](#p01))*
- **F01.04 — Mutable and immutable types**
  1. To predict whether another name observes a change, first distinguish mutation of an object from rebinding a variable to another object. *([P02](#p02))*
  2. A quick diagnostic: when the code uses an in-place method, draw arrows from every alias to the affected container. *([P03](#p03))*
- **F01.05 — Copy, shallow copy and nested lists**
  1. A shallow copy duplicates the outer container but keeps references to nested objects; draw two boxes that point to the same inner list. *([P02](#p02))*
  2. Use a deliberate nested-list mutation as a test; a mere equality comparison will not reveal aliasing. *([P02](#p02))*
- **F01.06 — State tracing laboratory**
  1. Trace object identity and content in separate columns when lists are assigned, sliced, and mutated. *([P03](#p03))*

**Gate:** two novel blank-editor functions of foundation difficulty, no full-solution hints, required edge-case tests pass.

### 3. F02 — Conditions, loops and invariants
**Domain:** Core Python. **Intent:** Make if/for/while logic automatic and explain what is true at each loop iteration.
**Reference anchors:** [R01], [R04], [R08], [R11].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **F02.01** Truthiness and Boolean operations | Evaluate and/or/not with short-circuit and operand return | Predict outputs for optional/default values | Choose safe defaulting logic |
| **F02.02** Conditionals and boundary cases | Use comparisons and branching with inclusive/exclusive boundaries | Write piecewise logic from requirements | Classify values at thresholds |
| **F02.03** For loops and enumerate | Iterate over values and indexed sequences | Trace indexed updates and write loops | Sum values meeting conditions |
| **F02.04** While loops and termination | State loop invariant and progress toward termination | Implement condition-driven repetition | Compute repeated division count |
| **F02.05** Break, continue and nested loops | Understand branching control within iteration | Debug a skip/stop logic error | Find first value matching several constraints |
| **F02.06** Accumulator and counters | Use running totals, counts, min/max, and Boolean flags | Build running-state solutions without built-ins | Implement a bounded tally function |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **F02.01 — Truthiness and Boolean operations**
  1. In Python, `and` and `or` can return an *operand*, not a Boolean. Trace which operand is the last one evaluated. *([P04](#p04))*
  2. Treat `0`, empty containers and `None` as falsy, but do not automatically treat a valid zero result as “missing.” *([P04](#p04))*
- **F02.02 — Conditionals and boundary cases**
  1. Translate boundary words into symbols before writing the condition: “at least” means `>=`, “more than” means `>`, and slices exclude their stop. *(mentor heuristic)*
  2. Test the threshold itself and the values immediately on either side; off-by-one bugs live at the border. *(mentor heuristic)*
- **F02.03 — For loops and enumerate**
  1. Use `for value in data` when you need values; reach for `enumerate(data)` only when the index matters. *([P05](#p05))*
  2. Trace `range(n)` as `0` through `n-1` before doing anything else. *([P05](#p05))*
- **F02.04 — While loops and termination**
  1. At the top of a `while` loop, say aloud what remains true (invariant), and which quantity moves toward stopping (progress measure). *(mentor heuristic)*
  2. If you cannot explain why the loop ends for a one-element input, inspect the update and condition before optimizing. *(mentor heuristic)*
- **F02.05 — Break, continue and nested loops**
  1. Read `continue` as “skip the remainder of *this iteration*” and `break` as “leave the *innermost loop*”; mark the target loop on paper. *([P04](#p04))*
  2. In nested loops, sketch the possible index pairs for a tiny input instead of guessing how many times the body runs. *(mentor heuristic)*
- **F02.06 — Accumulator and counters**
  1. Define the meaning of a running variable before looping: “sum of items processed so far” or “largest item seen so far.” *(mentor heuristic)*
  2. For min/max, initialize from the first element when inputs are guaranteed nonempty; using zero fails for all-negative lists. *(mentor heuristic)*

**Gate:** two novel blank-editor functions of foundation difficulty, no full-solution hints, required edge-case tests pass.

### 4. F03 — Strings, lists and direct manipulation
**Domain:** Core Python. **Intent:** Translate natural-language text and sequence tasks into direct code without guessing slices.
**Reference anchors:** [R07], [R11], [R15], [R17].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **F03.01** Index and slice semantics | Master start:stop:step, negative indices, slice copies | Predict boundaries and write equivalent loops | Extract every third valid item |
| **F03.02** String traversal and normalization | Iterate characters, replace/filter, strip/casefold | Implement a normalization function | Normalize noisy labels with explicit rules |
| **F03.03** List building, filtering and mapping | Append, extend and build new lists with loops | Construct and test filter/map functions | Remove invalid measurements |
| **F03.04** List comprehensions and laziness contrast | Read and construct comprehensions and generator expressions | Convert between loop and comprehension | Transform selected numeric records |
| **F03.05** Sorting, key functions and stability | Use sorted vs sort, reverse and key | Order records by score then name | Sort tagged predictions |
| **F03.06** String/list checkpoint | Combine slicing, normalization, comparison, and sorting | Solve unfamiliar collection task from scratch | Compare words after custom normalization |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **F03.01 — Index and slice semantics**
  1. Translate each slice into three numbers: start, exclusive stop, and step. Negative indices count from the right, but the stop is still excluded. *([P05](#p05))*
  2. Sketch indices `0..n-1` above values; when the step is negative, trace visited indices explicitly rather than assuming endpoints. *([P05](#p05))*
- **F03.02 — String traversal and normalization**
  1. Decide which differences should be ignored *before* normalizing text: `casefold()` is useful for caseless comparisons, but punctuation removal and whitespace collapse are task-dependent. *([P05](#p05))*
  2. Strings are immutable; accumulate characters into a list and join once when building a large string iteratively. *([P05](#p05))*
- **F03.03 — List building, filtering and mapping**
  1. `append(x)` adds one object; `extend(xs)` adds elements from an iterable. Predict the nesting depth before using either. *([P05](#p05))*
  2. When filtering, build a new list unless the prompt explicitly permits changing the input; it avoids index shifts during removal. *(mentor heuristic)*
- **F03.04 — List comprehensions and laziness contrast**
  1. Read a comprehension in execution order: “for each item → if it passes → produce the expression.” *([P05](#p05))*
  2. A generator expression produces values lazily; a list comprehension materializes them. Choose the form based on reuse and memory needs. *([P07](#p07))*
- **F03.05 — Sorting, key functions and stability**
  1. Use `key=` to say *what to compare*, not to transform the stored elements; `sorted` returns a new list while `.sort()` mutates. *([P08](#p08))*
  2. Python sorting is stable: ties preserve the earlier order, enabling meaningful secondary ordering. *([P08](#p08))*

**Gate:** two novel blank-editor functions of foundation difficulty, no full-solution hints, required edge-case tests pass.

### 5. F04 — Dictionaries, sets and grouping
**Domain:** Core Python. **Intent:** Develop the core toolkit of fast lookups, counts, deduplication and grouped values.
**Reference anchors:** [R07], [R14], [R32], [R33].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **F04.01** Dictionary basics | Construct/update keys, get/default, membership and iteration | Implement safe dictionary retrieval | Aggregate counters for documents |
| **F04.02** Frequency maps | Count occurrences with manual and collections-based approaches | Return counts and top recurring value | Frequency-count event types |
| **F04.03** Sets and membership | Deduplicate, intersect, union and test seen elements | Choose list or set for a membership task | Find overlapping user identifiers |
| **F04.04** Grouping into nested structures | Accumulate lists of records per key | Build and query group dictionaries | Group scores by model |
| **F04.05** Combinations and multiplicity | Distinguish unique values from distinct positions | Plan enumeration that respects duplicates | Count distinct-index triplets meeting a rule |
| **F04.06** Hash-based checkpoint | Select a data structure from time/space constraints | Write an independent O(n)-average solution | Return first repeated token |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **F04.01 — Dictionary basics**
  1. On dictionaries, `in` checks keys. To handle an absent key without exceptions, use `get(key, default)` deliberately. *([P05](#p05))*
  2. Iterate `.items()` when you need both key and value; avoid a separate lookup when the value is already provided. *([P05](#p05))*
- **F04.02 — Frequency maps**
  1. Whenever a problem contains “how many times,” suspect a frequency map; first implement `count[x] = count.get(x, 0) + 1`, then learn `Counter`. *([P06](#p06))*
  2. Decide whether you need frequencies or only presence; a set is cheaper conceptually if counts never matter. *([P06](#p06))*
- **F04.03 — Sets and membership**
  1. Membership checks are average O(1) for sets; if you repeatedly scan a list for “have I seen this?”, consider storing seen items in a set. *([P06](#p06))*
  2. Duplicates vanish in a set, so never replace an array with a set when repeated occurrences must remain distinguishable. *([P07](#p07))*
- **F04.04 — Grouping into nested structures**
  1. Think of grouping as “one key → a growing bucket.” Initialize each bucket exactly once, then append new records. *([P06](#p06))*
  2. When using `defaultdict(list)`, remember that accessing a missing key creates that bucket; do not use it when you need to detect absence without side effects. *([P06](#p06))*
- **F04.05 — Combinations and multiplicity**
  1. Ask two questions separately: must indices be distinct, and may *values* be equal? `combinations` distinguishes positions, so equal values can appear if present at different positions. *([P07](#p07))*
  2. If order does not change the answer, iterate `i < j < k` rather than all permutations; this avoids duplicate work. *([P07](#p07))*
- **F04.06 — Hash-based checkpoint**
  1. Choose by the operation you repeat most: index access → list; key lookup → dict; existence → set; frequency → Counter; first-in-first-out → deque. *([P06](#p06))*

**Gate:** two novel blank-editor functions of foundation difficulty, no full-solution hints, required edge-case tests pass.

### 6. F05 — Functions, decomposition and contracts
**Domain:** Core Python. **Intent:** Go from a blank def to a correct function with explicit return behavior.
**Reference anchors:** [R01], [R02], [R08], [R14].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **F05.01** Function inputs and returns | Design signatures, return values and types | Write function contracts with examples | A validator function from scratch |
| **F05.02** Local scope and object passing | Explain rebinding vs mutation across calls | Debug state leak across function calls | Fix unexpectedly modified input |
| **F05.03** Default arguments | Contrast safe sentinels with shared mutable defaults | Fix dangerous defaults and test repeated calls | Make an optional accumulator safe |
| **F05.04** Decompose multi-step requirements | Turn a prose problem into helper functions and flow | Write high-level pseudocode then code | Parse/validate/score records |
| **F05.05** Input assumptions and edge cases | Define behavior for empty, invalid, duplicate, negative input | Create tests before implementation | Design contract for empty input |
| **F05.06** Built-ins vs explicit loops | Compare clarity and complexity of any/all/sum/min/max/sorted | Choose appropriate approach under restrictions | Implement maximum without max |
| **F05.07** Blank-editor checkpoint | Implement unfamiliar specification without skeleton | Write correct solution, tests and explanation | Compute a custom category score |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **F05.01 — Function inputs and returns**
  1. Design a function from its contract: input type, output type, behavior on the simplest example, and behavior on empty input. *(mentor heuristic)*
  2. `print` is not `return`; a function that only prints normally returns `None`. *([P04](#p04))*
- **F05.02 — Local scope and object passing**
  1. Function arguments bind local names to objects. Reassigning a local parameter does not rebind the caller's name; mutating its shared list may be visible. *([P01](#p01))*
- **F05.03 — Default arguments**
  1. Mutable defaults are evaluated once when a function is defined; for a fresh list per call, default to `None` and create the list inside. *([P04](#p04))*
  2. Test any suspicious default by calling the function twice with no argument, not just once. *([P04](#p04))*
- **F05.04 — Decompose multi-step requirements**
  1. Break a long prompt at the verbs—validate, transform, compare, return—then write one small helper per meaningful stage. *(mentor heuristic)*
  2. Name the intermediate results with nouns from the specification; good names make debugging the pipeline much faster. *(mentor heuristic)*
- **F05.05 — Input assumptions and edge cases**
  1. Define what the function does for empty, singleton, duplicate and negative inputs *only where these inputs are valid*. Do not invent requirements beyond the prompt. *(mentor heuristic)*
  2. When an algorithm assumes sorted, nonempty or unique data, make the precondition explicit before relying on it. *(mentor heuristic)*
- **F05.06 — Built-ins vs explicit loops**
  1. Prefer `any(predicate(x) for x in items)` for “does at least one satisfy it?”; it stops at the first match. Prefer `all` for “do all satisfy it?”. *([P05](#p05))*
  2. Concise isn't automatically better: compare the built-in version with a three-line loop for readability and side effects before choosing. *(mentor heuristic)*
- **F05.07 — Blank-editor checkpoint**
  1. If the blank editor feels intimidating, start with the function signature, a minimal correct case, and a return statement. Grow the implementation from something executable. *(mentor heuristic)*

**Gate:** two novel blank-editor functions of foundation difficulty, no full-solution hints, required edge-case tests pass.

### 7. F06 — Debugging, exceptions and testing
**Domain:** Core Python. **Intent:** Move from random edits to precise, test-driven diagnosis.
**Reference anchors:** [R01], [R04], [R17], [R31].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **F06.01** Tracebacks and exception categories | Identify SyntaxError, TypeError, IndexError, KeyError, ValueError | Locate root cause from a short traceback | Fix three failing functions |
| **F06.02** Try/except and control flow | Use exception handling narrowly; understand finally | Repair data parsing without swallowing errors | Handle invalid numerical fields |
| **F06.03** Assertions and test cases | Write assert tests for normal, boundary and error cases | Add minimal effective tests to a function | Test a range-based validator |
| **F06.04** Test-first small functions | Define expected input-output examples before implementation | Solve from tests and verify behavior | Implement record sanitizer |
| **F06.05** Debugging strategies | Use print, tracing, isolation and hypothesis testing | Explain bug cause before editing | Diagnose a two-function mismatch |
| **F06.06** Refactor without changing behavior | Extract helpers and replace repetitive logic | Keep existing tests green | Simplify conditional pipeline |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **F06.01 — Tracebacks and exception categories**
  1. Read a traceback from the *last line* to identify the exception type, then walk upward to find the first relevant line in your own code. *([P10](#p10))*
  2. Differentiate a failed lookup (`KeyError`) from a missing index (`IndexError`) and an invalid conversion (`ValueError`) before patching. *([P10](#p10))*
- **F06.02 — Try/except and control flow**
  1. Catch the narrowest exception you truly expect, and wrap only the operation that might fail; wide `except` blocks hide coding mistakes. *([P04](#p04))*
  2. Trace execution through `finally` even if `try` returns or raises: its cleanup still runs. *([P04](#p04))*
- **F06.03 — Assertions and test cases**
  1. A useful minimum test set is: normal case, empty/boundary case, duplicate/unusual case, and invalid case if the contract specifies one. *([P09](#p09))*
  2. Prefer test names that state the rule being verified, not just `test1` and `test2`. *([P09](#p09))*
- **F06.04 — Test-first small functions**
  1. Write expected input/output pairs before coding; otherwise you're tempted to adjust the test until it agrees with a buggy implementation. *([P09](#p09))*
- **F06.05 — Debugging strategies**
  1. Debug by changing *one hypothesis at a time*: reproduce the bug, shrink the input, inspect the suspect variable, then rerun. *([P10](#p10))*
  2. Set a breakpoint immediately before the variable first becomes wrong, instead of printing the whole program state. *([P10](#p10))*
- **F06.06 — Refactor without changing behavior**
  1. Freeze the existing behavior in tests before refactoring; modify structure and confirm all tests still pass. *([P09](#p09))*

**Gate:** two novel blank-editor functions of foundation difficulty, no full-solution hints, required edge-case tests pass.

### 8. A01 — Problem-solving and complexity
**Domain:** Algorithms. **Intent:** Learn to turn an unfamiliar prompt into an executable plan, then estimate its cost.
**Reference anchors:** [R04], [R32], [R33], [R34].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **A01.01** Five-line requirement extraction | Write I/O, constraints, examples, edge cases, approach | Prepare a solution plan in under two minutes | Plan an unfamiliar integer problem |
| **A01.02** Enumerate candidate algorithms | Compare brute force, sorted approach and hash-based approach | Explain trade-offs before implementation | Choose how to find two matching values |
| **A01.03** Big O from code | Count iterations for one and nested loops | Derive O(1), O(n), O(n²), O(log n) | Analyze increasing inner loops |
| **A01.04** Time and space trade-offs | Differentiate auxiliary memory and mutation | Choose between in-place and copied strategy | Reduce memory usage in a counting task |
| **A01.05** Testing correctness by cases | Use small examples, invariants and adversarial cases | Find counterexamples to buggy code | Prove early return is safe |
| **A01.06** Naive first, optimize second | Build a correct simple implementation and improve only if needed | Explain why optimization is valid | Compare two membership implementations |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **A01.01 — Five-line requirement extraction**
  1. Circle the words “first,” “every,” “exactly,” “distinct,” and “sorted.” They often determine the algorithm and the hidden-test failures. *(mentor heuristic)*
- **A01.02 — Enumerate candidate algorithms**
  1. Start with the brute-force solution you can prove correct, then identify the repeated work that hashing, sorting or preprocessing would remove. *([P12](#p12))*
  2. When comparing options, count both operations and auxiliary memory; “fast” is not one-dimensional. *([P12](#p12))*
- **A01.03 — Big O from code**
  1. Count how often the *innermost work* executes. An inner loop ranging to `i` still totals roughly n²/2, so its growth class is O(n²). *([P12](#p12))*
  2. Ignore constant factors for the growth class, but not when predicting actual runtime on small inputs. *([P12](#p12) [P38](#p38))*
- **A01.04 — Time and space trade-offs**
  1. Ask whether a temporary set/list is allowed and whether the original input may be reordered; that determines which optimization is legal. *(mentor heuristic)*
- **A01.05 — Testing correctness by cases**
  1. Construct the smallest counterexample to your chosen strategy; if it fails on 3 elements, a dataset of 30,000 won't save it. *(mentor heuristic)*
- **A01.06 — Naive first, optimize second**
  1. State your simple solution's complexity and only optimize if constraints justify the extra complexity. *([P12](#p12))*

**Gate:** at least two independent novel algorithm tasks with correct outputs, justified time/space complexity and no pattern name supplied.

### 9. A02 — Search, hashing and combinatorial enumeration
**Domain:** Algorithms. **Intent:** Fluency with loops, membership and indices for interview-style problems.
**Reference anchors:** [R32], [R33], [R34], [R07].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **A02.01** Linear scan patterns | Find first/last item meeting a property | Code independent scan and boundary cases | Find earliest acceptable timestamp |
| **A02.02** Pair and triplet enumeration | Use distinct indices and prevent unwanted reuse | Compare exhaustive and optimized approaches | Find multiplicative triple for new target |
| **A02.03** Seen-set pair search | Use set complements and early exits | Write linear-average solution for pair target | Find pair of IDs with target sum |
| **A02.04** Counts, duplicates and multiplicities | Reason about repeated values and positions | Solve a quantity-sensitive selection | Determine if three distinct items satisfy constraints |
| **A02.05** Grouping and inversion | Build value→indices or key→count | Implement inverted index | Index tags to document IDs |
| **A02.06** Unfamiliar mixed checkpoint | Recognize scan/count/hash/combination strategy | Solve two new tasks without pattern labels | Mixed search set |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **A02.01 — Linear scan patterns**
  1. Use a left-to-right scan to preserve “first encountered” semantics. Sorting first can silently change the requested answer. *(mentor heuristic)*
  2. Return early when the goal is *existence*, but keep scanning when the goal is *all matches*. *(mentor heuristic)*
- **A02.02 — Pair and triplet enumeration**
  1. For distinct triplets, use index constraints `i < j < k` rather than independent loops over values; repeated values are valid only if their positions differ. *([P07](#p07))*
  2. Test a one- and two-element list to expose accidental reuse when three distinct positions are required. *([P07](#p07))*
- **A02.03 — Seen-set pair search**
  1. In two-sum style problems, when you see `x`, check whether `target - x` has been seen; insert `x` afterward to avoid reusing the current position unintentionally. *([P12](#p12))*
- **A02.04 — Counts, duplicates and multiplicities**
  1. Distinguish “two equal values exist” from “one value equals twice another.” A count of two occurrences may be necessary to use the same value twice. *([P06](#p06))*
- **A02.05 — Grouping and inversion**
  1. Invert a lookup from `id → label` to `label → [ids]` only when the question actually asks for reverse access; do not construct unused indexes. *([P06](#p06))*

**Gate:** at least two independent novel algorithm tasks with correct outputs, justified time/space complexity and no pattern name supplied.

### 10. A03 — Two pointers, windows and stacks
**Domain:** Algorithms. **Intent:** Recognize patterns from input structure rather than memorizing named problems.
**Reference anchors:** [R32], [R33], [R34], [R16].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **A03.01** Opposite-end pointers | Use sorted order or symmetric string checks | Maintain invariant to discard candidates | Find closest pair under bound |
| **A03.02** Fast/slow and single-pass compression | Use two indices for read/write operations | Implement in-place compaction | Remove marked entries efficiently |
| **A03.03** Fixed-size sliding windows | Update running sum/count on each shift | Implement windowed maximum/minimum | Longest high-signal fixed window |
| **A03.04** Variable-size windows | Use expand/shrink when constraints permit | Explain when window method fails | Shortest valid segment in positive sequence |
| **A03.05** Stack for nested state | Use push/pop to match delimiters or undo | Implement balanced symbols checker | Validate nested markup tokens |
| **A03.06** Pattern recognition checkpoint | Solve unlabelled pointer/window/stack tasks | Name invariant and justify chosen pattern | Three unfamiliar mixed problems |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **A03.01 — Opposite-end pointers**
  1. Two pointers work because each move safely rules out impossible candidates. Explain why moving left or right cannot discard a valid answer. *([P13](#p13))*
- **A03.02 — Fast/slow and single-pass compression**
  1. For in-place compaction, keep separate `read` and `write` indexes: read visits every item; write advances only for retained items. *([P13](#p13))*
- **A03.03 — Fixed-size sliding windows**
  1. When a fixed window moves one step, update by **subtract outgoing + add incoming** rather than re-summing all k elements. *([P13](#p13))*
- **A03.04 — Variable-size windows**
  1. Expand the right edge to admit an item; shrink the left edge until the invariant is restored. Check that the constraint is monotone before applying this blindly. *([P13](#p13))*
- **A03.05 — Stack for nested state**
  1. A stack is “the last unfinished thing.” Push opening delimiters and pop when a matching close arrives; check the stack isn't empty before popping. *([P06](#p06))*
- **A03.06 — Pattern recognition checkpoint**
  1. If a problem says *contiguous subarray*, look for a window or prefix sum; if it says *arbitrary elements*, don't assume contiguity. *([P13](#p13))*

**Gate:** at least two independent novel algorithm tasks with correct outputs, justified time/space complexity and no pattern name supplied.

### 11. A04 — Sorting, binary search and prefix sums
**Domain:** Algorithms. **Intent:** Know when ordering/preprocessing pays off.
**Reference anchors:** [R04], [R33], [R34], [R16].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **A04.01** Sorting and its cost | Compare sorted vs in-place, stability, sort key | Sort and interpret duplicate records | Order customers by multiple criteria |
| **A04.02** Binary search on sorted values | Maintain low/high and stop conditions | Code iterative binary search | Find a threshold crossing index |
| **A04.03** Binary search on a condition | Search monotone answers with predicate | Specify monotonic assumption | Find minimum capacity to meet constraints |
| **A04.04** Prefix sums | Precompute cumulative totals for repeated range queries | Use indices correctly | Answer many score interval queries |
| **A04.05** Sorted merging | Merge two already sorted streams | Write two-pointer merge | Merge timestamped batches |
| **A04.06** Selection under constraints | Choose sort, binary, prefix, linear scan | Explain complexity and edge cases | Mixed array challenge |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **A04.01 — Sorting and its cost**
  1. Sorting helps when order removes possibilities, but its O(n log n) cost can be excessive for a one-time maximum or membership query. *([P08](#p08))*
- **A04.02 — Binary search on sorted values**
  1. Pick and state one interval convention, such as half-open `[lo, hi)`, and keep the target inside the search interval as an invariant. *([P15](#p15))*
  2. Test empty, one-element and absent-target inputs; they catch most binary-search off-by-one errors. *([P15](#p15))*
- **A04.03 — Binary search on a condition**
  1. First prove the yes/no predicate changes only once from false to true. If it oscillates, binary search on the answer is invalid. *([P15](#p15))*
- **A04.04 — Prefix sums**
  1. Write the prefix array with `prefix[0] = 0`; then any range sum `[l, r)` is `prefix[r] - prefix[l]`, including ranges starting at zero. *([P14](#p14))*
- **A04.05 — Sorted merging**
  1. In a merge of two sorted sequences, compare their current heads and advance *only the side you consumed*; append the remainder afterward. *([P12](#p12))*

**Gate:** at least two independent novel algorithm tasks with correct outputs, justified time/space complexity and no pattern name supplied.

### 12. A05 — Recursion, queues, trees and graph basics
**Domain:** Algorithms. **Intent:** Build enough graph reasoning for typical junior challenges, without research-level algorithms.
**Reference anchors:** [R04], [R33], [R16], [R35].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **A05.01** Call stack and base cases | Trace recursive calls and identify termination | Write factorial-like recurrence with nontrivial base | Sum nested item counts |
| **A05.02** Recursion versus iteration | Compare complexity and stack growth | Rewrite simple recursion as loop | Flatten shallow nested batches |
| **A05.03** Queues and BFS intuition | Explore items by increasing distance | Implement deque-based traversal | Explore reachable locations |
| **A05.04** DFS and visited sets | Explore graph without repeated processing | Implement iterative DFS | Find connected records |
| **A05.05** Weighted route reasoning | Distinguish path length from cumulative cost | Calculate shortest route on small directed graph | Compare alternative weighted paths |
| **A05.06** Topological prerequisites | Translate before/after constraints into dependencies | Detect valid execution order | Schedule dependent tasks |
| **A05.07** Review and boundaries | Distinguish easy graphs from advanced DP/trees | Solve two mixed reasoning tasks | Explain when a graph search is appropriate |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **A05.01 — Call stack and base cases**
  1. Every recursive function needs a base case and a strictly smaller subproblem; trace `n=0,1,2` by hand before generalizing. *(mentor heuristic)*
- **A05.02 — Recursion versus iteration**
  1. Compare what you store: recursion uses call-stack frames; iteration can use explicit state or a stack. Python recursion depth is finite. *(mentor heuristic)*
- **A05.03 — Queues and BFS intuition**
  1. BFS explores distance in *number of edges* on an unweighted graph; use a queue when shortest hop count matters. *([P16](#p16))*
- **A05.04 — DFS and visited sets**
  1. Mark a vertex visited when enqueuing/pushing it (as appropriate for your traversal), not after exploring every neighbor, to prevent duplicate work. *([P16](#p16) [P17](#p17))*
- **A05.05 — Weighted route reasoning**
  1. Draw path costs on each edge and add them; fewest edges is not cheapest when edges have different weights. Dijkstra assumes nonnegative edge weights. *([P18](#p18))*
- **A05.06 — Topological prerequisites**
  1. Treat “X before Y” as a directed arrow X → Y; a valid execution order must respect every arrow. Cycles make a full ordering impossible. *([P40](#p40))*

**Gate:** at least two independent novel algorithm tasks with correct outputs, justified time/space complexity and no pattern name supplied.

### 13. D01 — NumPy: arrays, shapes and broadcasting
**Domain:** Numerical Python. **Intent:** Translate dimensional reasoning into correct runnable NumPy rather than guessing syntax.
**Reference anchors:** [R36], [R19], [R27], [R24].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **D01.01** ndarray and shape | Read shapes, dimensions, dtypes and index elements | Annotate each array operation with its output shape | Construct a model score matrix |
| **D01.02** Indexing, slicing and views | Contrast NumPy views with list copies | Predict modification propagation | Repair shared-data mutation |
| **D01.03** Axes and reductions | Understand axis=0/1 for sum, mean, max, argmax | Write shape-aware reductions | Compute per-class mean scores |
| **D01.04** Broadcasting | Align trailing dimensions and determine expanded output | Predict shapes and fix an invalid broadcast | Combine row and column adjustments |
| **D01.05** Vectorization and masks | Replace loops with vectorized filters/operations | Build thresholded predictions | Mask low-confidence scores |
| **D01.06** Matrix multiply and transpose | Distinguish *, @, np.dot and .T | Verify shape constraints | Multiply feature and weight matrices |
| **D01.07** NumPy checkpoint | Implement an array operation using only stated APIs | Explain shape after every transformation | Normalize a feature matrix safely |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **D01.01 — ndarray and shape**
  1. Before doing any NumPy calculation, write `shape`, `dtype` and one sample entry. Many numerical bugs are really shape bugs. *([P20](#p20))*
  2. Think of shape `(m, n)` as *m samples × n features* unless the data contract says otherwise. *(mentor heuristic)*
- **D01.02 — Indexing, slicing and views**
  1. Python-list slicing copies an outer list, while basic NumPy slicing normally creates a view sharing data; run one mutation experiment to make this distinction stick. *([P20](#p20) [P39](#p39))*
- **D01.03 — Axes and reductions**
  1. A reduction on `axis=0` *eliminates the row axis* and keeps one result per column; `axis=1` eliminates columns and keeps one result per row. *([P20](#p20))*
  2. Predict the output shape before calculating numerical values; `keepdims=True` retains a size-one reduced axis when needed. *([P20](#p20))*
- **D01.04 — Broadcasting**
  1. For broadcasting, align shapes on the **right**, pad missing leading dimensions with 1, and compare corresponding dimensions; equal or 1 is compatible. *([P19](#p19))*
  2. Write `(m,1)` under `(n,)` to visualize whether a row or column vector is being replicated. *([P19](#p19))*
- **D01.05 — Vectorization and masks**
  1. Vectorize a transformation only after verifying the scalar version on three records; then use a Boolean mask and compare the results. *([P20](#p20))*
  2. Watch the difference between a mask of shape `(n,)` and one of shape `(n, 1)`; the shape controls selection and broadcasting. *([P19](#p19))*
- **D01.06 — Matrix multiply and transpose**
  1. Write matrix sizes above every multiplication: `(m,n) @ (n,k) → (m,k)`. `*` is elementwise, not matrix multiplication. *([P19](#p19))*
  2. Use transposition to move axes into alignment; don't transpose just because the code errors—verify the intended mathematical operation. *([P20](#p20))*
- **D01.07 — NumPy checkpoint**
  1. In numerical scaffolds, annotate the shape after **every** `None` placeholder before filling in an expression. *(mentor heuristic)*

**Gate:** numerically correct code with justified array shapes or DataFrame schema, no leakage or mutation errors.

### 14. D02 — Linear algebra and numerical ML code
**Domain:** Numerical Python. **Intent:** Build mathematical literacy by decomposing algorithms into primitive operations.
**Reference anchors:** [R36], [R27], [R24], [R38].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **D02.01** Vectors and norms | Compute dot product, length, normalized vectors | Write small NumPy functions with explicit checks | Normalize embedding vectors |
| **D02.02** Covariance and centering | Subtract column means and compute covariance | Check shape, centering and rowvar convention | Center a sensor matrix |
| **D02.03** Eigenvalues and eigenvectors | Interpret covariance directions and eigenvalues | Read np.linalg.eigh outputs | Match eigenvectors to sorted eigenvalues |
| **D02.04** PCA as small steps | Center → cov → eigh → descending order → projection | Fill a new dimensionality-reduction scaffold | Project numerical coordinates |
| **D02.05** Numerical safeguards | Prevent divide-by-zero, misaligned dimensions, invalid sizes | Add shape and input validation | Handle constant feature column |
| **D02.06** Numerical checkpoint | Implement small transformation without copy-paste | Explain each intermediate shape | Build a 2D-feature projector |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **D02.01 — Vectors and norms**
  1. Check a dot-product interpretation with unit vectors: parallel vectors have normalized dot product near +1, perpendicular near 0, opposite near −1. *([P41](#p41))*
  2. Handle zero-length vectors explicitly before normalization; division by zero can turn an otherwise good retrieval score into NaN. *(mentor heuristic)*
- **D02.02 — Covariance and centering**
  1. For feature matrices with rows as samples, subtract the **column** means (one per feature), not a single overall scalar mean. *([P22](#p22))*
  2. The covariance matrix is `n_features × n_features` when features are columns; use shape checks to catch transposition mistakes. *([P22](#p22))*
- **D02.03 — Eigenvalues and eigenvectors**
  1. For a real symmetric covariance matrix, `eigh` returns eigenvalues in ascending order and eigenvectors as **columns**. When ranking, reorder the columns to match the eigenvalues. *([P21](#p21))*
- **D02.04 — PCA as small steps**
  1. Read PCA as a five-station assembly line: center → covariance → eigenpairs → descending order → project. Give each intermediate array a name and a shape. *([P21](#p21) [P22](#p22))*
  2. Eigenvectors are directions; eigenvalues say how much variance lies along each direction. This helps explain why selecting the largest eigenvalues works. *([P22](#p22))*
- **D02.05 — Numerical safeguards**
  1. Before a division, inspect its denominator; before a matrix operation, inspect shapes; before selecting `k` components, check `k` against the number of available features. *(mentor heuristic)*

**Gate:** numerically correct code with justified array shapes or DataFrame schema, no leakage or mutation errors.

### 15. D03 — pandas and real-world data pipelines
**Domain:** Data Science. **Intent:** Use Python fluency to clean, join, aggregate and validate data.
**Reference anchors:** [R21], [R37], [R40], [R23].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **D03.01** Read and inspect data | Create/read DataFrames; inspect schema and missing values | Identify questionable rows and types | Audit a small event table |
| **D03.02** Select and filter | Use loc, iloc and boolean masks correctly | Write criteria from natural language | Filter records by time and score |
| **D03.03** Groups and aggregates | Use groupby, agg, counts and percentages | Implement per-category summary | Compare classifier classes |
| **D03.04** Missing and duplicate values | Choose explicit handling and track changes | Document cleaning assumptions | Clean repeated document IDs |
| **D03.05** Joins and leakage traps | Check key multiplicity and split boundaries | Assert expected joined row counts | Join predictions with metadata |
| **D03.06** Table workflow checkpoint | Write reusable function from raw table to output | Validate correctness with small fixture | Summarize document errors |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **D03.01 — Read and inspect data**
  1. On first loading a DataFrame, check row count, column names, dtypes, null rates and a few records—don't start modeling from `head()` alone. *(mentor heuristic)*
- **D03.02 — Select and filter**
  1. In `df.loc[rows, columns]`, the first argument chooses rows and the second chooses columns. Build the Boolean row mask separately when the expression gets hard to read. *(mentor heuristic)*
- **D03.03 — Groups and aggregates**
  1. Before a `groupby`, decide whether you want **one row per group** (aggregation) or **one result per original row** (transformation). *([P23](#p23))*
- **D03.04 — Missing and duplicate values**
  1. Record before/after row counts for `dropna` and `drop_duplicates`; removing data is a model decision, not merely housekeeping. *(mentor heuristic)*
- **D03.05 — Joins and leakage traps**
  1. Before a merge, say whether the keys should be unique on the left, right or both; use `validate=` and `indicator=True` to expose unexpected row multiplication and unmatched records. *([P24](#p24))*
  2. Split train/test *before* learned imputation, scaling or feature selection; only training data may influence fitted preprocessing. *([P25](#p25))*
- **D03.06 — Table workflow checkpoint**
  1. Turn a notebook-style transformation into a function with an explicit input schema and a deterministic output schema; tests should check both values and number of rows. *(mentor heuristic)*

**Gate:** numerically correct code with justified array shapes or DataFrame schema, no leakage or mutation errors.

### 16. S01 — Math and probability for technical screens
**Domain:** Statistics. **Intent:** Fill practical mathematical gaps without repeating a university mathematics degree.
**Reference anchors:** [R19], [R24], [R25], [R35].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **S01.01** Fractions, percentages and units | Convert proportions and rates precisely | Solve small error-rate questions | Compute throughput and error fractions |
| **S01.02** Logarithms and exponentials | Understand log as inverse of exponent; -ln(p) | Calculate and interpret log loss | Compare confident and uncertain predictions |
| **S01.03** Counting and combinations | Determine order, replacement and distinct positions | Compute product-rule counts and nCr where relevant | Count possible label assignments |
| **S01.04** Conditional probability | Distinguish P(A|B) from P(B|A) | Solve tree/contingency problems | Estimate model alert reliability |
| **S01.05** Independence and expected value | Multiply independent probabilities; weighted average outcomes | Compute expectation and check units | Analyze repeated alert outcomes |
| **S01.06** Probability checkpoint | Solve unseen word problems with written reasoning | Interpret rather than only calculate | Probability and counting mixed test |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **S01.01 — Fractions, percentages and units**
  1. Write units next to every number; if the question gives minutes and an hourly price, convert before multiplying. *(mentor heuristic)*
  2. Distinguish “percentage points” (30% to 40% = +10 points) from “relative percent increase” (+33.3%). *(mentor heuristic)*
- **S01.02 — Logarithms and exponentials**
  1. A logarithm answers “what exponent makes this number?”; for cross-entropy, `-ln(p)` rises as the probability assigned to the correct class falls. *([P29](#p29) [P45](#p45))*
  2. Check `p=1`, `p=0.5` and `p→0` to understand the direction and scale of log loss before memorizing a formula. *([P45](#p45))*
- **S01.03 — Counting and combinations**
  1. Ask **order matters?** and **replacement allowed?** before selecting multiplication, permutations or combinations. *([P07](#p07))*
  2. Counting product choices across positions multiplies the number of options at each decision point; addition is for mutually exclusive branches. *([P07](#p07))*
- **S01.04 — Conditional probability**
  1. Rewrite `P(A|B)` in words: “among cases where B is true, what fraction are A?” This fixes the denominator to the B group. *([P44](#p44))*
  2. Draw a 2×2 count table when the wording is difficult; counts are often easier to reason about than abstract probabilities. *(mentor heuristic)*
- **S01.05 — Independence and expected value**
  1. Multiply probabilities only under the independence (or appropriate conditional) assumption; drawing without replacement changes the second probability. *(mentor heuristic)*
  2. For expected value, list each outcome with its probability and payoff, then multiply and sum; don't average payoffs equally when probabilities differ. *(mentor heuristic)*

**Gate:** at least 85% on fresh quantitative problems with explicit denominator, units and interpretation, plus two independently coded computations.

### 17. S02 — Statistics, experiments and ML metrics
**Domain:** Statistics. **Intent:** Compute, interpret and choose measurements correctly for real decisions.
**Reference anchors:** [R24], [R25], [R35], [R19].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **S02.01** Mean, median and dispersion | Choose robust summary and report outliers | Compute median, variance, standard deviation | Analyze skewed process times |
| **S02.02** Sampling and bias | Identify selection bias and sample representativeness | Design sampling strategy | Audit data collection protocol |
| **S02.03** Confusion matrix orientation | Specify positive class and map TP FP FN TN | Write function calculating counts from labels | Evaluate error classes |
| **S02.04** Accuracy, precision, recall and F1 | Calculate and interpret per-class metrics | Implement metrics from counts | Compare fraud-detector thresholds |
| **S02.05** Thresholds and costs | Express false-positive and false-negative cost | Choose metric given business risk | Select threshold from costs |
| **S02.06** Hypothesis tests and intervals | Interpret p-values, intervals and significance correctly | Explain conclusion and limits | Interpret a small A/B experiment |
| **S02.07** Stats checkpoint | Complete unseen mixed calculations with a brief recommendation | Use correct denominators and interpretations | Choose a model for asymmetric errors |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **S02.01 — Mean, median and dispersion**
  1. When one value dwarfs the rest, calculate both mean and median before deciding what “typical” means; report spread separately from center. *([P46](#p46))*
- **S02.02 — Sampling and bias**
  1. First ask **who could never enter the sample?** That often reveals selection bias faster than inspecting the arithmetic. *(mentor heuristic)*
- **S02.03 — Confusion matrix orientation**
  1. Choose and write the positive class before marking TP, FP, FN and TN. In the confusion matrix, never assume whether actual labels are rows or columns—read the headers. *([P27](#p27))*
- **S02.04 — Accuracy, precision, recall and F1**
  1. Precision asks “of **predicted** positives, how many were right?”; recall asks “of **actual** positives, how many were found?” The highlighted word gives the denominator. *([P27](#p27))*
  2. Always sanity-check accuracy against a majority-class baseline, especially with imbalanced labels. *([P27](#p27))*
- **S02.05 — Thresholds and costs**
  1. If false negatives are costly, examine recall for the relevant positive class; if false positives are costly, examine precision or false-positive rate, depending on the operational question. *([P27](#p27))*
  2. Lowering a binary threshold expands predicted positives, so recall cannot decrease on a fixed dataset; precision can move either way. *([P28](#p28) [P36](#p36))*
- **S02.06 — Hypothesis tests and intervals**
  1. A p-value is a probability of data (or more extreme data) **assuming the null**, not the probability that the null is true. *([P43](#p43))*
  2. Confidence-interval confidence describes the repeated *procedure's* coverage; don't describe a realized frequentist interval as having a 95% posterior probability. *([P30](#p30))*

**Gate:** at least 85% on fresh quantitative problems with explicit denominator, units and interpretation, plus two independently coded computations.

### 18. M01 — Practical ML workflow in code
**Domain:** Applied ML. **Intent:** Transfer existing conceptual ML knowledge into reliable implementation.
**Reference anchors:** [R22], [R23], [R24], [R38].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **M01.01** From requirements to evaluation | Define task, baseline and target metric | Write evaluation specification | Design an alert classifier |
| **M01.02** Split and leakage avoidance | Create correct train/validation/test flow | Find and repair wrong preprocessing order | Prevent scaler leakage |
| **M01.03** Pipelines and transformations | Fit train-only and transform other partitions | Implement a minimal scikit-learn pipeline | Build standardized classifier |
| **M01.04** Model selection and reproducibility | Separate tuning from final evaluation | Write simple grid evaluation script | Compare three algorithms fairly |
| **M01.05** Error analysis by subgroup | Generate confusion, class reports and error slices | Turn numbers into specific hypotheses | Audit worst-performing classes |
| **M01.06** End-to-end checkpoint | Code small ML pipeline with data, fit, predict, report | Defend evaluation choices | Train and assess a text baseline |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **M01.01 — From requirements to evaluation**
  1. Pick a trivial baseline first, then specify which kind of mistake matters most; an elaborate model only helps if it beats a meaningful baseline. *([P27](#p27))*
- **M01.02 — Split and leakage avoidance**
  1. Draw a chronological or group-aware boundary before splitting where entities or repeated observations could leak between sets. *([P25](#p25) [P26](#p26))*
- **M01.03 — Pipelines and transformations**
  1. Remember: **fit on train, transform on others**. Wrap transformations and estimator inside a pipeline to keep this contract consistent. *([P25](#p25))*
- **M01.04 — Model selection and reproducibility**
  1. Validation is for choices; the untouched test set is for the final report. Repeatedly selecting on validation can also overfit the selection process. *([P25](#p25) [P37](#p37))*
- **M01.05 — Error analysis by subgroup**
  1. Start error analysis with false positives and false negatives *by class and subgroup*, then inspect concrete examples rather than guessing causes from an aggregate score. *([P27](#p27))*
- **M01.06 — End-to-end checkpoint**
  1. Make one small end-to-end run on tiny data before scaling: ingest → split → fit → predict → metrics. It catches integration failures earlier and more cheaply. *(mentor heuristic)*

**Gate:** successful small pipeline/algorithm implementation with tests, no data leakage and clear evaluation interpretation.

### 19. M02 — Implement ML primitives from scratch
**Domain:** Applied ML. **Intent:** Remove black-box dependence for short mathematical ML exercises.
**Reference anchors:** [R25], [R27], [R24], [R36].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **M02.01** Distance and nearest neighbor | Compute Euclidean distance and simple k-NN prediction | Write distance and voting routines | Classify a sample from tiny 2D set |
| **M02.02** Simple linear model | Compute predictions, errors and manual gradient intuition | Write forward prediction and MSE | Fit one-dimensional trend conceptually |
| **M02.03** Sigmoid, softmax and log loss | Translate math expressions into stable operations | Implement small-probability functions | Compute three-class log loss |
| **M02.04** Batch feature standardization | Compute train-only mean/std, handle zeros | Write transform function | Normalize customer features |
| **M02.05** Unsupervised centroid update | Compute nearest centroid and grouped means | Write one iteration of k-means | Cluster tiny point set |
| **M02.06** From-scratch checkpoint | Fill a novel matrix/calculation scaffold with tests | Explain intermediate values and shapes | Complete dimensionality reducer skeleton |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **M02.01 — Distance and nearest neighbor**
  1. For k-NN, write a tiny distance table by hand, then sort distances; don't confuse nearest-feature distance with similarity score, where larger may be better. *(mentor heuristic)*
- **M02.02 — Simple linear model**
  1. For gradient intuition, change one parameter slightly and see whether loss rises or falls. The gradient's sign tells you which way loss increases locally. *(mentor heuristic)*
- **M02.03 — Sigmoid, softmax and log loss**
  1. To make softmax numerically safer, subtract the maximum logit before exponentiating; probabilities remain unchanged. *([P31](#p31))*
  2. Check a loss by testing a correct-class probability near 1 versus near 0; log loss should move in opposite directions. *([P45](#p45))*
- **M02.04 — Batch feature standardization**
  1. Compute per-feature training means and scales once, then reuse them on validation/inference; define a safe behavior for zero-variance columns. *([P25](#p25) [P32](#p32))*
- **M02.05 — Unsupervised centroid update**
  1. Think “assign points → recompute each cluster center” as two separate operations; don't use old and new centroids in the same assignment pass by accident. *(mentor heuristic)*

**Gate:** successful small pipeline/algorithm implementation with tests, no data leakage and clear evaluation interpretation.

### 20. M03 — Applied AI, parsing and inference
**Domain:** Applied ML. **Intent:** Apply solid Python to practical AI-adjacent code without extensive cloud infrastructure.
**Reference anchors:** [R29], [R28], [R30], [R31].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **M03.01** JSON and nested structures | Parse and validate nested dict/list prediction payloads | Write safe extractor | Extract multi-class scores |
| **M03.02** Batch inference and top-k | Use argmax, sort, threshold and top-k without errors | Write deterministic ranking function | Return top labels per sample |
| **M03.03** Embeddings and similarity | Normalize vectors and compare cosine/dot | Handle zero vectors | Rank candidate documents |
| **M03.04** API-style function contracts | Validate request types and structure response | Write inference service function | Return prediction or useful error |
| **M03.05** Robustness and security basics | Handle invalid/untrusted inputs; explain safe tool boundaries | Add input checks and resource budgets | Reject malformed embedding arrays |
| **M03.06** Applied checkpoint | Build tiny local AI pipeline with tests and output | Implement without large frameworks | Search mini document catalogue |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **M03.01 — JSON and nested structures**
  1. After `json.loads`, inspect container types level by level: dict → list → dict → scalar. Validate expected keys and types before indexing deeply. *([P34](#p34))*
  2. Treat external JSON as untrusted input; a valid JSON document is not automatically a valid request. *([P34](#p34))*
- **M03.02 — Batch inference and top-k**
  1. `argmax` returns an *index*, not the score. Keep the label mapping alongside the model output. *([P20](#p20))*
  2. When returning top-k, specify tie behavior and whether k is capped at the number of classes. *(mentor heuristic)*
- **M03.03 — Embeddings and similarity**
  1. For unit-normalized embeddings, cosine similarity equals dot product; verify normalization and guard zero vectors first. *([P41](#p41))*
- **M03.04 — API-style function contracts**
  1. Model each API as a small contract: accepted fields → validation → computation → predictable response or error. A traceable invalid-input path is as important as the happy path. *([P34](#p34))*
- **M03.05 — Robustness and security basics**
  1. Treat retrieved documents, model responses and user text as *data*, not authority to change system instructions or reveal secrets. *([P33](#p33))*

**Gate:** successful small pipeline/algorithm implementation with tests, no data leakage and clear evaluation interpretation.

### 21. I01 — Live coding strategy and communication
**Domain:** Interview. **Intent:** Turn problem solving into a practiced repeatable interview routine.
**Reference anchors:** [R32], [R33], [R34], [R01].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **I01.01** The 60-second prompt scan | Parse I/O, constraints, examples and edge cases under a clock | Restate problem without rereading repeatedly | Two timed prompt summaries |
| **I01.02** Talk through a solution | Explain naive approach, invariant and chosen data structure | Narrate a two-minute plan concisely | Explain array search |
| **I01.03** Write first correct version | Build something testable before optimization | Deliver a simple implementation fast | Fresh 3-minute function |
| **I01.04** Test adversarial cases quickly | Use standard, boundary and tricky examples | Catch errors with a fast checklist | Review an unseen solution |
| **I01.05** Recover from being stuck | Switch from overcomplication to simpler plan | Apply escalating fallback strategy | Partial credit scenario |
| **I01.06** Use hints then fade | Compare unaided, conceptual-hint and pseudocode paths | Re-solve novel transfer problem unaided | Recover from a deliberately hard prompt |
| **I01.07** Live coding checkpoint | Implement and explain two unfamiliar easy problems | Hit correctness and speed gate | Two independent tasks |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **I01.01 — The 60-second prompt scan**
  1. Spend the first minute collecting the signature, example, constraints and likely edge cases; then stop rereading and state a concrete approach. *([P12](#p12))*
  2. If the problem is long, condense it into a one-sentence transformation: “given X, return Y satisfying Z.” *(mentor heuristic)*
- **I01.02 — Talk through a solution**
  1. Narrate the invariant, not every keystroke: explain what your set, pointer or accumulator guarantees after each iteration. *([P12](#p12))*
- **I01.03 — Write first correct version**
  1. Write a correct baseline before chasing asymptotic optimization; a working O(n²) solution beats an unfinished O(n) sketch in many short screens. *([P12](#p12))*
- **I01.04 — Test adversarial cases quickly**
  1. Test one normal case, one boundary case and one adversarial case before saying “done”; checking inputs of length 0 or 1 often catches immediate failures. *([P09](#p09))*
- **I01.05 — Recover from being stuck**
  1. When stuck, shrink the input to the smallest nontrivial case and explicitly enumerate choices; that can reveal the missing pattern. *(mentor heuristic)*
  2. If optimization is blocking progress, temporarily revert to brute force and make correctness observable. *([P12](#p12))*
- **I01.06 — Use hints then fade**
  1. Ask for a *hint about the idea* before asking for code. After viewing a complete solution, solve a different surface problem without help before claiming mastery. *([P11](#p11))*

**Gate:** fresh timed independent tasks meeting accuracy, edge-case and communication criteria specified below.

### 22. I02 — Mixed timed interview assessments
**Domain:** Interview. **Intent:** Prove transferable readiness on unseen multi-topic tasks without leaning on answer recognition.
**Reference anchors:** [R32], [R33], [R34], [R35].

| Lesson | Explicit teaching content | Observable mastery / feedback target | Original exercise family |
|---|---|---|---|
| **I02.01** Short question calibration | Build reading-speed and code-completion fluency | Complete four short tasks with strict individual budgets | Warm-up timed set |
| **I02.02** Mixed code + numerical test | Integrate Python, matrices, metrics and reasoning | Solve assorted unfamiliar tasks | 10–15 minute assessment |
| **I02.03** Twenty-minute first screening | Mix conceptual items and function writing | Manage budget without overrunning | Unseen 20-minute simulation |
| **I02.04** Thirty-minute live coding | Explain choices, implement, test and improve | Solve one larger challenge under observation simulation | Unseen live coding interview |
| **I02.05** Error log and repair | Classify mistakes by comprehension, syntax, logic, math, speed | Design targeted repair drills | Review unsuccessful tasks |
| **I02.06** Final transfer and certification | Pass three fresh mixed assessments at target thresholds | Demonstrate independent consistent results | Final capstone assessment |

**Mentor notes — optional, lesson-specific.** The tips below supplement (do not replace) the teaching content and exercises. `Source-guided` means a concise synthesis informed by the cited technical reference; `Mentor heuristic` is a teaching inference, not a quoted rule.

- **I02.01 — Short question calibration**
  1. Calibrate speed by question type instead of expecting every “easy” problem to take the same time; note reading time separately from implementation time. *(mentor heuristic)*
- **I02.02 — Mixed code + numerical test**
  1. In mixed exams, first identify the question's mode—code trace, numeric calculation, short algorithm, or library scaffold—then use the right scratchpad technique. *(mentor heuristic)*
- **I02.03 — Twenty-minute first screening**
  1. Decide in advance on a stopping rule: if no implementable approach appears after a short effort, record a partial solution or move on when navigation is allowed. *(mentor heuristic)*
- **I02.04 — Thirty-minute live coding**
  1. Rehearse with no autocomplete or AI, and finish with a verbal test walk-through; practice conditions should resemble actual interview constraints. *([P12](#p12))*
- **I02.05 — Error log and repair**
  1. Classify every miss by *cause*—misread prompt, missing concept, wrong algorithm, syntax, edge case, or clock—not merely by right/wrong. *(mentor heuristic)*
- **I02.06 — Final transfer and certification**
  1. Use fresh transfer tasks after each mock; repeating the identical problem tests memory more than general coding readiness. *([P11](#p11))*

**Gate:** fresh timed independent tasks meeting accuracy, edge-case and communication criteria specified below.

## 6. Skills coverage and curriculum balance
| Skill family | Modules | What the learner produces |
|---|---|---|
| Python execution and independent functions | F01–F06 | Trace tables, debugged functions, clean testable code |
| Algorithms and DSA | A01–A05 | Array/string/hash/two-pointer/window/stack/graph solutions and complexity explanations |
| Data and numerical programming | D01–D03 | NumPy transformations, dimensionality-reduction code, pandas pipelines |
| Mathematics and statistics | S01–S02 | Computed probabilities, log loss, confusion metrics, A/B analysis |
| Applied ML and AI programming | M01–M03 | Train/evaluation pipeline, ML primitive implementation, embedding/retrieval helper |
| Live technical interviews | I01–I02 | Recorded independent solutions, mock interviews, repair plans |

### Optional post-core branches (not necessary to pass junior screenings)
- **Stretch algorithms:** heaps, more complex graph algorithms, backtracking and beginner dynamic programming. Unlock only after repeated real evidence of need.
- **Applied software engineering:** modules/packages, type hints, pytest, mocking, logging, Git and CI. Useful for on-the-job readiness and portfolio.
- **ML engineering depth:** PyTorch training loops, GPU, model serving, embeddings/RAG evaluation. Focus on independent coding around existing expertise.
- **Data science interviews:** SQL, A/B design, sampling, statistical inference and pandas coding. Role-dependent.

## 7. Assessment and gating rules
The app stores **two independent scores**: (A) conceptual comprehension and (B) independent implementation. Recognition points never substitute for code-writing points.

| Criterion | Operational rule |
|---|---|
| Mastery attempt | At least one never-seen task from the topic, blank editor, no solution-generation AI or H3/H4 hints. |
| Correctness | All published tests and representative hidden tests pass; errors classified by type. |
| Edge cases | Pass empty/singleton, duplicates, negative values, unusual shapes, or nulls when defined in specification. |
| Explainability | Learner can state main invariant/strategy and at least one failure mode. |
| Speed | Record timing separately; first correct untimed, then move toward targets. |
| Unlock threshold | At least 80% independent correctness across **five fresh representative tasks** plus two consecutive clean completions; for statistics at least 85% on fresh calculations. |
| Hints | Full-solution help resets independent mastery for that specific task, but can be pedagogically useful. |
| Spaced retrieval | Review due after ~1, 3, 7, 14 and 30 days; adjust based on errors and independent performance. |
| Failure recovery | After two failures, replay smaller worked example and one modification; require a new task before retesting. |
| Final readiness | Three different 20-minute mixed screens at ≥80% weighted correctness **and** one 30-minute live-coding simulation with working code, tests and explanation. Heuristic, not a guarantee of employer success. |

**Do not overfit mastery:** problems must be randomly drawn from validated variants that differ in representation, story, ordering and constraints; 80% against repeated familiar prompts is not evidence of transfer.

## 8. Exercise inventory and generation requirements
Each lesson includes **six minimum distinct exercise types**, generally:
- *Explanation check*: short free-response reason, not only multiple choice.
- *Predict*: code output prediction committed before execution.
- *Investigate*: identify changed state, references, branch or shape.
- *Modify*: a prepared function adapted for a changed requirement.
- *Write*: independent implementation from a specification and signature.
- *Transfer*: new surface context with same underlying pattern and no named hint.
The app should author **at least three independently testable problem variants per lesson** for the Make/Transfer stages and at least six boundary cases per function-writing variant; otherwise memorization and answer leakage become likely. Proposed full backlog: ~130 lessons × 6 activity slots plus variant/test banks. Treat this as content production volume, not immediate MVP scope.

### Example of a fully specified future lesson (F04.2, not prewritten code)
**Goal:** count repeated categorical labels from a list without using a high-level Counter shortcut initially.
- **Teach:** key/value maps; why repeated observation increments; safe missing keys; why dictionary lookup is useful.
- **Worked model:** count three sensor event types with a two-row dry-run table.
- **Predict:** evaluate a four-iteration frequency-update snippet with one repeated value.
- **Modify:** change an example to ignore an invalid marker and preserve original order.
- **Make:** implement `count_statuses(statuses)` that returns a dictionary of counts; specifications define empty input and case sensitivity.
- **Autograding:** standard list; empty list; all same; all unique; mixed case; marker handling; larger list; output type; no mutation of input.
- **Transfer:** implement a distinct inventory-count problem, with a changed key representation; no dictionary hint displayed.
- **Explain:** give a one-sentence argument for why a dict is appropriate; contrast with nested loops.
- **Hints:** observation→need for accumulated memory; choose key-based structure; pseudocode; skeleton; explanation + new transfer.
**Implementation note:** the lesson above is an original curriculum specification, not a quotation or copied exercise.

## 9. App content model — contract for build phase
A lesson needs content richer than a question bank. Minimum entities and fields:
```json
{
  "module_id": "F04",
  "lesson_id": "F04.02",
  "title": "Frequency maps",
  "prerequisites": ["F04.01", "F02.06"],
  "learning_objectives": ["construct a mapping of frequencies"],
  "explanation_blocks": [{"type": "concept", "text": "author-written lesson"}],
  "worked_examples": [{"code": "validated example", "narration": ["step 1"]}],
  "activities": ["predict", "run", "investigate", "modify", "make", "transfer"],
  "exercise_bank_ids": ["F04.02.E01", "F04.02.E02"],
  "hint_ladder": ["concept", "strategy", "pseudocode", "skeleton", "solution"],
  "mastery_rule": {"fresh_tasks": 5, "min_independent_pass_rate": 0.80},
  "source_anchors": ["R14", "R32"]
}
```
Other entities: `Exercise` (prompt, function signature, constraints, public and hidden tests, difficulty, allowed modules, seeded variants); `Attempt` (code, runtime, stdout, errors, test results, hints, latency, independence); `ConceptMastery`; `ReviewDue`; `Session`; `TimedAssessment`; `TutorConversation` (per lesson, with privacy and deletion controls).

### Execution and grading rules
- Early exercises run **Python in an isolated runtime**; display stdout, exceptions and test feedback. Never promise that browser sandboxing is a complete security boundary.
- **No `eval` of arbitrary user text in trusted app context**; execute code in an isolated worker/runtime with time/memory budget and interrupt/reset functionality. For powerful or unrestricted code, use a server-side sandbox.
- For code-completion exercises, inject and execute validated references and user submissions in separate contexts to avoid state contamination.
- For numpy/pandas tasks, run actual supported packages in the runtime; where unavailable, clearly label a concept-only task rather than simulating semantics inaccurately.
- Keep private expected outputs outside answer-visible prompts; hidden tests should be kept outside any client-shipped source if they must remain secret (the purely local MVP cannot guarantee secrecy).
- Separate **lesson explanations and solution templates** from grading fixtures; add versioning and tests for lesson content itself.

### AI tutor policy
- Tutor receives current concept, lesson, current code, errors and hint history; it first uses Socratic prompts and a repair strategy rather than immediately emitting full code.
- Full code solutions are allowed in **learning mode** after explicit request, but the app then assigns a genuinely new transfer problem for independent mastery.
- A **mock interview mode** hides AI and most hints until debrief so performance remains meaningful.
- Favor deterministic curricular sequencing and tests over an LLM inventing unverified requirements or judging correctness solely from prose.

## 10. Suggested app roll-out (curriculum first, software second)
**Release A, teaching vertical slice:** O00, F01 and F02 only; produce genuine lessons and code execution, hints, run output, tests and stored progress. Goal is to validate that *teaching works*, not boast a large question count.

**Release B, independent coding foundation:** F03–F06 plus assessments and adaptive review. This unlocks substantial short-function fluency.

**Release C, interview patterns:** A01–A05 plus mini-mocks and transfer variants. Do not add a huge algorithm bank before grading and explanations work well.

**Release D, data/ML:** D01–D03, S01–S02, M01–M03; realistic numerical/ML coding tasks using supported environments.

**Release E, screen simulator:** I01–I02, longer simulations, progress dashboards, optional integrated AI tutor and content management.

**Sizing caution:** Full delivery entails content authoring and validation, not just frontend programming. Building a visually complete app in a day is different from shipping dozens of hours of accurate lessons with original, tested exercises.

## 11. Out of scope on purpose
- Complete beginner setup lessons for every operating system; available as optional references only.
- Advanced metaclasses, descriptors, low-level memory internals, multiprocessing and deep async design for initial screening readiness.
- Extensive dynamic programming, segment trees, complex graph algorithms and competitive-programming optimizations.
- Advanced theoretical statistics, mathematical proofs, extensive PDEs, research-optimized neural architectures.
- Huge MLOps infrastructure builds, AWS bills, paid data services and unrelated product analytics.
- Recreating real employer assessment questions or implying these are genuine leaked question banks.

## 12. Quality assurance before calling the curriculum “ready for learning”
1. Lesson objectives match the concepts taught and tested; no prerequisite is silently missing.
2. Every code snippet executes under the declared Python and library versions, with its expected stdout checked.
3. Every numerical solution is re-verified including edge cases and floating-point tolerance.
4. Every rubric/test defines input contract, accepted outputs and assumptions explicitly.
5. Every hint helps without revealing the target solution prematurely; H4 explanations trigger an independent follow-up.
6. Content accessibility: readable on phone, keyboard usable, code editor focus, color-independent feedback.
7. Timed tests separate reading, planning, coding and debugging time where possible, without pretending to know employer scoring.
8. Human learner feedback should be collected on clarity, overwhelm, and whether self-explanation improved, then curriculum changed version-by-version.

## 13. Bibliography — primary inspected curriculum resources
<a id="r01"></a>
- **[R01] Harvard CS50P** (University course). [https://cs50.harvard.edu/python/syllabus/](https://cs50.harvard.edu/python/syllabus/). Scope evidenced: Python, functions, control flow, tests, exceptions, files, OOP. Accessed 2026-11-17.
<a id="r02"></a>
- **[R02] University of Helsinki: Introduction to Programming** (University course). [https://programming-25.mooc.fi/](https://programming-25.mooc.fi/). Scope evidenced: Progressive fundamentals, loops, functions, collections, many graded exercises. Accessed 2026-11-17.
<a id="r03"></a>
- **[R03] University of Helsinki: Advanced Course in Programming** (University course). [https://programming-25.mooc.fi/part-8/](https://programming-25.mooc.fi/part-8/). Scope evidenced: Objects, classes, methods, larger Python exercises. Accessed 2026-11-17.
<a id="r04"></a>
- **[R04] MIT 6.100L** (University course). [https://introcomp.mit.edu/6.100L_sp25](https://introcomp.mit.edu/6.100L_sp25). Scope evidenced: Computational thinking, algorithms, data structures, debugging, complexity. Accessed 2026-11-17.
<a id="r05"></a>
- **[R05] UC Berkeley CS61A** (University course). [https://cs61a.org/fa26/syllabus/](https://cs61a.org/fa26/syllabus/). Scope evidenced: Abstraction, environments, recursion, objects, iterators. Accessed 2026-11-17.
<a id="r06"></a>
- **[R06] Python for Everybody (PY4E)** (University/open course). [https://www.py4e.com/lessons](https://www.py4e.com/lessons). Scope evidenced: Variables through collections, files, web, databases. Accessed 2026-11-17.
<a id="r07"></a>
- **[R07] Google Python Class** (Open course). [https://developers.google.com/edu/python/exercises/basic](https://developers.google.com/edu/python/exercises/basic). Scope evidenced: Strings, lists, sorting, dictionaries, files, word-count exercises. Accessed 2026-11-17.
<a id="r08"></a>
- **[R08] Microsoft Learn Python Fundamentals** (Learning path). [https://learn.microsoft.com/en-us/training/paths/get-started-with-python-fundamentals/](https://learn.microsoft.com/en-us/training/paths/get-started-with-python-fundamentals/). Scope evidenced: Variables, strings, conversion, conditionals, guided units. Accessed 2026-11-17.
<a id="r09"></a>
- **[R09] Microsoft Learn Python Building Programs** (Learning path). [https://learn.microsoft.com/en-us/training/paths/get-started-with-python-programs/](https://learn.microsoft.com/en-us/training/paths/get-started-with-python-programs/). Scope evidenced: Loops, collections, functions, guided project blocks. Accessed 2026-11-17.
<a id="r10"></a>
- **[R10] Kaggle Intro to Programming** (Microcourse). [https://www.kaggle.com/learn/intro-to-programming/course](https://www.kaggle.com/learn/intro-to-programming/course). Scope evidenced: Arithmetic, functions, types, conditions, lists. Accessed 2026-11-17.
<a id="r11"></a>
- **[R11] Kaggle Python** (Microcourse). [https://www.kaggle.com/learn/python/hello-python](https://www.kaggle.com/learn/python/hello-python). Scope evidenced: Functions, Boolean logic, lists, loops, comprehensions, strings, libraries. Accessed 2026-11-17.
<a id="r12"></a>
- **[R12] freeCodeCamp Python Programming Fundamentals** (Project curriculum). [https://www.freecodecamp.org/learn/python-programming-fundamentals](https://www.freecodecamp.org/learn/python-programming-fundamentals). Scope evidenced: Python basics, sequences, dictionaries, errors, classes. Accessed 2026-11-17.
<a id="r13"></a>
- **[R13] freeCodeCamp Scientific Computing with Python** (Project curriculum). [https://www.freecodecamp.org/learn/scientific-computing-with-python](https://www.freecodecamp.org/learn/scientific-computing-with-python). Scope evidenced: String processing, numerical algorithms, recursion, graph paths, sorting. Accessed 2026-11-17.
<a id="r14"></a>
- **[R14] Exercism Python track** (Exercise track). [https://exercism.org/tracks/python](https://exercism.org/tracks/python). Scope evidenced: Concept exercises and independent practice; feedback and mentoring. Accessed 2026-11-17.
<a id="r15"></a>
- **[R15] Real Python: Core Fundamentals** (Learning path). [https://realpython.com/learning-paths/](https://realpython.com/learning-paths/). Scope evidenced: Basics, data structures, functions, errors, scope, comprehensions. Accessed 2026-11-17.
<a id="r16"></a>
- **[R16] Real Python: Classic DSA** (Learning path). [https://realpython.com/learning-paths/](https://realpython.com/learning-paths/). Scope evidenced: Stacks, queues, lists, search, sorting, hash tables. Accessed 2026-11-17.
<a id="r17"></a>
- **[R17] Automate the Boring Stuff, 3e** (Open book/course). [https://automatetheboringstuff.com/3e/](https://automatetheboringstuff.com/3e/). Scope evidenced: Debugging, lists, dicts, files, regex, JSON, real utilities. Accessed 2026-11-17.
<a id="r18"></a>
- **[R18] Boot.dev: Learn Python for Beginners** (Interactive path). [https://www.boot.dev/paths/backend?tech=python-golang](https://www.boot.dev/paths/backend?tech=python-golang). Scope evidenced: Functions, scope, testing, collections, errors, type hints. Accessed 2026-11-17.
<a id="r19"></a>
- **[R19] Dataquest: Data Scientist in Python** (Career path). [https://www.dataquest.io/path/data-scientist/](https://www.dataquest.io/path/data-scientist/). Scope evidenced: Python, NumPy, pandas, stats, ML, SQL and projects. Accessed 2026-11-17.
<a id="r20"></a>
- **[R20] Dataquest: Data Analyst in Python** (Career path). [https://www.dataquest.io/path/data-analyst/](https://www.dataquest.io/path/data-analyst/). Scope evidenced: Python, data cleaning, visualization, SQL, projects. Accessed 2026-11-17.
<a id="r21"></a>
- **[R21] Kaggle Pandas** (Microcourse). [https://www.kaggle.com/learn/pandas](https://www.kaggle.com/learn/pandas). Scope evidenced: I/O, indexing, summary functions, grouping, missing data, combining. Accessed 2026-11-17.
<a id="r22"></a>
- **[R22] Kaggle Intro to Machine Learning** (Microcourse). [https://www.kaggle.com/learn/intro-to-machine-learning/basic-data-exploration](https://www.kaggle.com/learn/intro-to-machine-learning/basic-data-exploration). Scope evidenced: Basic models, validation, overfitting, random forests. Accessed 2026-11-17.
<a id="r23"></a>
- **[R23] Kaggle Intermediate Machine Learning** (Microcourse). [https://www.kaggle.com/learn/intermediate-machine-learning/](https://www.kaggle.com/learn/intermediate-machine-learning/). Scope evidenced: Missing data, categorical variables, pipelines, CV, leakage. Accessed 2026-11-17.
<a id="r24"></a>
- **[R24] Google Machine Learning Crash Course** (Official interactive course). [https://developers.google.com/machine-learning/crash-course](https://developers.google.com/machine-learning/crash-course). Scope evidenced: Linear/logistic regression, metrics, data, overfitting, nets, LLMs. Accessed 2026-11-17.
<a id="r25"></a>
- **[R25] DeepLearning.AI Machine Learning Specialization** (Specialization). [https://www.deeplearning.ai/specializations/machine-learning](https://www.deeplearning.ai/specializations/machine-learning). Scope evidenced: Supervised/unsupervised learning, optimization, neural nets, recommender systems. Accessed 2026-11-17.
<a id="r26"></a>
- **[R26] fast.ai Practical Deep Learning for Coders** (Practical course). [https://course.fast.ai/](https://course.fast.ai/). Scope evidenced: Top-down model building, experimentation, training and deployment. Accessed 2026-11-17.
<a id="r27"></a>
- **[R27] Stanford CS229** (University course). [https://cs229.stanford.edu/syllabus-new.html](https://cs229.stanford.edu/syllabus-new.html). Scope evidenced: Linear algebra, regression, classification, optimization, kernels, PCA. Accessed 2026-11-17.
<a id="r28"></a>
- **[R28] PyTorch Learn the Basics** (Official tutorials). [https://docs.pytorch.org/tutorials/beginner/basics/intro.html](https://docs.pytorch.org/tutorials/beginner/basics/intro.html). Scope evidenced: Tensors, DataLoader, autograd, optimization, save/load. Accessed 2026-11-17.
<a id="r29"></a>
- **[R29] Hugging Face LLM Course** (Official course). [https://huggingface.co/docs/course/chapter1/1](https://huggingface.co/docs/course/chapter1/1). Scope evidenced: Transformers, tokenization, datasets, fine-tuning, demos. Accessed 2026-11-17.
<a id="r30"></a>
- **[R30] Full Stack Deep Learning** (Advanced practical course). [https://fullstackdeeplearning.com/course/2022/](https://fullstackdeeplearning.com/course/2022/). Scope evidenced: Testing, infrastructure, deployment, data, monitoring. Accessed 2026-11-17.
<a id="r31"></a>
- **[R31] Made With ML** (Production ML course). [https://madewithml.com/courses/mlops/](https://madewithml.com/courses/mlops/). Scope evidenced: Data, training, evaluation, code/data/model tests, reproducibility. Accessed 2026-11-17.
<a id="r32"></a>
- **[R32] HackerRank Interview Preparation Kit** (Interview practice roadmap). [https://www.hackerrank.com/interview/interview-preparation-kit](https://www.hackerrank.com/interview/interview-preparation-kit). Scope evidenced: Arrays, dicts, sorting, strings, search, recursion, stacks. Accessed 2026-11-17.
<a id="r33"></a>
- **[R33] NeetCode Roadmap** (Interview roadmap). [https://neetcode.io/roadmap](https://neetcode.io/roadmap). Scope evidenced: Arrays/hashing, two pointers, stacks, binary search, windows, graphs. Accessed 2026-11-17.
<a id="r34"></a>
- **[R34] Grokking the Coding Interview** (Pattern course). [https://www.designgurus.io/course/grokking-the-coding-interview](https://www.designgurus.io/course/grokking-the-coding-interview). Scope evidenced: Two pointers, windows, fast/slow, graph patterns and mixed recognition. Accessed 2026-11-17.
<a id="r35"></a>
- **[R35] Interview Query: Data Science Interview** (Interview path). [https://www.interviewquery.com/learning-paths/data-science-interview/introduction-to-data-science/overview-of-the-data-science-learning-path](https://www.interviewquery.com/learning-paths/data-science-interview/introduction-to-data-science/overview-of-the-data-science-learning-path). Scope evidenced: Python, probability, statistics, experiments, preprocessing, ML. Accessed 2026-11-17.
<a id="r36"></a>
- **[R36] Official NumPy Beginner and User Guides** (Official tutorial sequence). [https://numpy.org/doc/stable/user/absolute_beginners](https://numpy.org/doc/stable/user/absolute_beginners). Scope evidenced: ndarrays, shapes, broadcasting, axes, views/copies, operations. Accessed 2026-11-17.
<a id="r37"></a>
- **[R37] Official pandas Getting Started** (Official tutorial sequence). [https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html). Scope evidenced: I/O, indexing, columns, summaries, joins, reshaping, time series. Accessed 2026-11-17.
<a id="r38"></a>
- **[R38] scikit-learn Common Pitfalls** (Official practices guide). [https://scikit-learn.org/stable/common_pitfalls](https://scikit-learn.org/stable/common_pitfalls). Scope evidenced: Leakage, preprocess consistency, pipeline correctness. Accessed 2026-11-17.
<a id="r39"></a>
- **[R39] Real Python: ML with Python** (Learning path). [https://realpython.com/learning-paths/machine-learning-python/](https://realpython.com/learning-paths/machine-learning-python/). Scope evidenced: Classical ML through NLP, CV, LLM applications. Accessed 2026-11-17.
<a id="r40"></a>
- **[R40] Python for Data Analysis, 3e** (Open-access text). [https://wesmckinney.com/book/preliminaries](https://wesmckinney.com/book/preliminaries). Scope evidenced: NumPy, pandas, data wrangling, grouping, cleaning and modelling. Accessed 2026-11-17.

## 14. Pedagogy and design research (separate from course comparisons)
- **[P01]** Sue Sentance. “PRIMM: A structured approach to teaching programming.” https://suesentance.net/2017/09/01/primm-a-structured-approach-to-teaching-programming/ — original teaching structure.
- **[P02]** Raspberry Pi Foundation. “Computing pedagogy.” https://www.raspberrypi.org/teach/pedagogy — read/explore before writing, PRIMM, scaffolding.
- **[P03]** Education Endowment Foundation. “Metacognition and self-regulation.” https://educationendowmentfoundation.org.uk/16-19/developing-independent-learners/metacognition-and-self-regulation — explicit planning, monitoring, reflecting and guided independence.
- **[P04]** Exercism. “Syllabus guidance.” https://exercism.org/docs/building/tracks/syllabus — concept prerequisites, guided concept exercises and separate practice exercises.

## 15. Change log and ownership
- **v1.0 (2026-11-17):** Initial research synthesis and complete module/lesson-level teaching blueprint, designed for a personal AI-assisted Android-installable learning app. Lessons are original specifications; not yet authored executable teaching content.
- **Next revision trigger:** After the first five learners sessions and user feedback (or first working vertical slice), revise lesson granularity, performance targets and prerequisites as needed.
- **Canonical working format:** Markdown for human review and future editing; JSON metadata for app construction; DOCX as a readable companion.



## 16. Mentor-note research bibliography (supplementary to original 40 sources)
The earlier [R01]–[R40] source reviews remain unchanged. The [P01]–[P46] resources below inform individual mentor notes; notes marked “mentor heuristic” are original instructional synthesis rather than sourced facts. These are not quotations or copied problems. Source pages were reviewed by topic; not every tip is a claim directly made verbatim by its linked source.

<a id="p01"></a>
- **[P01] Python execution model: names and binding:** https://docs.python.org/3/reference/executionmodel.html
<a id="p02"></a>
- **[P02] Python copy: shallow vs deep:** https://docs.python.org/3/library/copy.html
<a id="p03"></a>
- **[P03] Python Tutor: step-by-step tracing:** https://pythontutor.com/visualize.html
<a id="p04"></a>
- **[P04] Python tutorial: control flow and functions:** https://docs.python.org/3/tutorial/controlflow.html
<a id="p05"></a>
- **[P05] Python tutorial: data structures:** https://docs.python.org/3/tutorial/datastructures.html
<a id="p06"></a>
- **[P06] Python collections: Counter, defaultdict, deque:** https://docs.python.org/3/library/collections.html
<a id="p07"></a>
- **[P07] Python itertools: combinations and iterators:** https://docs.python.org/3/library/itertools.html
<a id="p08"></a>
- **[P08] Python sorting HOWTO:** https://docs.python.org/3/howto/sorting.html
<a id="p09"></a>
- **[P09] Python unittest: creating tests:** https://docs.python.org/3/library/unittest.html
<a id="p10"></a>
- **[P10] Python pdb debugger:** https://docs.python.org/3/library/pdb.html
<a id="p11"></a>
- **[P11] Sentance and Waite: PRIMM pedagogy:** https://suesentance.net/2017/09/01/primm-a-structured-approach-to-teaching-programming/
<a id="p12"></a>
- **[P12] NeetCode: coding interview preparation and patterns:** https://blog.neetcode.io/p/prepare-coding-interviews
<a id="p13"></a>
- **[P13] USACO Guide: two pointers and sliding windows:** https://usaco.guide/silver/two-pointers
<a id="p14"></a>
- **[P14] USACO Guide: prefix sums:** https://usaco.guide/silver/prefix-sums
<a id="p15"></a>
- **[P15] CP-Algorithms: binary search and invariants:** https://cp-algorithms.com/num_methods/binary_search.html
<a id="p16"></a>
- **[P16] CP-Algorithms: breadth-first search:** https://cp-algorithms.com/graph/breadth-first-search.html
<a id="p17"></a>
- **[P17] CP-Algorithms: depth-first search:** https://cp-algorithms.com/graph/depth-first-search.html
<a id="p18"></a>
- **[P18] CP-Algorithms: Dijkstra shortest paths:** https://cp-algorithms.com/graph/dijkstra.html
<a id="p19"></a>
- **[P19] NumPy: broadcasting rules:** https://numpy.org/doc/stable/user/basics.broadcasting.html
<a id="p20"></a>
- **[P20] NumPy: ndarray indexing:** https://numpy.org/doc/stable/user/basics.indexing.html
<a id="p21"></a>
- **[P21] NumPy: eigh eigenvalue/eigenvector ordering:** https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html
<a id="p22"></a>
- **[P22] scikit-learn: PCA/decomposition:** https://scikit-learn.org/stable/modules/decomposition.html
<a id="p23"></a>
- **[P23] pandas: grouping split/apply/combine:** https://pandas.pydata.org/docs/user_guide/groupby.html
<a id="p24"></a>
- **[P24] pandas: merge validation and join semantics:** https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html
<a id="p25"></a>
- **[P25] scikit-learn: common pitfalls and data leakage:** https://scikit-learn.org/stable/common_pitfalls.html
<a id="p26"></a>
- **[P26] scikit-learn: TimeSeriesSplit:** https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html
<a id="p27"></a>
- **[P27] Google Machine Learning Crash Course: classification metrics:** https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall
<a id="p28"></a>
- **[P28] Google Machine Learning Crash Course: threshold selection:** https://developers.google.com/machine-learning/crash-course/classification/thresholding
<a id="p29"></a>
- **[P29] Python math: logarithms and exponentials:** https://docs.python.org/3/library/math.html
<a id="p30"></a>
- **[P30] Penn State STAT 500: confidence intervals:** https://online.stat.psu.edu/stat500/Lesson05
<a id="p31"></a>
- **[P31] SciPy: numerically stable logsumexp:** https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.logsumexp.html
<a id="p32"></a>
- **[P32] scikit-learn: StandardScaler and train-based moments:** https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html
<a id="p33"></a>
- **[P33] OWASP: prompt injection from untrusted content:** https://genai.owasp.org/glossary/prompt-injection/
<a id="p34"></a>
- **[P34] Python json parsing:** https://docs.python.org/3/library/json.html
<a id="p35"></a>
- **[P35] PyTorch tutorial: datasets/dataloaders:** https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html
<a id="p36"></a>
- **[P36] scikit-learn: precision-recall trade-off:** https://scikit-learn.org/stable/auto_examples/model_selection/plot_precision_recall.html
<a id="p37"></a>
- **[P37] Google MLCC: overfitting:** https://developers.google.com/machine-learning/crash-course/overfitting/overfitting
<a id="p38"></a>
- **[P38] Python timeit: measuring execution time:** https://docs.python.org/3/library/timeit.html
<a id="p39"></a>
- **[P39] NumPy: copies and views:** https://numpy.org/doc/stable/user/basics.copies.html
<a id="p40"></a>
- **[P40] CP-Algorithms: topological sorting:** https://cp-algorithms.com/graph/topological-sort.html
<a id="p41"></a>
- **[P41] scikit-learn: cosine similarity and normalized dot product:** https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html
<a id="p43"></a>
- **[P43] Penn State STAT 500: p-values and hypothesis testing:** https://online.stat.psu.edu/stat500/Lesson06
<a id="p44"></a>
- **[P44] Penn State STAT 414: conditional probability:** https://online.stat.psu.edu/stat414/Lesson04
<a id="p45"></a>
- **[P45] Google ML Crash Course: log loss:** https://developers.google.com/machine-learning/crash-course/logistic-regression/loss-regularization
<a id="p46"></a>
- **[P46] Penn State STAT 200: median, mean and outliers:** https://online.stat.psu.edu/stat200/Lesson02

### Editorial selection rules
- Maximum three mentor tips per lesson; straightforward and redundant checkpoints may receive none.
- Prefer topic-specific mechanisms over generic encouragement. Use mnemonic or memory hooks only for a repeatedly confusing distinction.
- Preserve the original lessons, research comparison, objectives, gates, exercise families and app content model; mentor notes are an additive layer.
- Treat cited URLs as further-reading evidence, not as permissions to reuse proprietary explanations or exercise wording.
- Revalidate API/version-sensitive tips when implementing runnable lessons.

### Coverage audit
- Original modules preserved: 22 / 22.
- Original lesson records preserved: 135 / 135.
- Lessons with mentor notes: 124; intentionally without: 11.
- Total curated tips: 182; max per lesson: 2.
- Source-guided tips: 133; original mentor heuristics: 49.

### Change log, version 1.1
Additive mentor-note layer and supplementary references only; no lesson removed and no objective or prerequisite rewritten.
