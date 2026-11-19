import { useRef, useState } from 'react';
import { Console, ExerciseEditor } from '../learning/ExerciseEditor';
import { hasSolutionHelp, now, sweatChoices } from '../learning/evidence';
import type { Submission } from '../learning/evidence';
import { cargoWorkout, evaluationWarmUp, f01Concept } from './f01-workout';
import { diagnoseCargo } from './cargo-diagnostic';
import { WarmUp } from './WarmUp';
import { WorkoutCoaching } from './WorkoutCoaching';
import { recommendPractice } from './recommendation';
import { useWorkoutEvidence, useWorkoutExitGuard } from './useWorkoutEvidence';
import { mergeGymRecord } from './workout-evidence';
import type { WorkoutAttempt, WorkoutWarmUp } from './workout-evidence';

const exerciseRef = { id: cargoWorkout.id, version: cargoWorkout.version };
const recordBase = { schemaVersion: 1, origin: 'gym', conceptId: f01Concept, exercise: exerciseRef } as const;

const explanation = {
  insufficient: 'There isn’t enough saved practice to personalize this recommendation. Try the workout for optional reinforcement.',
  reinforce: 'The available results suggest optional reinforcement. Try the same concept in a different setting.',
  'repeated-errors': 'There are at least two recent misses on the same activity without a later pass on that activity. This workout offers another way to practice evaluation order.',
  'try-unaided': 'A recent pass included help. Try applying evaluation order in this workout without opening a hint if you want to check what you can do unaided.',
  'independent-practice': 'You passed this workout independently. Revisit it for reinforcement whenever you like.',
} as const;

