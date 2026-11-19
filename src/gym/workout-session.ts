import { now } from '../learning/evidence';
import type { Sweat } from '../learning/evidence';
import type { WorkoutAttempt, WorkoutSession } from './workout-evidence';

export function evaluatedAttempts(attempts: WorkoutAttempt[]) {
  return attempts.filter(({ activity, submission, coaching }) =>
    activity !== 'warm-up' && submission.finishedAt &&
    (submission.grade?.verdict === 'passed' || submission.grade?.verdict === 'failed' ||
      (coaching && 'exception' in coaching.observation)));
}

export function finishWorkout(session: WorkoutSession, attempts: WorkoutAttempt[]): WorkoutSession {
  if (session.completion) return session;
  const current = attempts.filter(({ sessionId }) => sessionId === session.id);
  const latest = evaluatedAttempts(current).at(-1);
  if (!latest) return session;
  return { ...session, completion: {
    at: now(), attemptIds: current.map(({ submission }) => submission.id),
    outcome: latest.submission.grade?.verdict === 'passed' ? 'passed' : 'not-passed',
    evidenceId: latest.submission.id, sweat: null,
  } };
}

export function rateWorkout(session: WorkoutSession, sweat: Sweat): WorkoutSession {
  if (!session.completion || session.completion.sweat === sweat) return session;
  return { ...session, completion: { ...session.completion, sweat } };
}

export function describeAttempt({ submission, independent, nudgeAttemptIds, activity }: WorkoutAttempt) {
  if (submission.grade?.verdict === 'failed') return 'Some public checks failed.';
  if (submission.grade?.verdict === 'passed') {
    if (activity === 'warm-up') return 'Warm-up checks passed.';
    if (independent) return activity === 'transfer' ? 'Passed the transfer independently.' : 'Passed independently on this workout.';
    if (submission.hints.includes('H4')) return 'Passed after seeing the full solution.';
    if (submission.hints.includes('H3')) return 'Passed with implementation help.';
    if (nudgeAttemptIds?.length) return submission.hints.length
      ? 'Passed after conceptual coaching and requested hints.' : 'Passed after conceptual coaching.';
    if (submission.hints.length) return 'Passed with requested hints.';
    if (submission.priorPass) return 'Passed again without hints.';
    return 'Passed the public checks.';
  }
  if (submission.runs?.some(({ status }) => status === 'error')) return 'Python could not complete the check.';
  return 'No completed grade for this attempt.';
}
