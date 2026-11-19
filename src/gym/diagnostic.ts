import type { Exercise } from '../courses/contracts';
import type { Submission } from '../learning/evidence';

export interface ResultObservation {
  kind: 'unexpected-result' | 'negative-for-positive' | 'grouping' | 'edge-case' | 'missing-return';
  caseId: string;
  inputs: number[];
  actual: number | string;
  expected: number;
}

export interface ExecutionObservation {
  kind: 'syntax-error' | 'indentation-error' | 'runtime-exception';
  caseId?: string;
  exception: string;
}

export type DiagnosticObservation = ResultObservation | ExecutionObservation;

export interface Diagnostic {
  observation: DiagnosticObservation;
  hypothesis?: { id: string; question: string };
  nudge: { id: string; question: string };
}

/** Diagnostics read checked evidence and propose coaching independently of grading. */
export type WorkoutDiagnostic = (exercise: Exercise, submission: Submission, previous?: Submission[]) => Diagnostic | undefined;

export function diagnoseExecution(exercise: Exercise, submission: Submission): Diagnostic | undefined {
  const index = submission.runs?.findIndex(({ status }) => status === 'error') ?? -1;
  const message = submission.runs?.[index]?.error?.message;
  if (!message) return undefined;
  const type = message.split('\n').map((line) => /^([A-Za-z]+(?:Error|Exception))(?::|$)/.exec(line)?.[1])
    .filter(Boolean).at(-1);
  if (!type) return undefined;
  const caseId = exercise.grading.publicCases[index]?.id;
  if (type === 'IndentationError' || type === 'TabError') return {
    observation: { kind: 'indentation-error', exception: type, caseId },
    nudge: { id: 'trace-indent', question: 'Which lines belong inside the function body? Check whether those lines start at the same indentation.' },
  };
  if (type === 'SyntaxError') return {
    observation: { kind: 'syntax-error', exception: type, caseId },
    nudge: { id: 'read-syntax', question: 'Look at the line Python highlights and the line above it. Is a bracket, colon, or part of the expression missing?' },
  };
  return {
    observation: { kind: 'runtime-exception', exception: type, caseId },
    nudge: { id: 'trace-exception', question: 'Trace the failing case up to the line Python highlights. What value or name did that line need at that point?' },
  };
}
