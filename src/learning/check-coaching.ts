import type { Exercise } from '../courses/contracts';
import { diagnoseExecution, failedReturnCases } from '../execution/diagnostics';
import type { Submission } from './evidence';

export interface CheckCoaching {
  id: string;
  caseId?: string;
  fact: string;
  question: string;
}

export async function coachCheck(exercise: Exercise, submission: Submission, previous: Submission[]): Promise<CheckCoaching | undefined> {
  const shown = (id: string) => previous.some(attempt => attempt.coaching?.id === id);
  const execution = diagnoseExecution(exercise, submission);
  if (execution) {
    const { observation, nudge } = execution;
    if ('exception' in observation && !shown(nudge.id)) return {
      id: nudge.id, caseId: observation.caseId,
      fact: observation.kind === 'runtime-exception' ? `Python raised ${observation.exception} while checking the function.`
        : `Python could not parse the code (${observation.exception}).`, question: nudge.question,
    };
    return undefined;
  }
  const errorIndex = submission.runs?.findIndex(run => run.status === 'error') ?? -1;
  if (errorIndex >= 0) return shown('execution-error') ? undefined : {
    id: 'execution-error', caseId: exercise.grading.publicCases[errorIndex]?.id,
    fact: 'The check stopped with an execution error before it could grade this case.',
    question: 'What does the execution output say happened before the function returned?',
  };
  const failed = failedReturnCases(exercise, submission);
  if (!failed.length) return undefined;
  if (exercise.execution?.language === 'python' && !shown('unused-calculation')) {
    const analysis = await import('../execution/python-dependencies').catch(() => undefined);
    const unused = analysis?.unusedCalculation(submission.source, exercise.execution.entryPoint);
    if (unused) return {
      id: 'unused-calculation', caseId: failed[0].caseId,
      fact: `Your code calculates ${unused}, but its value never contributes to the returned result.`,
      question: exercise.coaching?.unusedCalculationQuestion ?? 'Which part of the requirement was that calculation meant to represent?',
    };
  }
  const example = failed.find(item => !shown('failed-case:' + item.caseId));
  if (!example) return undefined;
  return {
    id: 'failed-case:' + example.caseId, caseId: example.caseId,
    fact: `For ${JSON.stringify(example.inputs)}, your function returned ${example.actual}. The expected result was ${example.expected}.`,
    question: example.kind === 'missing-return' ? 'Which path through your function should return a value to the caller?'
      : 'Work through this case one step at a time. Where does your result first differ from the requirement?',
  };
}

export function correctionsFor(submission: Submission, previous: Submission[]) {
  const recorded = new Set(previous.flatMap(item => item.corrects ?? []));
  const passed = new Set(submission.grade?.evidence.filter(item => item.passed).map(item => item.id));
  return previous.filter(item => item.coaching?.caseId && passed.has(item.coaching.caseId) && !recorded.has(item.id)).map(item => item.id);
}
