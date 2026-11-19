import { useRef, useState } from 'react';
import { gymResultsPath, gymWorkoutPath } from '../app/areas';
import type { Exercise } from '../courses/contracts';
import { Console, ExerciseEditor } from '../learning/ExerciseEditor';
import { hasSolutionHelp, now, sweatChoices } from '../learning/evidence';
import type { Submission } from '../learning/evidence';
import { cargoWorkout, evaluationWarmUp, f01Concept, postcardTransfer, visitorWarmUp } from './f01-workout';
import { diagnoseCargo } from './cargo-diagnostic';
import { WarmUp, warmUpFormat } from './WarmUp';
import { WorkoutCoaching } from './WorkoutCoaching';
import { GymReport } from './GymReport';
import { recommendPractice } from './recommendation';
import { useWorkoutEvidence, useWorkoutExitGuard } from './useWorkoutEvidence';
import { mergeGymRecord } from './workout-evidence';
import type { WorkoutAttempt, WorkoutHint, WorkoutSession, WorkoutWarmUp } from './workout-evidence';
import { describeAttempt, evaluatedAttempts, finishWorkout, rateWorkout } from './workout-session';

const exerciseRef = (exercise: Exercise) => ({ id: exercise.id, version: exercise.version });
const base = { schemaVersion: 1, origin: 'gym', conceptId: f01Concept } as const;
const explanation = {
  insufficient: 'There isn’t enough saved practice to personalize this recommendation. Try the workout for optional reinforcement.',
  reinforce: 'Try the same concept in a different setting for optional reinforcement.',
  'repeated-errors': 'Several saved checks missed the expected result. Try another evaluation-order problem and compare one small case at a time.',
  'try-unaided': 'A recent pass included help. Practice with a fresh problem if you want to check what you can do unaided.',
  'independent-practice': 'You passed a Gym problem independently. Revisit evaluation order for reinforcement whenever you like.',
} as const;

function ordered(attempts: WorkoutAttempt[]) {
  return attempts.sort((a, b) => a.submission.startedAt.localeCompare(b.submission.startedAt));
}

