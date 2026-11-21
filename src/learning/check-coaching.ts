import type { Exercise } from '../courses/contracts';
import { sameCaseValue } from '../execution/grading';
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
  for (const [index, test] of exercise.grading.publicCases.entries()) {
    const id = 'state-case:' + test.id;
    const run = submission.runs?.[index];
    if (test.expectedArguments === undefined || run?.status !== 'completed' || shown(id) ||
        !submission.grade?.evidence.some(item => item.id === test.id && !item.passed)) continue;
    if (!sameCaseValue(run.argumentsAfter, test.expectedArguments)) {
      const preserve = sameCaseValue(test.input, test.expectedArguments);
      return {
        id, caseId: test.id,
        fact: `For ${JSON.stringify(test.input)}, the caller's inputs ended as ${JSON.stringify(run.argumentsAfter)}. The required state was ${JSON.stringify(test.expectedArguments)}.`,
        question: preserve ? 'Which objects does your function change? Does the caller still share a reference to one of them?'
          : 'Which change should the caller be able to see after the function runs? Follow the reference to the object your code actually changes.',
      };
    }
    return {
      id, caseId: test.id,
      fact: `For ${JSON.stringify(test.input)}, the input state matches, but the function returned ${JSON.stringify(run.value)}. The expected return was ${JSON.stringify(test.expected)}.`,
      question: 'At which point is the reported value supposed to be recorded? Trace this case up to that point.',
    };
  }
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
