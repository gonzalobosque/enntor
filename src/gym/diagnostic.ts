import type { Exercise } from '../courses/contracts';
import type { Submission } from '../learning/evidence';

export interface DiagnosticObservation {
  kind: 'unexpected-result' | 'negative-for-positive';
  caseId: string;
  inputs: number[];
  actual: number | string;
  expected: number;
}

export interface Diagnostic {
  observation: DiagnosticObservation;
  hypothesis?: { id: string; question: string };
  nudge: { id: string; question: string };
}

/** A diagnostic reads graded evidence and proposes coaching without changing the grade. */
export type WorkoutDiagnostic = (exercise: Exercise, submission: Submission) => Diagnostic | undefined;
