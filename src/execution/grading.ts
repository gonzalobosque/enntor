import type { Exercise, JsonValue, PublicCase } from '../courses/contracts';
import type { ExecutionEngine, ExecutionResult, GradeResult } from './contracts';

export function runExercise(engine: ExecutionEngine, exercise: Exercise, source: string,
  signal: AbortSignal, test?: Pick<PublicCase, 'input' | 'expectedArguments'>): Promise<ExecutionResult> {
  const execution = exercise.execution;
  if (!execution) throw new Error('This activity has no execution configuration.');
  return engine.execute({
    ...execution,
    schemaVersion: '1.0', requestId: crypto.randomUUID(),
    exercise: { id: exercise.id, version: exercise.version }, source,
    entryPoint: test ? execution.entryPoint : undefined, input: test?.input,
    observeArguments: test?.expectedArguments !== undefined || undefined,
  }, signal);
}

// The structured sequence uses ordered arrays and strict scalar leaves.
export function sameCaseValue(actual: JsonValue | undefined, expected: JsonValue): boolean {
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && actual.length === expected.length &&
      expected.every((value, index) => sameCaseValue(actual[index], value));
  }
  return actual === expected;
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
    const expectedAfter = test.expectedArguments;
    const passed = !run.invalidTypes?.length && sameCaseValue(run.value, test.expected) &&
      (expectedAfter === undefined || sameCaseValue(run.argumentsAfter, expectedAfter));
    const mutation = expectedAfter === undefined ? '' :
      ` Expected arguments after call ${JSON.stringify(expectedAfter)}, observed ${JSON.stringify(run.argumentsAfter)}.`;
    const typeIssue = run.invalidTypes?.length ? ' The observed return or input state contains a value other than a list, integer or string.' : '';
    grade.evidence.push({
      id: test.id, passed,
      message: `Inputs ${JSON.stringify(test.input)}. Expected ${JSON.stringify(test.expected)}, returned ${JSON.stringify(run.value)}.` + mutation + typeIssue,
    });
  }
  grade.verdict = grade.evidence.every(({ passed }) => passed) ? 'passed' : 'failed';
  return { grade, runs };
}
