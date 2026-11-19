import { hasSolutionHelp } from '../learning/evidence';
import type { LessonEvidence, Submission } from '../learning/evidence';
import type { PracticeObservation } from './recommendation';
import type { GymRecord } from './workout-evidence';
import { f01Concept } from './f01-workout';

const climbExercises = new Set(['F01.01.modify', 'F01.01.build', 'F01.01.make', 'F01.01.make-transfer']);
const makeExercises = new Set(['F01.01.make', 'F01.01.make-transfer']);

function submissionObservation(submission: Submission, source: PracticeObservation['source'],
  independent: boolean, nudged = false): PracticeObservation | undefined {
  const { id, grade, hints, exercise, finishedAt, startedAt } = submission;
  if (grade?.verdict !== 'passed' && grade?.verdict !== 'failed') return;
  const passed = grade.verdict === 'passed';
  const context = source === 'gym' ? 'The Gym' : 'The Climb';
  const assessment = source === 'gym' ? 'Gym workout' : makeExercises.has(exercise.id)
    ? 'Make exercise' : exercise.id === 'F01.01.build' ? 'Build exercise' : 'Modify exercise';
  const help = hasSolutionHelp(hints) ? ' Used implementation or solution help.'
    : hints.length ? ' Used conceptual hints.' : '';
  return {
    id, source, activity: exercise.id, at: finishedAt ?? startedAt, result: passed ? 'pass' : 'miss',
    independent: passed && independent, assisted: hints.length > 0 || nudged,
    description: `${context}: the ${assessment} ${passed ? independent ? 'passed independently' : 'passed' : 'did not pass all public checks'}.${help}${nudged ? ' A conceptual nudge was shown before this check.' : ''}`,
  };
}

export function f01Observations(sessions: LessonEvidence[], records: GymRecord[]): PracticeObservation[] {
  const observations: PracticeObservation[] = [];
  for (const session of sessions) {
    const prediction = session.prediction;
    const run = prediction?.runs.find((entry) => entry.status === 'completed');
    if (prediction && run) {
      const output = run.stdout.trim();
      const correct = Number(prediction.answer) === Number(output);
      const reasoning = prediction.hypothesis === 'addition-first' && prediction.reasoning === 'confirmed'
        ? ' You confirmed adding first on that attempt.' : '';
      observations.push({ id: prediction.id, source: 'climb', activity: 'F01.01.prediction',
        at: prediction.committedAt, result: correct ? 'pass' : 'miss',
        description: `The Climb: predicted ${prediction.answer}, Python printed ${output}.${reasoning}` });
      for (const followUp of session.followUps) {
        observations.push({ id: followUp.id, source: 'climb', activity: 'F01.01.prediction',
          at: followUp.at, result: followUp.correct ? 'pass' : 'miss',
          description: followUp.correct ? 'The Climb: the follow-up prediction matched.'
            : `The Climb: follow-up prediction ${followUp.answer} differed from ${followUp.expected}.` });
      }
    }
    for (const submission of session.submissions) {
      if (!climbExercises.has(submission.exercise.id)) continue;
      const independent = makeExercises.has(submission.exercise.id) && !submission.hints.length && !submission.priorPass;
      const item = submissionObservation(submission, 'climb', independent);
      if (item) observations.push(item);
    }
  }
  for (const record of records) {
    if (record.kind !== 'attempt' || record.conceptId !== f01Concept) continue;
    const item = submissionObservation(record.submission, 'gym', record.independent, !!record.nudgeAttemptIds?.length);
    if (item) observations.push(item);
  }
  return observations;
}
