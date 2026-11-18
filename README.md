# ENNTOR

ENNTOR is a teaching-first learning platform for independent problem solving. Its first planned Course Pack focuses on Python and applied AI/ML interview skills. The educational goal is to write correct, explainable code from scratch, repair mistakes, and transfer understanding to unfamiliar problems.

## Current release · Milestone 2B

The Climb offers one pilot lesson, **F01.01 · Expressions and evaluation order**. Open the pilot, read the worked example, commit an output prediction, then run real Python and investigate the result. For an incorrect answer, the Investigate step gives tracing guidance and asks for a fresh prediction before Modify. An answer of 30 triggers a tentative explanation the learner can confirm or reject. That response stays in the current session. In Modify, edit a function and use Check solution to compare its return values against three public cases covering ordinary, zero, and negative inputs. Each row shows the inputs, expected value, actual value, and test status. The pilot sits outside curriculum progression. The Gym and The Room remain previews.

Run executes the editor as a script and displays stdout, stderr, and exceptions. Check solution calls the function in a fresh worker for each case and reports the verdict separately. Stop terminates the active worker. The next run starts cleanly. Reset asks before replacing your draft with starter code. Editor text is saved in localStorage for the current browser and origin. Reloading restores the draft once you repeat the prediction, which is session-only.

### Python runtime

The predev and prebuild scripts copy the pinned Pyodide assets from the installed dependency. The browser downloads them from the same origin when you first run code. There is no execution backend or external submission service.

Browser Python is for local educational use with code you trust. The dedicated worker keeps Python off the UI thread. The pilot limits execution time and captured output and provides no browser globals through Pyodide's configured JS bridge. The browser controls memory, and this setup provides no hard memory or security isolation guarantee. Public test cases and verdicts can be inspected or modified in browser tools. Package installation, interactive stdin, and offline installation are outside the pilot.

## Install and develop

Use Node.js 22.12 or later. Node.js 24 is the verified development environment. From the repository root, run

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. Vite uses a strict development port and reports an error if port 5173 is occupied. Stop the server with Ctrl+C.

```sh
npm run typecheck
npm run build
npm run preview
```

The production build runs strict TypeScript checks and emits static assets to dist/. The preview command normally serves the production build at <http://127.0.0.1:4173>. The development and preview servers bind to loopback. To manually check on a phone on your trusted local network, run `npm run dev -- --host 0.0.0.0` and use the network URL printed by Vite.

The app requests DM Sans and Space Grotesk from Google Fonts. System sans-serif fallbacks keep it usable when fonts cannot load. There are no AI requests or paid services. Future font self-hosting is recorded as an architectural option.

## Source structure

| Folder | Responsibility |
| --- | --- |
| src/app | Home, area previews, and navigation |
| src/platform | Theme preference and shared visual tokens/styles |
| src/courses | Versioned course, module, lesson, and exercise contracts |
| src/learning | Lesson delivery/progression contracts |
| src/progress | Historical attempts and evidence-backed mistake contracts |
| src/execution | Language-neutral execution interface and grading result contract |
| src/mentoring | Consented context and reasoning-feedback contracts |
| docs/architecture | Accepted amendments and reversible engineering decisions |

Contracts reserve stable IDs, prerequisites, teaching blocks, mentor tips, and grading configuration. They establish boundaries only. Future structured content needs runtime validation and executable content QA before publication. The interface supports future language adapters such as SQL without shipping an engine or full plugin system now.

## Educational and development specifications

Read both authoritative sources before changing product behavior or course design.

- [Product Experience & Behavior Master Spec v1.0](docs/Enhtor_Product_Experience_Behavior_Master_Spec_v1.0.md)
- [Python & AI Interview Learning Curriculum v1.1](docs/Python_AI_Interview_Learning_Curriculum_v1.1.md)
- [Accepted amendments and engineering decisions](docs/architecture/DECISIONS.md)

The curriculum specifies **22 modules and 135 lessons**, including placement. It combines explicit mental models, worked examples, Predict → Run → Investigate → Modify → Make, independent transfer, and spaced retrieval. These are blueprints, not completed executable course content. Preserve the original specifications and record amendments separately.

Reasoning-aware feedback is a fundamental goal. It should analyze an implementation using concrete evidence, distinguish plausible misconceptions from facts, and teach a better approach. Fresh independent coding remains central to mastery.

## Milestone roadmap

1. **Application foundation** — navigation, theme, design tokens, and architectural contracts.
2. **First teaching slice** — F01.01 pilot with explanation, prediction, execution, deterministic checks, and local drafts. Fresh independent transfer is reserved for later.
3. **Learning evidence and mentoring** — persist historical attempts and misconceptions safely, investigate eligible subscription-authorized ChatGPT integration, and evaluate reasoning-aware feedback.
4. **Targeted practice and assessment** — introduce evidence-based Gym workouts and quiet Room simulations in small milestones.
5. **Expansion** — grow validated course content, accounts/device continuity, and full offline capabilities through reviewed milestones.

The MVP is online-first. Offline functionality remains a future goal. AI may create supplementary material but cannot change the official curriculum. Never enable billable API requests without an explicit future change to the accepted decision. Subscription authorization eligibility is unverified.

## Verification

For each release, run the production build and launch the application. For this shell, check all navigation links, direct routes, back/forward, theme persistence across reloads, keyboard focus, reduced motion, and narrow/mobile layouts. Use the minimum checks that verify the changed behavior. Document any limits in the milestone report.

## Preparing for a public repository

Review staged files and diffs before every commit. Ignore rules cover dependencies, build output, environment files, keys, local logs, and designated local learner-data folders. Ignore patterns are a convenience, so also inspect content for secrets and personal data. Keep real attempts, exports, credentials, and tokens outside tracked source. Never place secrets in Vite variables exposed to browser code. Use synthetic fixtures if later tests require learner examples.

The public specifications generalize private learner and employer assessment details. The original documents and development history are retained privately.
