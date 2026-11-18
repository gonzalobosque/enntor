# ENNTOR

ENNTOR is a teaching-first learning platform for independent problem solving. Its first planned Course Pack focuses on Python and applied AI/ML interview skills. The educational goal is to write correct, explainable code from scratch, repair mistakes, and transfer understanding to unfamiliar problems.

## Current release · Milestone 1

A responsive React application shell with three learning areas, browser navigation, and persistent light/dark mode.

- **The Climb** provides the future home for structured lessons.
- **The Gym** provides the future home for targeted training and error correction.
- **The Room** provides the future home for timed interview practice.

Each area currently opens an honest preview describing planned functionality. There are no executable lessons, Python runtime, grader, AI integration, accounts, or backend. No personal learner records are collected. Only the appearance preference is saved in the browser. Full offline functionality remains planned for a future milestone.

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

1. **Application foundation** — this release, navigation, theme, design tokens, and architectural contracts.
2. **First teaching slice** — validate one small structured course segment, prove Python execution with cancellation and deterministic grading, then connect teaching, hints, autosave, and fresh independent transfer.
3. **Learning evidence and mentoring** — persist historical attempts and misconceptions safely, investigate eligible subscription-authorized ChatGPT integration, and evaluate reasoning-aware feedback.
4. **Targeted practice and assessment** — introduce evidence-based Gym workouts and quiet Room simulations in small milestones.
5. **Expansion** — grow validated course content, accounts/device continuity, and full offline capabilities through reviewed milestones.

The MVP is online-first. Offline functionality remains a future goal. AI may create supplementary material but cannot change the official curriculum. Never enable billable API requests without an explicit future change to the accepted decision. Subscription authorization eligibility is unverified.

## Verification

For each release, run the production build and launch the application. For this shell, check all navigation links, direct routes, back/forward, theme persistence across reloads, keyboard focus, reduced motion, and narrow/mobile layouts. Use the minimum checks that verify the changed behavior. Document any limits in the milestone report.

## Preparing for a public repository

Review staged files and diffs before every commit. Ignore rules cover dependencies, build output, environment files, keys, local logs, and designated local learner-data folders. Ignore patterns are a convenience, so also inspect content for secrets and personal data. Keep real attempts, exports, credentials, and tokens outside tracked source. Never place secrets in Vite variables exposed to browser code. Use synthetic fixtures if later tests require learner examples.

The public specifications generalize private learner and employer assessment details. The original documents and development history are retained privately.
