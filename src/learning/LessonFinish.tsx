import { now, sweatChoices } from './evidence';
import type { learningState, LessonEvidence, Sweat } from './evidence';

export function LessonFinish({ title, session, state, blocked, onSweat, onFinish, onExit, onRestart }: {
  title: string; session: LessonEvidence; state: ReturnType<typeof learningState>; blocked: boolean;
  onSweat: (sweat: Sweat) => void;
  onFinish: (completion: NonNullable<LessonEvidence['completion']>) => boolean;
  onExit: () => void; onRestart: () => void;
}) {
  const sweat = session.sweat;
  const actual = state.prediction?.stdout.trim();
  const failed = session.submissions.filter(({ grade }) => grade?.verdict === 'failed').length;
  const completion = session.completion;
  return <section className="pilot-section" aria-labelledby="finish-heading">
    <h2 id="finish-heading">Finish · {session.lesson.id} · {title}</h2>
    <ul className="pilot-status">
      <li>Learning activities {state.activitiesComplete ? 'complete' : 'in progress'}</li>
      <li>{(completion ? completion.independent : state.independent) ? 'Independent skill demonstrated on this pilot problem'
        : 'Independent skill has yet to be demonstrated'}</li>
      <li>{completion ? 'Lesson completed and saved' : 'Lesson in progress'}</li>
    </ul>
    {actual !== undefined && <p>Prediction <code>{session.prediction?.answer}</code>. Python printed <code>{actual}</code>.
      {session.followUps.length > 0 && (state.investigated ? ' Follow-up passed.' : ' Follow-up needs another try.')}</p>}
    {session.prediction?.hypothesis && <p>{session.prediction.reasoning === 'confirmed'
      ? 'Learner confirmed adding first.' : session.prediction.reasoning === 'rejected'
        ? 'Learner rejected the addition-first hypothesis.' : 'Adding first was suggested as an unconfirmed possibility.'}</p>}
    <p>Modify {state.modified ? 'passed' : 'pending'}. Make {state.made.length ? 'passed the public checks' : 'pending'}.
      {failed > 0 && ` ${failed} checked submission${failed === 1 ? '' : 's'} failed public cases.`}</p>
    {!state.canFinish && <p>{state.made.length
      ? 'The passing solution used implementation help. Try the fresh Make problem to qualify.'
      : 'Complete the prediction review and pass both Modify and Make to finish.'}</p>}
    {state.canFinish && !completion && <fieldset>
      <legend>Did you break a sweat?</legend>
      {sweatChoices.map(([label, value]) => <label key={value}>
        <input type="radio" name="sweat" checked={sweat === value}
          onChange={() => onSweat(value)} /> {label} ({value > 0 ? '+' : ''}{value})
      </label>)}
      <label><input type="radio" name="sweat" checked={sweat === null}
        onChange={() => onSweat(null)} /> Skip for now</label>
    </fieldset>}
    {completion && <p className="pilot-success" role="status">Lesson saved. Check-in {completion.sweat === null ? 'unanswered'
      : sweatChoices.find(([, value]) => value === completion.sweat)?.[0]}</p>}
    <div className="pilot-controls">
      {!completion && state.canFinish && <button className="pilot-primary" disabled={blocked} onClick={() => onFinish({
        at: now(), sweat: sweat ?? null, modifyId: state.modified!.id, makeId: state.qualifying!.id, independent: !!state.independent,
      })}>Finish &amp; save lesson</button>}
      <button disabled={blocked} onClick={onExit}>{completion ? 'Back to The Climb' : 'Save & Exit'}</button>
      {completion && <button onClick={onRestart}>Start another lesson session</button>}
    </div>
  </section>;
}
