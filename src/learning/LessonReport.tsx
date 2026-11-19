import type { ReactNode } from 'react';
import type { LoadedLesson } from '../courses/load-course-pack';
import { lessonPath } from '../app/areas';
import { hasSolutionHelp, sweatChoices } from './evidence';
import type { LessonEvidence, Sweat } from './evidence';

export function LessonReport({ item, session, reports, onReport, storageAlert, onSweat }: {
  item: LoadedLesson; session: LessonEvidence; reports: LessonEvidence[]; onReport: (id: string) => void; storageAlert: ReactNode; onSweat: (sweat: Sweat) => void;
}) {
  const { lesson, make: mainExercise, transfer, sequence } = item;
  const completion = session.completion;
  const prediction = session.prediction;
  const actual = prediction?.runs.find((run) => run.status === 'completed')?.stdout.trim();
  const make = session.submissions.find(({ id }) => id === completion?.makeId);
  const assistedMake = make?.exercise.id === transfer.id && session.submissions.find((attempt) =>
    attempt.exercise.id === mainExercise.id && attempt.grade?.verdict === 'passed' &&
    (attempt.hints.length > 0 || attempt.priorSolutionHelp));
  const failed = session.submissions.filter(({ grade }) => grade?.verdict === 'failed');
  const buildMistakes = session.buildChecks?.filter(({ correct }) => !correct) ?? [];
  const followUpFailures = session.followUps.filter(({ correct }) => !correct);
  const currentNarrative = sequence.legacy || session.lesson.version === lesson.version;
  const hypothesis = currentNarrative ? sequence.predictionCoaching.hypothesis : undefined;
  const reasoning = prediction?.hypothesis === hypothesis?.id ? hypothesis?.report[prediction?.reasoning ?? 'unconfirmed'] : undefined;
  return <article className="pilot">
    <p className="eyebrow">{session.lesson.id} · Learning report</p>
    <h1>{lesson.title}</h1>
    <p className="muted">Lesson edition {session.lesson.version}</p>
    {reports.length > 1 && <label>Saved report <select value={session.id} onChange={(event) => onReport(event.target.value)}>
      {reports.map((report) => <option key={report.id} value={report.id}>
        {new Date(report.completion!.at).toLocaleString()} · edition {report.lesson.version}
      </option>)}
    </select></label>}
    {storageAlert}
    {completion ? <>
      <section className="pilot-section" aria-labelledby="outcomes-heading">
        <h2 id="outcomes-heading">Activity outcomes</h2>
        <p className="pilot-success" role="status">Lesson completed and saved on this browser.</p>
        <ul className="pilot-status">
          {prediction && actual !== undefined && <li>Predicted <code>{prediction.answer}</code>. Python printed <code>{actual}</code>.</li>}
          {session.followUps.length > 0 && <li>Follow-up passed after {session.followUps.length} {session.followUps.length === 1 ? 'check' : 'checks'}.</li>}
          <li>Modify passed.</li>
          <li>{completion.buildId ? 'Build passed.' : 'Build was introduced after this session.'}</li>
          {assistedMake && <li>Original Make passed with help{assistedMake.hints.length ? ` (${assistedMake.hints.join(', ')})` : ''}.</li>}
          <li>{make?.exercise.id === transfer.id ? 'Fresh Make problem passed.' : 'Make passed.'}</li>
        </ul>
        <p><strong>{completion.independent ? make?.exercise.id === transfer.id ? 'Independent skill demonstrated on the transfer problem.' : 'Independent skill demonstrated on this problem.'
          : make?.hints.length ? 'Make passed with help.' : 'Make passed on a previously seen problem.'}</strong></p>
        {make?.hints.length ? <p>Recorded help: {make.hints.join(', ')}. {hasSolutionHelp(make.hints) ? 'Includes implementation help.' : 'Conceptual help.'}</p> : null}
      </section>
      {(prediction?.hypothesis || failed.length > 0 || followUpFailures.length > 0 || buildMistakes.length > 0 ||
        (actual !== undefined && Number(prediction?.answer) !== Number(actual))) && (
        <section className="pilot-section" aria-labelledby="mistakes-heading">
          <h2 id="mistakes-heading">What the work showed</h2>
          {actual !== undefined && Number(prediction?.answer) !== Number(actual) && <p>The initial prediction differed from the output.</p>}
          {reasoning && <p>{reasoning}</p>}
          {!!buildMistakes.length && <p>{currentNarrative && sequence.buildPlan.report} Incorrect Build choices: {buildMistakes.length}.</p>}
          {followUpFailures.map(({ id, answer, expected }) => <p key={id}>Follow-up answer <code>{answer}</code>. Expected <code>{expected}</code>.</p>)}
          {failed.map((attempt) => <details key={attempt.id}>
            <summary>{attempt.exercise.id} · failed public checks</summary>
            {attempt.grade?.evidence.filter(({ passed }) => !passed).map((test) => <p key={test.id}>{test.message}</p>)}
          </details>)}
        </section>
      )}
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
    </> : <p>Finish the lesson to create a learning report.</p>}
    <div className="pilot-controls">
      <a className="pilot-link" href="#/climb">Back to The Climb</a>
      <a className="pilot-link" href={`#/${lessonPath(lesson.id)}`}>{completion ? 'Revisit the lesson' : 'Return to the lesson'}</a>
    </div>
  </article>;
}