export function Gym() {
  const data = useWorkoutEvidence();
  const [warmUpOpened, setWarmUpOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draftFailure, setDraftFailure] = useState(false);
  const attemptContext = useRef<WorkoutAttempt['recommendation'] | null>(null);
  const recommendation = recommendPractice(data.observations);
  const currentRecords = data.pending.reduce(mergeGymRecord, data.records);
  const workoutRecords = currentRecords.filter(({ exercise }) =>
    exercise.id === exerciseRef.id && exercise.version === exerciseRef.version);
  const hints = workoutRecords.flatMap((record) => record.kind === 'hint' ? [record.level] : []);
  const attempts = workoutRecords.flatMap((record) => record.kind === 'attempt' ? [record] : [])
    .sort((a, b) => b.submission.startedAt.localeCompare(a.submission.startedAt));
  const warmUp = workoutRecords.find((record): record is WorkoutWarmUp => record.kind === 'warm-up' && record.warmUpId === evaluationWarmUp.id);
  const priorPass = attempts.some(({ submission }) => submission.grade?.verdict === 'passed');
  const latest = attempts[0];
  const latestUnsaved = latest && data.pending.some((record) => record.kind === 'attempt' &&
    record.submission.id === latest.submission.id);
  const difficulty = sweatChoices.find(([, value]) => value === data.rating)?.[0];
  useWorkoutExitGuard(busy || draftFailure || data.pending.length > 0);

  function recordAttempt(submission: Submission) {
    const previous = attempts.filter((attempt) => attempt.submission.id !== submission.id);
    const nudgeAttemptIds = previous.filter(({ coaching }) => coaching?.exposure)
      .map((attempt) => attempt.submission.id);
    if (!submission.finishedAt) {
      attemptContext.current = { reason: recommendation.reason, evidenceIds: recommendation.evidence.map(({ id }) => id) };
    }
    const diagnostic = diagnoseCargo(cargoWorkout, submission);
    const show = diagnostic && !previous.some(({ coaching }) => coaching?.exposure?.id === diagnostic.nudge.id);
    const alreadyCorrected = new Set(previous.flatMap((attempt) => attempt.correctedAttemptIds ?? []));
    const correctedAttemptIds = previous.flatMap(({ coaching, submission: earlier }) => {
      if (!coaching || !submission.grade?.evidence.some(({ id, passed }) => id === coaching.observation.caseId && passed) ||
          alreadyCorrected.has(earlier.id)) return [];
      return [earlier.id];
    });
    data.write({ ...recordBase, kind: 'attempt', submission,
      warmUpRecordId: warmUp?.id, nudgeAttemptIds, correctedAttemptIds,
      coaching: diagnostic && { observation: diagnostic.observation, hypothesis: diagnostic.hypothesis,
        exposure: show ? { ...diagnostic.nudge, shownAt: now() } : undefined },
      recommendation: attemptContext.current ?? { reason: 'insufficient', evidenceIds: [] },
      independent: !data.unreadable && submission.grade?.verdict === 'passed' &&
        submission.hints.length === 0 && nudgeAttemptIds.length === 0 && !submission.priorPass,
    });
  }

  return (
    <article className="pilot gym">
      <a className="back-link" href="#/">← Back to home</a>
      <h1>The Gym</h1>
      <section className="pilot-section" aria-labelledby="gym-recommendation">
        <h2 className="pilot-stage-heading" id="gym-recommendation">Evaluation order</h2>
        <p role="status">{data.unreadable ? 'Saved learning history is unavailable. You can try this workout for reinforcement.'
          : recommendation.reason === 'try-unaided' && recommendation.evidence[0]?.source === 'gym'
            ? 'You passed this workout with help. You can repeat it for reinforcement.'
            : explanation[recommendation.reason]}</p>
        {recommendation.evidence.length > 0 && <details>
          <summary>Why this workout?</summary>
          <ul>{recommendation.evidence.map((item) => (
            <li key={item.id}>{item.description} <span className="muted">({new Date(item.at).toLocaleDateString()})</span></li>
          ))}</ul>
          {difficulty && <p>Most recent lesson check-in with a rating: {difficulty}.</p>}
        </details>}
      </section>
      {(data.unreadable || data.pending.length > 0) && (
        <div className="pilot-feedback" role="alert">
          <p>{data.pending.length > 0 ? 'Gym progress could not be saved. Keep this page open and retry.'
            : 'Some learning history could not be read from this browser.'}</p>
          <button onClick={data.retry}>{data.pending.length > 0 ? 'Retry saving' : 'Retry loading history'}</button>
        </div>
      )}
      {!warmUp && <WarmUp content={evaluationWarmUp} reason={recommendation.reason} opened={warmUpOpened}
        onOpen={() => setWarmUpOpened(true)} onFinish={(decision) =>
          data.write({ ...recordBase, kind: 'warm-up', id: crypto.randomUUID(), warmUpId: evaluationWarmUp.id,
            decision, opened: warmUpOpened, at: now() })} />}
      {warmUp && <ExerciseEditor stage="Practice" exercise={cargoWorkout} draftKey="enntor.draft.gym.F01.01.cargo.1.0.0"
        hints={hints} priorPass={priorPass}
        onHint={(level) => data.write({ ...recordBase, kind: 'hint', id: crypto.randomUUID(), level, at: now() })}
        onAttempt={recordAttempt} onBusy={setBusy} onDraftFailure={setDraftFailure} />}
      {!busy && latest?.submission.finishedAt && <section className="pilot-section" aria-labelledby="gym-result">
        <h2 id="gym-result">Latest workout result</h2>
        <p role="status">{describeAttempt(latest)} {latestUnsaved ? 'This result is waiting to be saved.'
          : 'Result saved in this browser.'}</p>
        {latest.coaching?.exposure && <WorkoutCoaching coaching={latest.coaching} onRespond={(answer) => {
          if (latest.coaching?.response?.answer === answer) return;
          data.write({ ...latest, coaching: { ...latest.coaching!, response: { answer, at: now() } } });
        }} />}
        {!!latest.correctedAttemptIds?.length && <p>One or more previously missed cases now pass.</p>}
      </section>}
      {attempts.length > 0 && <details className="pilot-section">
        <summary>Workout history ({attempts.length})</summary>
        {attempts.map((attempt) => (
          <details key={attempt.submission.id}>
            <summary>{new Date(attempt.submission.startedAt).toLocaleString()} · {describeAttempt(attempt)}</summary>
            <pre>{attempt.submission.source}</pre>
            {attempt.coaching && <WorkoutCoaching coaching={attempt.coaching} />}
            {!!attempt.nudgeAttemptIds?.length && <p>Conceptual coaching was shown before this check.</p>}
            {attempt.submission.runs?.some((run) => run.error) && <Console runs={attempt.submission.runs} />}
            {attempt.submission.grade?.evidence.map((test) =>
              <p key={test.id}>{test.passed ? 'Passed' : 'Failed'} · {test.message}</p>)}
          </details>
        ))}
      </details>}
    </article>
  );
}

function describeAttempt({ submission, independent, nudgeAttemptIds }: WorkoutAttempt) {
  if (submission.grade?.verdict === 'failed') return 'Some public checks failed. Review the inputs and try again.';
  if (submission.grade?.verdict === 'passed') {
    if (independent) return 'Passed independently on this workout.';
    if (nudgeAttemptIds?.length) return submission.hints.length
      ? 'Passed after conceptual coaching and requested hints.' : 'Passed after conceptual coaching.';
    if (submission.hints.length) return hasSolutionHelp(submission.hints)
      ? 'Passed with implementation or solution help.' : 'Passed with conceptual hints.';
    if (submission.priorPass) return 'Passed again without hints.';
    return 'Passed the public checks.';
  }
  return 'No completed grade for this attempt.';
}