export function Gym({ view }: { view: 'home' | 'workout' | 'results' }) {
  const data = useWorkoutEvidence();
  const recommendation = recommendPractice(data.observations);
  const [selectedReport, setSelectedReport] = useState('');
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [draftFailures, setDraftFailures] = useState<Record<string, boolean>>({});
  const [currentCheck, setCurrentCheck] = useState<string | null>();
  const finishing = useRef<string>(undefined);
  const records = data.pending.reduce(mergeGymRecord, data.records);
  // Completion and session links use durable records only.
  const sessions = data.records.filter((r): r is WorkoutSession => r.kind === 'session' && r.conceptId === f01Concept)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const latestCompleted = sessions.find(({ completion }) => completion);
  const session = sessions[0];
  const reportSession = view === 'results'
    ? sessions.find((item) => item.id === selectedReport && item.completion) ?? latestCompleted : session;
  const relevant = records.filter((record) => reportSession && record.sessionId === reportSession.id);
  const allAttempts = ordered(records.filter((record): record is WorkoutAttempt => record.kind === 'attempt' && record.conceptId === f01Concept));
  const attempts = ordered(relevant.filter((record): record is WorkoutAttempt => record.kind === 'attempt'));
  const warmUps = relevant.filter((record): record is WorkoutWarmUp => record.kind === 'warm-up')
    .sort((a, b) => a.at.localeCompare(b.at));
  const hints = relevant.filter((record): record is WorkoutHint => record.kind === 'hint');
  const warmUp = warmUps.at(-1);
  const isBusy = Object.values(busy).some(Boolean);
  const blocked = isBusy || Object.values(draftFailures).some(Boolean) || data.pending.length > 0;
  useWorkoutExitGuard(blocked);

  function start() {
    if (blocked || window.location.hash === '#/' + gymWorkoutPath || (session && !session.completion)) return;
    setCurrentCheck(null);
    const next: WorkoutSession = { ...base, exercise: exerciseRef(cargoWorkout), kind: 'session',
      id: crypto.randomUUID(), startedAt: now(), legacyDraft: sessions.length === 0 };
    if (data.write(next)) window.location.hash = '/' + gymWorkoutPath;
  }

  function finish() {
    if (!session || finishing.current === session.id || blocked) return;
    const finished = finishWorkout(session, attempts);
    if (finished === session) return;
    finishing.current = session.id;
    setSelectedReport(finished.id);
    if (data.write(finished)) window.location.hash = '/' + gymResultsPath;
  }

  function recordWarmUp(decision: WorkoutWarmUp['decision']) {
    if (!session || blocked) return;
    const open = warmUp?.decision === 'opened' ? warmUp : undefined;
    data.write({ ...base, exercise: exerciseRef(cargoWorkout), kind: 'warm-up', sessionId: session.id,
      warmUpId: evaluationWarmUp.id, id: open?.id ?? crypto.randomUUID(), decision,
      opened: decision === 'opened' || !!open, at: now() });
  }

  function seenBefore(exercise: Exercise) {
    return records.some((record) => record.sessionId !== session?.id &&
      record.exercise.id === exercise.id && record.exercise.version === exercise.version &&
      (record.kind === 'attempt' || (record.kind === 'hint' && hasSolutionHelp([record.level]))));
  }

  function editor(exercise: Exercise, activity: 'warm-up' | 'practice' | 'transfer', round?: string) {
    if (!session || session.completion) return null;
    const exerciseRecord = { ...base, exercise: exerciseRef(exercise), sessionId: session.id };
    const matching = (record: { exercise: { id: string; version: string } }) =>
      record.exercise.id === exercise.id && record.exercise.version === exercise.version;
    const previous = attempts.filter(matching);
    const levels = [...new Set(hints.filter(matching).map(({ level }) => level))];
    const seenInEarlierWorkout = seenBefore(exercise);
    const previouslyNudged = previous.filter(({ coaching }) => coaching?.exposure).map(({ submission }) => submission.id);
    const priorPass = previous.some(({ submission }) => submission.grade?.verdict === 'passed');
    const storageKey = 'enntor.draft.' + exercise.id + '.' + exercise.version;
    const key = activity === 'practice' && session.legacyDraft ? storageKey : `${storageKey}.${round ?? session.id}`;
    const slot = round ?? exercise.id;

    return <ExerciseEditor key={key} stage={activity === 'warm-up' ? 'Modify' : 'Practice'} exercise={exercise}
      draftKey={key} hints={levels} priorPass={priorPass}
      onBusy={(value) => setBusy((old) => ({ ...old, [slot]: value }))}
      onDraftFailure={(value) => setDraftFailures((old) => ({ ...old, [slot]: value }))}
      onEdit={() => { if (activity !== 'warm-up') setCurrentCheck(null); }}
      onHint={(level) => data.write({ ...exerciseRecord, kind: 'hint', id: crypto.randomUUID(), level, at: now() })}
      onAttempt={(submission: Submission) => {
        if (activity !== 'warm-up') setCurrentCheck(submission.id);
        const diagnostic = diagnoseCargo(exercise, submission, previous.map((attempt) => attempt.submission));
        const alreadyShown = previous.some((attempt) => attempt.coaching?.exposure?.id === diagnostic?.nudge.id);
        const checkedCases = new Set(submission.grade?.evidence.filter(({ passed }) => passed).map(({ id }) => id));
        const correctedBefore = new Set(previous.flatMap((attempt) => attempt.correctedAttemptIds ?? []));
        const corrected = previous.filter(({ coaching, submission: earlier }) => coaching &&
          !correctedBefore.has(earlier.id) && (('exception' in coaching.observation && submission.grade?.verdict && submission.grade.verdict !== 'ungraded') ||
            (!!coaching.observation.caseId && checkedCases.has(coaching.observation.caseId))));
        data.write({ ...exerciseRecord, kind: 'attempt', activity, submission, warmUpRecordId: round ?? warmUp?.id,
          recommendation: { reason: recommendation.reason, evidenceIds: recommendation.evidence.map(({ id }) => id) },
          nudgeAttemptIds: previouslyNudged, correctedAttemptIds: corrected.map(({ submission: earlier }) => earlier.id),
          coaching: diagnostic && { observation: diagnostic.observation, hypothesis: diagnostic.hypothesis,
            exposure: activity !== 'warm-up' && !alreadyShown ? { ...diagnostic.nudge, shownAt: now() } : undefined },
          seenInEarlierWorkout,
          independent: activity !== 'warm-up' && !data.unreadable && submission.grade?.verdict === 'passed' &&
            !submission.hints.length && !previouslyNudged.length && !submission.priorPass && !seenInEarlierWorkout,
        });
      }} />;
  }

  const shown = currentCheck === undefined ? attempts.filter(({ activity }) => activity !== 'warm-up').at(-1)
    : attempts.find(({ submission }) => submission.id === currentCheck);
  const showTransfer = hints.some(({ exercise, level }) =>
    exercise.id === cargoWorkout.id && exercise.version === cargoWorkout.version && level === 'H4');
  const difficulty = sweatChoices.find(([, value]) => value === data.rating)?.[0];

  return <article className="pilot gym">
    <a className="back-link" href={view === 'home' ? '#/' : '#/gym'}>{view === 'home' ? '← Back to home' : '← The Gym'}</a>
    <h1>The Gym</h1>
    {data.conflict && <div className="pilot-feedback" role="alert">
      <p>Another tab changed this workout. Your update was not saved. The saved version is now shown. Submitted checks are kept in workout history. Use one editing tab per workout.</p>
      <button onClick={data.dismissConflict}>Dismiss</button>
    </div>}
    {(data.unreadable || data.pending.length > 0) && <div className="pilot-feedback" role="alert">
      <p>{data.pending.length ? 'Gym progress could not be saved. Keep this page open and retry.' : 'Some learning history could not be read from this browser.'}</p>
      <button onClick={data.retry}>{data.pending.length ? 'Retry saving' : 'Retry loading history'}</button>
    </div>}

    {view === 'results' && sessions.filter(({ completion }) => completion).length > 1 &&
      <label>Saved workout <select value={reportSession?.id ?? ''} onChange={(event) => setSelectedReport(event.target.value)}>
        {sessions.filter(({ completion }) => completion).map((item) => <option value={item.id} key={item.id}>
          {new Date(item.completion!.at).toLocaleString()} · {item.completion!.outcome === 'passed' ? 'passed' : 'did not pass'}
        </option>)}
      </select></label>}
    {view === 'results' && <GymReport session={reportSession}
      attempts={attempts.filter(({ submission }) => reportSession?.completion?.attemptIds.includes(submission.id))}
      hints={hints} warmUps={warmUps} onSweat={(sweat) => {
        if (reportSession && !data.pending.length) data.write(rateWorkout(reportSession, sweat));
      }} />}

    {view === 'home' && <section className="pilot-section" aria-labelledby="gym-recommendation">
      <h2 className="pilot-stage-heading" id="gym-recommendation">Evaluation order</h2>
      <p role="status">{data.unreadable ? 'Saved learning history is unavailable. You can try this workout for reinforcement.'
        : explanation[recommendation.reason]}</p>
      {recommendation.evidence.length > 0 && <details>
        <summary>Why this workout?</summary>
        <ul>{recommendation.evidence.map(({ id, description }) => <li key={id}>{description}</li>)}</ul>
        {difficulty && <p>Most recent lesson check-in with a rating: {difficulty}.</p>}
      </details>}
      <div className="pilot-controls">
        {session && !session.completion ? <a className="pilot-link" href={`#/${gymWorkoutPath}`}>Resume workout</a>
          : <button className="pilot-primary" disabled={blocked} onClick={start}>Start workout</button>}
      </div>
      {latestCompleted?.completion && <p>Latest finished workout: {latestCompleted.completion.outcome === 'passed' ? 'passed' : 'did not pass'}.
        {' '}<a className="pilot-inline-link" href={`#/${gymResultsPath}`} onClick={() => setSelectedReport(latestCompleted.id)}>View results</a></p>}
    </section>}

    {view === 'workout' && (!session || session.completion) && <section className="pilot-section">
      <h2 className="pilot-stage-heading">Workout</h2>
      <p>{session?.completion ? 'This workout was finished and saved.' : 'Start a workout from The Gym.'}</p>
      {session?.completion && <a className="pilot-inline-link" href={`#/${gymResultsPath}`} onClick={() => setSelectedReport(session.id)}>View results</a>}
    </section>}

    {view === 'workout' && session && !session.completion && <>
      <WarmUp content={evaluationWarmUp} reason={recommendation.reason} format={warmUpFormat('make')}
        opened={warmUp?.decision === 'opened'} busy={blocked} revisiting={warmUps.some(({ decision }) => decision !== 'opened')}
        passed={attempts.some(({ activity, submission, warmUpRecordId }) => activity === 'warm-up' &&
          warmUpRecordId === warmUp?.id && submission.grade?.verdict === 'passed')}
        onOpen={() => recordWarmUp('opened')} onFinish={recordWarmUp}>
        {warmUp?.decision === 'opened' && editor(visitorWarmUp, 'warm-up', warmUp.id)}
      </WarmUp>
      {warmUps.some(({ decision }) => decision !== 'opened') && editor(cargoWorkout, 'practice')}
      {showTransfer && warmUps.some(({ decision }) => decision !== 'opened') && <>
        <p className="pilot-feedback">The warehouse solution was revealed in this workout. {seenBefore(postcardTransfer)
          ? 'Use the postcard problem for practice. You have seen it before.'
          : 'An unaided pass on the postcard problem can provide independent evidence.'}</p>
        {editor(postcardTransfer, 'transfer')}
      </>}
      {!isBusy && shown?.submission.finishedAt && <section className="pilot-section" aria-labelledby="gym-result">
        <h2 id="gym-result">{currentCheck === undefined ? 'Last saved check' : 'Current check'}</h2>
        <p role="status">{describeAttempt(shown)} {data.pending.some((item) => item.kind === 'attempt' && item.submission.id === shown.submission.id)
          ? 'This result is waiting to be saved.' : 'Result saved in this browser.'}</p>
        {shown.coaching?.exposure && <WorkoutCoaching coaching={shown.coaching} onRespond={(answer) => {
          if (shown.coaching?.response?.answer === answer) return;
          data.write({ ...shown, coaching: { ...shown.coaching!, response: { answer, at: now() } } });
        }} />}
        {!!shown.correctedAttemptIds?.length && <p>This check addressed an issue observed in earlier work.</p>}
      </section>}
      <div className="pilot-controls">
        <button disabled={blocked} onClick={() => { window.location.hash = '/gym'; }}>Save for later</button>
        {evaluatedAttempts(attempts).length > 0 && <button className="pilot-primary" disabled={blocked} onClick={finish}>Finish workout</button>}
      </div>
    </>}

    {view !== 'results' && allAttempts.length > 0 && <details className="pilot-section">
      <summary>Workout history ({allAttempts.length})</summary>
      {[...allAttempts].reverse().map((attempt) => <details key={attempt.submission.id}>
        <summary>{new Date(attempt.submission.startedAt).toLocaleString()} · {describeAttempt(attempt)}</summary>
        <pre>{attempt.submission.source}</pre>
        {attempt.coaching && <WorkoutCoaching coaching={attempt.coaching} />}
        {attempt.submission.runs?.some((run) => run.error) && <Console runs={attempt.submission.runs} />}
        {attempt.submission.grade?.evidence.map((test) => <p key={test.id}>{test.passed ? 'Passed' : 'Failed'} · {test.message}</p>)}
      </details>)}
    </details>}
  </article>;
}
