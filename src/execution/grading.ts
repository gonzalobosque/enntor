import type { Exercise, JsonValue } from '../courses/contracts';
import type { ExecutionEngine, ExecutionResult, GradeResult } from './contracts';

export function runExercise(engine: ExecutionEngine, exercise: Exercise, source: string,
  signal: AbortSignal, test?: { input: JsonValue }): Promise<ExecutionResult> {
  const execution = exercise.execution;
  if (!execution) throw new Error('This activity has no execution configuration.');
  return engine.execute({
    ...execution,
    schemaVersion: '1.0', requestId: crypto.randomUUID(),
    exercise: { id: exercise.id, version: exercise.version }, source,
    entryPoint: test ? execution.entryPoint : undefined, input: test?.input,
  }, signal);
}

export async function gradeExercise(engine: ExecutionEngine, exercise: Exercise,
  source: string, signal: AbortSignal): Promise<{ grade: GradeResult; runs: ExecutionResult[] }> {
  const runs: ExecutionResult[] = [];
  const grade: GradeResult = {
    schemaVersion: '1.0', exercise: { id: exercise.id, version: exercise.version },
    grader: { id: exercise.grading.graderId, version: exercise.grading.graderVersion },
    verdict: 'ungraded', evidence: [],
  };
  for (const test of exercise.grading.publicCases) {
    const run = await runExercise(engine, exercise, source, signal, test);
    runs.push(run);
    if (run.status !== 'completed') return { grade, runs };
    const passed = run.value === test.expected;
    grade.evidence.push({
      id: test.id, passed,
      message: `Inputs ${JSON.stringify(test.input)}. Expected ${JSON.stringify(test.expected)}, returned ${JSON.stringify(run.value)}.`,
    });
  }
  grade.verdict = grade.evidence.every(({ passed }) => passed) ? 'passed' : 'failed';
  return { grade, runs };
}
