import type { CoursePack, Exercise, TeachingInline } from './contracts';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

const fn = (text: string): TeachingInline => ({ role: 'function', text });
const name = (text: string): TeachingInline => ({ role: 'variable', text });
const keyword = (text: string): TeachingInline => ({ role: 'keyword', text });
const code = (text: string): TeachingInline => ({ role: 'code', text });

const version = '1.0.0';
const lessonVersion = '1.3.0';
const lessonId = 'F01.01';
const execution = {
  engineId: pythonEngineId, language: 'python', runtimeVersion: pythonVersion,
  allowedDependencies: [], limits: { timeoutMs: 3000, memoryMb: 128, outputBytes: 4096 },
};
const predict: Exercise = {
  id: 'F01.01.predict', version, lessonId, title: 'Predict the output', kind: 'predict',
  prompt: 'What single number will this program print?',
  conceptIds: ['python.evaluation-order'], difficulty: 1, hints: [],
  starterCode: 'base = 4\nextra = base + 2\nprint(base + extra * 3)',
  execution,
  grading: {
    graderId: 'stdout-number', graderVersion: version, rubric: 'Predict the single printed integer.',
    publicCases: [{ id: 'prediction', input: [], expected: 22 }],
    configuration: {},
  },
};
const modify: Exercise = {
  id: 'F01.01.modify', version: '1.1.0', lessonId, title: 'Apply the multiplier to the whole sum', kind: 'modify',
  prompt: ['Change ', fn('total()'), ' so it first adds ', name('base'), ' and ', name('extra'),
    ', then returns three times that sum. Both inputs are integers and may be zero or negative. Return the result from the function.'],
  conceptIds: predict.conceptIds, difficulty: 1,
  hints: [
    { level: 'H0', text: ['Try the example with ', name('base'), ' equal to 4 and ', name('extra'),
      ' equal to 6. Which part of the result changes when you change the first input?'] },
    { level: 'H1', text: ['Trace the current expression. What is being repeated three times? Compare that with the quantity the requirement describes.'] },
    { level: 'H2', text: ['Work out the combined amount as its own step. Use that amount to calculate the result.'] },
    { level: 'H4', text: ['Inside ', fn('total()'), ', write ', keyword('return'), ' ', code('(base + extra) * 3'), '.'] },
  ],
  starterCode: 'def total(base, extra):\n    return base + extra * 3\n',
  execution: { ...execution, entryPoint: 'total' },
  grading: {
    graderId: 'return-value', graderVersion: version, rubric: 'Return the integer result for each pair.',
    publicCases: [
      { id: 'ordinary', input: [4, 6], expected: 30 },
      { id: 'zero', input: [5, 0], expected: 15 },
      { id: 'negative', input: [-4, 2], expected: -6 },
    ],
    configuration: {},
  },
};

export const buildPlan = {
  prompt: ['A venue opens ', name('capacity'), ' seats per row for two rows. It then sets aside ',
    name('reserved'), ' seats in total. What should the function return?'],
  symbols: ['capacity', 'reserved', 'available'],
  options: [
    { id: 'remaining', text: 'The number of seats left after subtracting the reservation from the two-row total.' },
    { id: 'per-row', text: 'The number of seats left after subtracting the reservation from each row.' },
  ],
  correct: 'remaining',
  syntax: [keyword('def'), ' starts the function declaration. ', fn('available()'), ' takes ',
    name('capacity'), ' and ', name('reserved'), ' as parameters. The colon starts the body. Indent the body by four spaces and use ',
    keyword('return'), ' to hand back the value.'],
};

const build: Exercise = {
  id: 'F01.01.build', version, lessonId, title: 'Build a seat-count function', kind: 'write',
  prompt: ['The declaration is supplied. Replace ', keyword('pass'), ' with an indented ', keyword('return'), ' statement in ', fn('available()'),
    '. Start with twice ', name('capacity'), ' and subtract ', name('reserved'),
    ' once. For 6 seats per row and 3 reserved seats, return 9. Inputs are nonnegative integers and reservations never exceed capacity across both rows.'],
  conceptIds: predict.conceptIds, difficulty: 1,
  starterCode: 'def available(capacity, reserved):\n    pass  # Replace with your return statement.\n',
  hints: [{ level: 'H0', text: ['Trace the two quantities separately before writing the expression.'] }],
  execution: { ...execution, entryPoint: 'available' },
  grading: {
    graderId: 'return-value', graderVersion: version, rubric: 'Return the number of available seats.',
    publicCases: [
      { id: 'ordinary', input: [6, 3], expected: 9 },
      { id: 'all-reserved', input: [4, 8], expected: 0 },
      { id: 'no-reservations', input: [7, 0], expected: 14 },
    ], configuration: {},
  },
};

const make: Exercise = {
  id: 'F01.01.make', version, lessonId, title: 'Write a theatre receipt function', kind: 'write',
  prompt: ['A theatre charges the advertised price for each ticket and a flat booking fee of 4 credits per order, even for an order with zero tickets. Calculate the receipt total. Define ',
    fn('receipt()'), ' with nonnegative integer parameters ', name('tickets'), ' (the ticket count) and ',
    name('price'), ' (the price per ticket), in that order. Return the total as an integer in credits. An order for 3 tickets at 7 credits per ticket costs 25 credits.'],
  conceptIds: predict.conceptIds, difficulty: 1, starterCode: '# Write the full function here.\n',
  hints: [
    { level: 'H0', text: ['Think about which cost repeats with ', name('tickets'), ' and which cost is charged once.'] },
    { level: 'H1', text: ['Compute the ticket subtotal first. Then add the booking fee to that subtotal.'] },
    { level: 'H3', text: ['Inside ', fn('receipt()'), ', use ', keyword('return'), ' ', code('tickets * price + 4'), '.'] },
  ],
  execution: { ...execution, entryPoint: 'receipt' },
  grading: {
    graderId: 'return-value', graderVersion: version, rubric: 'Return the total for each booking.',
    publicCases: [
      { id: 'ordinary', input: [3, 7], expected: 25 },
      { id: 'zero-tickets', input: [0, 7], expected: 4 },
      { id: 'grouping', input: [2, 0], expected: 4 },
    ], configuration: {},
  },
};

