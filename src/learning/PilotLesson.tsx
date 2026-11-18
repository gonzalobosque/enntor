import { useEffect, useRef, useState } from 'react';
import { predictionCoaching } from '../courses/f01-01';
import { loadPilot } from '../courses/load-pilot';
import type { Exercise, HintLevel } from '../courses/contracts';
import { runExercise } from '../execution/grading';
import { pythonEngine } from '../execution/python-engine';
import { TeachingText, TeachingProseText } from './TeachingText';
import { PredictionReview } from './PredictionReview';
import { Console, ExerciseEditor } from './ExerciseEditor';
import { hasSolutionHelp, learningState, now } from './evidence';
import type { Submission } from './evidence';
import { useEvidence } from './useEvidence';
import { LessonFinish } from './LessonFinish';

const { pack, lesson, prediction, modification, make, transfer } = loadPilot();
export const pilotTitle = lesson.title;
const lessonRef = { id: lesson.id, version: lesson.version };
const stages = ['Learn', 'Predict', 'Investigate', 'Modify', 'Make', 'Finish'];

export function PilotLesson() {
  const evidence = useEvidence(pack, lessonRef);
  return <LessonSession key={evidence.session.id} evidence={evidence} />;
}

function LessonSession({ evidence }: { evidence: ReturnType<typeof useEvidence> }) {
  const { session, history, update, save, error, startAgain } = evidence;
  const state = learningState(session, modification.id, make.id, transfer.id);
  const [answer, setAnswer] = useState(session.prediction?.answer ?? '');
  const showTransfer = !!session.transferOpenedAt;
  const [predicting, setPredicting] = useState(false);
  const active = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [draftFailures, setDraftFailures] = useState<Record<string, boolean>>({});
  const busyCount = Object.values(busy).filter(Boolean).length;
  const draftFailed = Object.values(draftFailures).some(Boolean);
  useEffect(() => () => { active.current?.abort(); }, []);

  useEffect(() => {
    if (!error && !draftFailed) return;
    const keepOpen = (event: Event) => event.preventDefault();
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('enntor:before-route-change', keepOpen);
    window.addEventListener('beforeunload', warn);
    return () => {
      window.removeEventListener('enntor:before-route-change', keepOpen);
      window.removeEventListener('beforeunload', warn);
    };
  }, [error, draftFailed]);

  async function runPrediction() {
    if (active.current || state.prediction || !/^[+-]?\d+$/.test(answer.trim())) return;
    const job = new AbortController();
    active.current = job;
    const answerText = answer.trim();
    update((old) => ({ ...old, prediction: old.prediction ?? {
      id: crypto.randomUUID(), exercise: { id: prediction.id, version: prediction.version },
      answer: answerText, committedAt: now(), runs: [],
    } }));
    setPredicting(true);
    try {
      const result = await runExercise(pythonEngine, prediction, prediction.starterCode!, job.signal);
      update((old) => ({ ...old, prediction: { ...old.prediction!, runs: [...old.prediction!.runs, result],
        hypothesis: result.status === 'completed' && Number(answerText) === predictionCoaching.alternativeAnswer &&
          Number(result.stdout.trim()) !== Number(answerText) ? 'addition-first' : undefined } }));
    } finally {
      active.current = null;
      setPredicting(false);
    }
  }

  function record(attempt: Submission) {
    update((old) => ({ ...old, submissions: attempt.finishedAt
      ? old.submissions.map((item) => item.id === attempt.id ? attempt : item)
      : [...old.submissions, attempt] }));
  }

  function editor(exercise: Exercise, stage: 'Modify' | 'Make') {
    const base = `enntor.draft.${exercise.id}.${exercise.version}`;
    const key = session.legacyDrafts && exercise.id === modification.id ? base : `${base}.${session.id}`;
    const visibleHints = session.hints.filter((hint) => hint.exercise.id === exercise.id).map(({ level }) => level);
    const previous = history.filter(({ id }) => id !== session.id);
    const priorHints = previous.flatMap((item) => item.hints).filter((hint) => hint.exercise.id === exercise.id)
      .map(({ level }) => level);
    const priorPass = previous.some((item) => item.submissions.some((attempt) =>
      attempt.exercise.id === exercise.id && attempt.grade?.verdict === 'passed'));
    return <ExerciseEditor key={exercise.id} {...{ stage, exercise, draftKey: key, priorPass }}
      hints={visibleHints} feedback={stage === 'Modify' ? predictionCoaching.modifyFeedback : undefined}
      onBusy={(value) => setBusy((old) => ({ ...old, [exercise.id]: value }))}
      onDraftFailure={(value) => setDraftFailures((old) => ({ ...old, [exercise.id]: value }))}
      onHint={(level: HintLevel) => update((old) => ({ ...old, hints: [...old.hints,
        { exercise: { id: exercise.id, version: exercise.version }, level, at: now() }] }))}
      onAttempt={(attempt) => record({ ...attempt, hints: [...new Set([...priorHints, ...attempt.hints])] })} />;
  }

  const stage = session.completion ? 6 : state.canFinish ? 5 : state.modified ? 4 : state.investigated ? 3
    : state.prediction ? 2 : session.learnedAt ? 1 : 0;
  const output = state.prediction?.stdout.trim();
  const lastRun = session.prediction?.runs.at(-1);
  const assistance = state.made.some((item) => item.hints.length > 0 || item.priorPass);

  return (
    <article className="pilot">
      <a className="back-link" href="#/climb" onClick={(event) => {
        if (error || draftFailed || predicting || busyCount) event.preventDefault();
      }}>← The Climb</a>
      <p className="eyebrow">Pilot lesson · {lesson.id} · {lesson.estimatedMinutes} min</p>
      <h1>Expressions and <span>evaluation order</span></h1>
      <ol className="pilot-journey" aria-label="Lesson journey">
        {stages.map((label, index) => <li key={label} aria-current={index === stage ? 'step' : undefined}
          data-complete={index < stage}>{label}{index < stage && <span aria-label=" completed"> ✓</span>}</li>)}
      </ol>
      {!error && !draftFailed && !session.completion && history.some(({ id }) => id === session.id) &&
        <p className="muted">Progress saved on this browser.</p>}
      {error && <div className="pilot-feedback" role="alert">
        <p>Local evidence could not be saved or read. Keep this lesson open and retry. Another tab may have changed this session.</p>
        <button onClick={() => save()}>Retry saving</button>
      </div>}
      {!session.completion && <>
        <section className="pilot-section" aria-labelledby="learn-heading">
          <h2 id="learn-heading">Learn · Trace backwards, execute forwards</h2>
          {lesson.teachingBlocks.filter(({ type }) => type !== 'warning').map((block) => <TeachingText key={block.id} block={block} />)}
          {!session.learnedAt && <div className="pilot-controls">
            <button className="pilot-primary" onClick={() => update((old) => ({ ...old, learnedAt: now() }))}>Continue to Predict</button>
          </div>}
        </section>
        {session.learnedAt && <section className="pilot-section" aria-labelledby="predict-heading">
          <h2 id="predict-heading">Predict</h2>
          <p><TeachingProseText content={prediction.prompt} /></p>
          <pre>{prediction.starterCode}</pre>
          <form onSubmit={(event) => { event.preventDefault(); void runPrediction(); }}>
            <label htmlFor="prediction">Your prediction</label>
            <div className="pilot-controls">
              <input id="prediction" value={answer} onChange={(event) => setAnswer(event.target.value)}
                readOnly={!!session.prediction} autoComplete="off" />
              <button className="pilot-primary" disabled={predicting || !!state.prediction || !/^[+-]?\d+$/.test(answer.trim())}>
                {session.prediction ? 'Run prediction' : 'Commit prediction & run'}
              </button>
              {predicting && <button type="button" onClick={() => active.current?.abort()}>Stop</button>}
            </div>
          </form>
          {lastRun && <Console runs={[lastRun]} />}
        </section>}
        {output !== undefined && session.prediction && <PredictionReview answer={session.prediction.answer} output={output}
          warning={lesson.teachingBlocks.find(({ type }) => type === 'warning')}
          reasoning={session.prediction.reasoning}
          onReasoning={(reasoning) => update((old) => ({ ...old, prediction: { ...old.prediction!, reasoning } }))}
          followUpResult={session.followUps.at(-1)}
          onFollowUp={(submitted, correct) => update((old) => ({ ...old, followUps: [...old.followUps,
            { id: crypto.randomUUID(), answer: submitted, correct, expected: predictionCoaching.followUp.expected, at: now() }] }))} />}
        {state.investigated && editor(modification, 'Modify')}
        {state.modified && editor(make, 'Make')}
        {state.modified && assistance && !state.independent && !showTransfer && <div className="pilot-controls">
          <button disabled={!!busyCount} onClick={() => update((old) => ({ ...old, transferOpenedAt: now() }))}>Try a fresh Make problem</button>
        </div>}
        {state.modified && showTransfer && editor(transfer, 'Make')}
      </>}
      <LessonFinish title={lesson.title} session={session}
        onSweat={(sweat) => update((old) => ({ ...old, sweat }))} state={state} blocked={predicting || !!busyCount || draftFailed}
        onFinish={(completion) => update((old) => ({ ...old, completion }), true)}
        onExit={() => { if (save()) window.location.hash = '/climb'; }} onRestart={startAgain} />
      <details className="pilot-section">
        <summary>Learning history ({history.length} {history.length === 1 ? 'session' : 'sessions'})</summary>
        {history.map((item) => <details key={item.id}>
          <summary>{new Date(item.startedAt).toLocaleString()} · {item.completion ? 'Completed' : 'In progress'}</summary>
          {item.prediction && <p>Prediction: {item.prediction.answer}. Follow-up checks: {item.followUps.length}.</p>}
          {item.submissions.map((attempt) => <details key={attempt.id}>
            <summary>{attempt.exercise.id} · {attempt.grade?.verdict ?? 'Interrupted or in progress'} · {new Date(attempt.startedAt).toLocaleTimeString()}</summary>
            <pre>{attempt.source}</pre>
            <p>{hasSolutionHelp(attempt.hints) ? 'Implementation help used.' : attempt.hints.length ? 'Conceptual help used.' : 'No hints recorded.'}</p>
            {attempt.grade?.evidence.map((test) => <p key={test.id}>{test.passed ? 'Passed' : 'Failed'} · {test.message}</p>)}
          </details>)}
        </details>)}
      </details>
    </article>
  );
}
