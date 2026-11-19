import { sweatChoices } from '../learning/evidence';
import type { Sweat } from '../learning/evidence';
import { WorkoutCoaching } from './WorkoutCoaching';
import { describeAttempt, evaluatedAttempts } from './workout-session';
import type { WorkoutAttempt, WorkoutHint, WorkoutSession, WorkoutWarmUp } from './workout-evidence';

export function GymReport({ session, attempts, hints, warmUps, onSweat }: {
  session?: WorkoutSession; attempts: WorkoutAttempt[]; hints: WorkoutHint[];
  warmUps: WorkoutWarmUp[]; onSweat: (sweat: Sweat) => void;
}) {
  const completion = session?.completion;
  if (!completion) return <section className="pilot-section">
    <h2 className="pilot-stage-heading">Workout results</h2>
    <p>No finished workout has been saved yet.</p>
    <a className="pilot-inline-link" href="#/gym">Back to The Gym</a>
  </section>;
  const evaluated = evaluatedAttempts(attempts);
  const result = evaluated.find(({ submission }) => submission.id === completion.evidenceId);
  const passed = evaluated.filter(({ submission }) => submission.grade?.verdict === 'passed').length;
  const independentTransfer = evaluated.some(({ activity, independent }) => activity === 'transfer' && independent);
  const assisted = hints.length > 0 || evaluated.some(({ submission, nudgeAttemptIds }) =>
    submission.hints.length > 0 || nudgeAttemptIds?.length);
  const corrected = new Set(evaluated.flatMap(({ correctedAttemptIds }) => correctedAttemptIds ?? [])).size;
  return <>
    <section className="pilot-section" aria-labelledby="gym-report-heading">
      <h2 className="pilot-stage-heading" id="gym-report-heading">Workout results</h2>
      <p role="status" className={completion.outcome === 'passed' ? 'pilot-success' : undefined}>
        {completion.outcome === 'passed' ? 'Workout finished and saved. The final evaluated check passed.'
          : 'Workout finished and saved. The final evaluated check did not pass.'}
      </p>
      <p>{evaluated.length} evaluated {evaluated.length === 1 ? 'check' : 'checks'}. {passed} passed and {evaluated.length - passed} did not pass.
        {attempts.length > evaluated.length && ` Total submissions, including warm-up and incomplete checks: ${attempts.length}.`}</p>
      {result && <p>{describeAttempt(result)}</p>}
      {independentTransfer && result?.activity !== 'transfer' && <p>A separate transfer check passed independently in this workout.</p>}
      <p>Warm-up: {warmUps.filter(({ decision }) => decision === 'completed').length} completed, {warmUps.filter(({ decision }) => decision === 'skipped').length} skipped.
        {' '}Nudges shown: {attempts.filter(({ coaching }) => coaching?.exposure).length}.
        {' '}Newly revealed hints: {hints.length}{hints.length ? ` (${[...new Set(hints.map(({ level }) => level))].join(', ')})` : ''}.</p>
      {hints.some(({ level }) => level === 'H4') && <p>The warehouse solution was revealed.</p>}
      {corrected > 0 && <p>Later checks addressed the observed issue from {corrected} earlier {corrected === 1 ? 'submission' : 'submissions'}.</p>}
      <p>{completion.outcome === 'not-passed' ? 'Next practice: work through one failing case or revisit the warm-up before trying again.'
        : assisted && !result?.independent ? 'Next practice: try a fresh evaluation-order problem without help when one is available.'
          : 'Next practice: revisit evaluation order in another context. This result covers the examples checked here.'}</p>
    </section>
    {evaluated.some(({ coaching }) => coaching) && <details className="pilot-section">
      <summary>Observations and reasoning</summary>
      {evaluated.filter(({ coaching }) => coaching).map(({ submission, coaching }) => (
        <WorkoutCoaching key={submission.id} coaching={coaching!} />
      ))}
    </details>}
    <section className="pilot-section">
      <fieldset>
        <legend>Did you break a sweat?</legend>
        {sweatChoices.map(([label, value]) => <label key={value}>
          <input type="radio" name="sweat" checked={completion.sweat === value}
            onChange={() => onSweat(value)} /> {label} ({value > 0 ? '+' : ''}{value})
        </label>)}
        <label><input type="radio" name="sweat" checked={completion.sweat === null}
          onChange={() => onSweat(null)} /> Skip for now</label>
      </fieldset>
      <p className="muted" role="status">{completion.sweat === null ? 'Check-in unanswered.' : 'Check-in saved on this browser.'}</p>
    </section>
    <div className="pilot-controls">
      <a className="pilot-link" href="#/gym">Back to The Gym</a>
    </div>
  </>;
}
