import type { Exercise } from '../courses/contracts';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

export const f01Concept = 'python.evaluation-order';

export const cargoWorkout: Exercise = {
  id: 'gym.F01.01.cargo', version: '1.0.0', lessonId: 'F01.01',
  title: 'Read a warehouse scale', kind: 'transfer', difficulty: 1,
  conceptIds: [f01Concept],
  prompt: [
    'The scale shows the ', { role: 'emphasis', text: 'combined weight' }, ' of the cargo and its empty pallets. Each pallet weighs 4 kg. The dispatch record needs the weight of the ', { role: 'emphasis', text: 'cargo alone' }, '.\n\n',
    'Define ', { role: 'function', text: 'cargo_weight()' }, ' with two nonnegative integer inputs, in order: ',
    { role: 'variable', text: 'gross' }, ' (the scale reading in kg) and ',
    { role: 'variable', text: 'pallets' }, ' (the number of pallets). The scale reading always covers the full pallet weight. Return the cargo-only weight as an integer in kg.\n\n',
    'Example: the scale reads 31 kg with 3 pallets. The cargo weighs 19 kg.',
  ],
  starterCode: '# Write the full function here.\n',
  hints: [
    { level: 'H0', text: 'What does the scale reading include that the dispatch record excludes?' },
    { level: 'H1', text: ['Think about how ', { role: 'variable', text: 'pallets' },
      ' affects the total weight of the packaging. Check what should happen when there are zero pallets.'] },
    { level: 'H3', text: ['Use a named intermediate value for the packaging weight. Then think about how that weight relates to the scale reading.'] },
    { level: 'H4', text: ['Three pallets weigh 12 kg. The scale shows 31 kg for both components, so 19 kg belongs to the cargo. With no pallets the reading is already cargo-only. The same relationship works when every kilogram belongs to the pallets.'],
      solutionCode: 'def cargo_weight(gross, pallets):\n    packaging = pallets * 4\n    return gross - packaging' },
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

export const visitorWarmUp: Exercise = {
  ...cargoWorkout, id: 'gym.F01.01.visitors', title: 'Adjust a visitor forecast', kind: 'modify',
  prompt: ['A venue has a confirmed visitor count and expects the same number of extra guests at each of two sessions. Change ',
    { role: 'function', text: 'visitors()' }, ' so the confirmed count is included ', { role: 'emphasis', text: 'only once' }, '. Both inputs are nonnegative integers. For 10 confirmed guests and 3 extra guests per session, return 16.'],
  starterCode: 'def visitors(confirmed, extra):\n    return (confirmed + extra) * 2\n',
  hints: [{ level: 'H0', text: 'Which group of guests occurs twice?' }],
  execution: { ...cargoWorkout.execution!, entryPoint: 'visitors' },
  grading: { ...cargoWorkout.grading, rubric: 'Return the forecast visitor count.', publicCases: [
    { id: 'ordinary', input: [10, 3], expected: 16 },
    { id: 'no-extra', input: [7, 0], expected: 7 },
    { id: 'no-confirmed', input: [0, 4], expected: 8 },
  ] },
};

export const postcardTransfer: Exercise = {
  ...cargoWorkout, id: 'gym.F01.01.postcards', title: 'Count postcards for an exhibition',
  prompt: ['An exhibition receives cartons of postcards. Every carton contains ', { role: 'emphasis', text: '6 postcards' }, '. A separate delivery contains loose postcards. The exhibit needs the total number of postcards. Define ',
    { role: 'function', text: 'postcard_total()' }, ' with nonnegative integer inputs ',
    { role: 'variable', text: 'cartons' }, ' and ', { role: 'variable', text: 'loose' },
    ', in that order. Return the total as an integer. For 3 cartons and 5 loose postcards, return 23.'],
  hints: [],
  execution: { ...cargoWorkout.execution!, entryPoint: 'postcard_total' },
  grading: { ...cargoWorkout.grading, rubric: 'Return the total number of postcards.', publicCases: [
    { id: 'ordinary', input: [3, 5], expected: 23 },
    { id: 'no-cartons', input: [0, 7], expected: 7 },
    { id: 'no-loose', input: [2, 0], expected: 12 },
  ] },
};

export const evaluationWarmUp = {
  id: 'evaluation-order.modify.v2',
  guidedExercise: visitorWarmUp,
  title: 'Think about the total',
  refresher: 'A total can contain several components. Name what the total includes and what the result should represent. When you trace an expression, check which operations group together before you evaluate it.',
  simpleCase: 'Before writing code, choose a simple example in which one component is absent. What should the result represent in that case?',
  focus: {
    'repeated-errors': 'Use one small case to check the order in which you evaluate the expression.',
    'try-unaided': 'Work through the small case yourself before opening any hints.',
  },
};