const transfer: Exercise = {
  id: 'F01.01.make-transfer', version, lessonId, title: 'Write a score adjustment function', kind: 'transfer',
  prompt: ['In this tournament, a player’s original points are worth twice their face value, with any penalty applied to the final total. Calculate the final score. Define ',
    fn('adjust_score()'), ' with integer parameters ', name('score'), ' (original points) and ',
    name('penalty'), ' (points deducted), in that order. Either input may be zero or negative. A negative penalty is a credit. Return the final score as an integer. A player with 7 original points and a 3-point penalty finishes with 11.'],
  conceptIds: predict.conceptIds, difficulty: 1, starterCode: '# Write the full function here.\n', hints: [],
  execution: { ...execution, entryPoint: 'adjust_score' },
  grading: {
    graderId: 'return-value', graderVersion: version, rubric: 'Return the adjusted score.',
    publicCases: [
      { id: 'ordinary', input: [7, 3], expected: 11 },
      { id: 'grouping', input: [0, 4], expected: -4 },
      { id: 'signed', input: [-2, -3], expected: -1 },
    ], configuration: {},
  },
};

export const pilotPack = {
  schemaVersion: '1.0', version: lessonVersion, id: 'python-ai-pilot',
  title: 'Python & AI interview skills', description: 'A single lesson pilot.', subject: 'Python', language: 'en',
  modules: [{ id: 'F01', version, title: 'Execution, state and references', prerequisites: [], lessonIds: [lessonId] }],
  lessons: [{
    id: lessonId, version: lessonVersion, moduleId: 'F01', title: 'Expressions and evaluation order',
    objectives: ['Distinguish expressions, statements, and displayed output.',
      'Trace dependencies backwards from an output, then execute the program forwards.'],
    prerequisites: [], estimatedMinutes: 12, exerciseIds: [predict.id, modify.id, build.id, make.id, transfer.id],
    progression: { requiredExerciseIds: [predict.id, modify.id, build.id, make.id], requiresIndependentTransfer: true },
    teachingBlocks: [
      { id: 'F01.01.explain', type: 'paragraph', content: [
        'An expression produces a value. An assignment is a statement that evaluates the expression on its right and binds the result to a name. Calling ',
        { role: 'function', text: 'print()' }, ' displays a value.',
      ] },
      { id: 'F01.01.pitfall', type: 'warning', content: [
        'Multiplication groups more tightly than addition. Use parentheses when the sum needs to happen first.',
      ] },
      { id: 'F01.01.example', type: 'worked-example', language: 'python',
        code: 'score = 2 + 3 * 4\nprint(score)',
        explanation: ['Start from the output and trace back to what it needs. Here, ', fn('print()'), ' needs ', name('score'), '. First evaluate ', code('3 * 4'),
          ', then add ', code('2'), '. The assignment binds ', code('14'), ' to ', name('score'),
          ', and the second line displays it. Parentheses around ', code('2 + 3'), ' would make Python add first.'] },
    ],
    mentorTips: [
      { id: 'F01.01.tip1', text: 'Track values, name bindings, and displayed output as separate events.', sourceRefs: ['P01'] },
      { id: 'F01.01.tip2', text: 'Resolve inner dependencies using Python’s evaluation and short-circuit rules.', sourceRefs: ['P04'] },
    ],
  }],
  exercises: [predict, modify, build, make, transfer],
} satisfies CoursePack;

export const predictionCoaching = {
  alternativeAnswer: 30,
  explanation: ['Trace back from ', fn('print()'), ' to ', name('base'), ' and ', name('extra'),
    '. Then run forward: ', name('base'), ' is ', code('4'), ' and ', name('extra'), ' is ', code('6'),
    '. Python evaluates ', code('6 * 3'), ' before adding ', code('4'), '.'],
  modifyFeedback: ['Compare the returned values with the expected values. Check how ', fn('total()'),
    ' groups ', name('base'), ' and ', name('extra'), '.'],
  possibleReasoning: ['You may have added ', name('base'), ' and ', name('extra'), ' first, then multiplied the sum by 3. That gives ', code('(4 + 6) * 3 = 30'), '.'],
  actualReasoning: [fn('print()'), ' receives ', code('4 + (6 * 3)'), '. Python multiplies ', name('extra'), ' by 3 before adding ', name('base'), ', giving ', code('22'), '.'],
  followUp: {
    code: 'base = 3\nextra = base + 2\nprint(base + extra * 2)',
    expected: 13,
    hint: ['Work out ', name('extra'), ' first. Identify the two values joined by ', code('*'), ' before adding ', name('base'), '.'],
    explanation: [name('extra'), ' is ', code('5'), '. Multiplication gives ', code('5 * 2 = 10'), ', then adding ', name('base'), ' gives ', code('13'), '.'],
  },
};
