import type { Exercise } from '../courses/contracts';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

export const f01Concept = 'python.evaluation-order';

export const cargoWorkout: Exercise = {
  id: 'gym.F01.01.cargo', version: '1.0.0', lessonId: 'F01.01',
  title: 'Read a warehouse scale', kind: 'transfer', difficulty: 1,
  conceptIds: [f01Concept],
  prompt: [
    'A warehouse weighs cargo and reusable pallets together. Each empty pallet weighs 4 kg. The dispatch record needs the weight of the cargo alone. Define ',
    { role: 'function', text: 'cargo_weight()' }, ' with nonnegative integer inputs ',
    { role: 'variable', text: 'gross' }, ' (the scale reading in kg) and ',
    { role: 'variable', text: 'pallets' }, ' (the pallet count), in that order. The reading is at least the weight of the pallets. Return the cargo weight as an integer in kg. A reading of 31 kg with 3 pallets contains 19 kg of cargo.',
  ],
  starterCode: '# Write the full function here.\n',
  hints: [
    { level: 'H0', text: 'What does the scale reading include that the dispatch record excludes?' },
    { level: 'H1', text: ['Think about how ', { role: 'variable', text: 'pallets' },
      ' affects the total weight of the packaging. Check what should happen when there are zero pallets.'] },
  ],
  execution: {
    engineId: pythonEngineId, runtimeVersion: pythonVersion, language: 'python', entryPoint: 'cargo_weight',
    allowedDependencies: [], limits: { timeoutMs: 3000, memoryMb: 128, outputBytes: 4096 },
  },
  grading: {
    graderId: 'return-value', graderVersion: '1.0.0', rubric: 'Return the cargo weight for each valid reading.',
    publicCases: [
      { id: 'multiple-pallets', input: [31, 3], expected: 19 },
      { id: 'no-pallets', input: [23, 0], expected: 23 },
      { id: 'pallets-only', input: [8, 2], expected: 0 },
    ],
    configuration: {},
  },
};
