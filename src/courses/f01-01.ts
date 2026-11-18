import type { CoursePack, Exercise } from './contracts';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

const version = '1.0.0';
const lessonVersion = '1.1.0';
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
    configuration: {
      explanation: 'Trace backwards from print: it needs base and extra. Then execute forwards: base is 4, extra is 6, and multiplication happens before addition. Python prints 4 + 18, or 22.',
    },
  },
};
const modify: Exercise = {
  id: 'F01.01.modify', version, lessonId, title: 'Apply the multiplier to the whole sum', kind: 'modify',
  prompt: 'Change total(base, extra) so it first adds base and extra, then returns three times that sum. Both inputs are integers and may be zero or negative. Return the result from the function.',
  conceptIds: predict.conceptIds, difficulty: 1,
  hints: [{ level: 'H1', text: 'Group the addition with parentheses or assign the sum to a name before multiplying.' }],
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

export const pilotPack = {
  schemaVersion: '1.0', version: lessonVersion, id: 'python-ai-pilot',
  title: 'Python & AI interview skills', description: 'A single lesson pilot.', subject: 'Python', language: 'en',
  modules: [{ id: 'F01', version, title: 'Execution, state and references', prerequisites: [], lessonIds: [lessonId] }],
  lessons: [{
    id: lessonId, version: lessonVersion, moduleId: 'F01', title: 'Expressions and evaluation order',
    objectives: ['Distinguish expressions, statements, and displayed output.',
      'Trace dependencies backwards from an output, then execute the program forwards.'],
    prerequisites: [], estimatedMinutes: 8, exerciseIds: [predict.id, modify.id],
    progression: { requiredExerciseIds: [predict.id, modify.id], requiresIndependentTransfer: false },
    teachingBlocks: [
      { id: 'F01.01.explain', type: 'paragraph', content: [
        'An expression produces a value. An assignment is a statement that evaluates the expression on its right and binds the result to a name. Calling ',
        { role: 'function', text: 'print()' }, ' displays a value.',
      ] },
      { id: 'F01.01.trace', type: 'paragraph', content: [
        'Start at the output and ask what it needs. In the prediction below, ',
        { role: 'function', text: 'print()' }, ' needs ', { role: 'variable', text: 'base' },
        ' and ', { role: 'variable', text: 'extra' }, '. Then follow the assignments from top to bottom.',
      ] },
      { id: 'F01.01.pitfall', type: 'warning', content: [
        'Multiplication groups more tightly than addition. Use parentheses when the sum needs to happen first.',
      ] },
      { id: 'F01.01.example', type: 'worked-example', language: 'python',
        code: 'score = 2 + 3 * 4\nprint(score)',
        explanation: 'The print call depends on score. On the first line, 3 * 4 gives 12, then 2 + 12 gives 14. Assignment binds 14 to score. The second line displays 14. Parentheses around 2 + 3 would make Python add first.' },
    ],
    mentorTips: [
      { id: 'F01.01.tip1', text: 'Track values, name bindings, and displayed output as separate events.', sourceRefs: ['P01'] },
      { id: 'F01.01.tip2', text: 'Resolve inner dependencies using Python’s evaluation and short-circuit rules.', sourceRefs: ['P04'] },
    ],
  }],
  exercises: [predict, modify],
} satisfies CoursePack;

export const predictionCoaching = {
  alternativeAnswer: 30,
  possibleReasoning: 'You may have added 4 and 6 first, then multiplied the sum by 3. That gives (4 + 6) * 3 = 30.',
  actualReasoning: 'Python multiplies 6 by 3 first in this expression, then adds 4. That gives 4 + (6 * 3) = 22.',
  followUp: {
    code: 'base = 3\nextra = base + 2\nprint(base + extra * 2)',
    expected: 13,
    hint: 'Work out extra first. On the final line, identify the two values joined by * before adding base.',
    explanation: 'extra is 5. Multiplication gives 5 * 2 = 10, then adding base gives 13.',
  },
};
