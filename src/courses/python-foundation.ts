import type { Exercise, JsonValue, Lesson, TeachingInline, TeachingProse } from './contracts';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

export const symbol = (text: string): TeachingInline => ({ role: 'variable', text });
export const call = (text: string): TeachingInline => ({ role: 'function', text });
export const code = (text: string): TeachingInline => ({ role: 'code', text });
export const token = (text: string): TeachingInline => ({ role: 'token', text });
export const operator = (text: string): TeachingInline => ({ role: 'operator', text });
export const objectLabel = (text: string): TeachingInline => ({ role: 'label', text });
export const emphasis = (text: string): TeachingInline => ({ role: 'emphasis', text });
export const version = '1.0.0';
const execution = {
  engineId: pythonEngineId, language: 'python', runtimeVersion: pythonVersion,
  allowedDependencies: [], limits: { timeoutMs: 3000, memoryMb: 128, outputBytes: 4096 },
};

export function prediction(lessonId: string, concept: string, source: string, output: number): Exercise {
  return {
    id: lessonId + '.predict', version, lessonId, title: 'Predict the output', kind: 'predict',
    prompt: 'What single integer will this code print?', starterCode: source, execution,
    conceptIds: [concept], difficulty: 1, hints: [],
    grading: { graderId: 'stdout-number', graderVersion: version, rubric: 'Predict the printed integer.',
      publicCases: [{ id: 'prediction', input: [], expected: output }], configuration: {} },
  };
}

type Task = Pick<Exercise, 'title' | 'kind' | 'prompt' | 'hints' | 'coaching'> & {
  key: string; entryPoint: string; starter?: string; revision?: string;
  cases: [id: string, input: JsonValue[], expected: JsonValue, expectedArguments?: JsonValue[]][];
};

export function task(lessonId: string, concept: string, config: Task): Exercise {
  const { key, entryPoint, starter, cases, revision = version, ...content } = config;
  return {
    ...content, id: lessonId + '.' + key, version: revision, lessonId, conceptIds: [concept], difficulty: 1,
    starterCode: starter ?? '# Write the full function here.\n', execution: { ...execution, entryPoint },
    grading: {
      graderId: cases.some((fixture) => fixture[3] !== undefined) ? 'return-and-arguments' : 'return-value',
      graderVersion: version, rubric: 'Meet the stated return and input-state requirements.',
      publicCases: cases.map(([id, input, expected, expectedArguments]) => ({ id, input, expected, expectedArguments })),
      configuration: {},
    },
  };
}

export function ladder(question: TeachingProse, relationship: TeachingProse, explanation: TeachingProse, solutionCode: string): Exercise['hints'] {
  return [
    { level: 'H0', text: question }, { level: 'H1', text: relationship },
    { level: 'H4', text: explanation, solutionCode },
  ];
}

export function foundationLesson(details: Pick<Lesson, 'id' | 'title' | 'objectives' | 'prerequisites' | 'teachingBlocks' | 'mentorTips'>,
  exercises: Exercise[]): Lesson {
  const exerciseIds = exercises.map(({ id }) => id);
  return { ...details, version, moduleId: 'F01', estimatedMinutes: 15, exerciseIds,
    progression: { requiredExerciseIds: exerciseIds.slice(0, 4), requiresIndependentTransfer: true } };
}

// The first argument is the caller's list. The remaining arguments are scalar inputs.
export function listCase(id: string, input: [JsonValue[], ...JsonValue[]], expected: JsonValue,
  firstAfter: JsonValue[] = input[0]): Task['cases'][number] {
  return [id, input, expected, [firstAfter, ...input.slice(1)]];
}
