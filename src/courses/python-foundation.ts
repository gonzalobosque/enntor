import type { Exercise, Lesson, TeachingInline, TeachingProse } from './contracts';
import { pythonEngineId, pythonVersion } from '../execution/python-config';

export const symbol = (text: string): TeachingInline => ({ role: 'variable', text });
export const call = (text: string): TeachingInline => ({ role: 'function', text });
export const code = (text: string): TeachingInline => ({ role: 'code', text });
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

type Task = Pick<Exercise, 'title' | 'kind' | 'prompt' | 'hints'> & {
  key: string; entryPoint: string; starter?: string;
  cases: [id: string, input: number[], expected: number][];
};

export function task(lessonId: string, concept: string, config: Task): Exercise {
  const { key, entryPoint, starter, cases, ...content } = config;
  return {
    ...content, id: lessonId + '.' + key, version, lessonId, conceptIds: [concept], difficulty: 1,
    starterCode: starter ?? '# Write the full function here.\n', execution: { ...execution, entryPoint },
    grading: { graderId: 'return-value', graderVersion: version, rubric: 'Return the specified integer.',
      publicCases: cases.map(([id, input, expected]) => ({ id, input, expected })), configuration: {} },
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
