import { useEffect, useRef, useState } from 'react';
import type { LoadedLesson } from '../courses/load-course-pack';
import type { Exercise, HintLevel } from '../courses/contracts';
import { runExercise } from '../execution/grading';
import { pythonEngine } from '../execution/python-engine';
import { TeachingText, TeachingProseText } from './TeachingText';
import { PredictionReview } from './PredictionReview';
import { Console, ExerciseEditor } from './ExerciseEditor';
import { finalizeEvidence, hasSolutionHelp, learningState, now, withSweatRating } from './evidence';
import type { Submission } from './evidence';
import { useEvidence } from './useEvidence';
import { LessonReport } from './LessonReport';
import { lessonPath } from '../app/areas';
const stages = ['Learn', 'Predict', 'Investigate', 'Modify', 'Build', 'Make', 'Finish'];

export function ClimbLesson({ item, results }: { item: LoadedLesson; results: boolean }) {
  const { pack, lesson, sequence } = item;
  const evidence = useEvidence(pack, { id: lesson.id, version: lesson.version }, !!sequence.legacy);
  return <LessonSession key={evidence.session.id} evidence={evidence} item={item} results={results} />;
}

function LessonSession({ evidence, item, results }: { evidence: ReturnType<typeof useEvidence>; item: LoadedLesson; results: boolean }) {
  const { lesson, sequence, prediction, modification, build, make, transfer } = item;
  const { buildPlan, predictionCoaching, legacy } = sequence;
  const resultsPath = lessonPath(lesson.id, true);
  const { session, history, update, save, error, startAgain } = evidence;
  const state = learningState(session, modification.id, make.id, transfer.id, build.id, !legacy);
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
        hypothesis: result.status === 'completed' && Number(answerText) === predictionCoaching.hypothesis?.answer &&
          Number(result.stdout.trim()) !== Number(answerText) ? predictionCoaching.hypothesis?.id : undefined } }));
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

  function editor(exercise: Exercise, stage: 'Modify' | 'Build' | 'Make') {
    const legacyDraft = legacy?.draftExerciseId === exercise.id;
    const draftVersion = legacyDraft ? legacy.draftVersion : exercise.version;
    const base = `enntor.draft.${exercise.id}.${draftVersion}`;
    const key = session.legacyDrafts && legacyDraft ? base : `${base}.${session.id}`;
    const visibleHints = session.hints.filter((hint) => hint.exercise.id === exercise.id && hint.exercise.version === exercise.version).map(({ level }) => level);
    const previous = history.filter(({ id }) => id !== session.id);
    const priorHints = previous.flatMap((item) => item.hints).filter((hint) => hint.exercise.id === exercise.id)
      .map(({ level }) => level);
    const priorPass = previous.some((item) => item.submissions.some((attempt) =>
      attempt.exercise.id === exercise.id && attempt.grade?.verdict === 'passed'));
    const seenBefore = !legacy && previous.some((item) => item.submissions.some((attempt) =>
      attempt.exercise.id === exercise.id && attempt.exercise.version === exercise.version));
    return <ExerciseEditor key={exercise.id} {...{ stage, exercise, draftKey: key, priorPass }}
      hints={visibleHints} feedback={stage === 'Modify' ? predictionCoaching.modifyFeedback : undefined}
      onBusy={(value) => setBusy((old) => ({ ...old, [exercise.id]: value }))}
      onDraftFailure={(value) => setDraftFailures((old) => ({ ...old, [exercise.id]: value }))}
      onHint={(level: HintLevel) => update((old) => ({ ...old, hints: old.hints.some((hint) => hint.exercise.id === exercise.id &&
          hint.exercise.version === exercise.version && hint.level === level) ? old.hints : [...old.hints,
        { exercise: { id: exercise.id, version: exercise.version }, level, at: now() }] }))}
      onAttempt={(attempt) => record({ ...attempt, seenBefore: seenBefore || undefined, hints: [...new Set([...priorHints, ...attempt.hints])] })} />;
  }

  const stage = session.completion ? 7 : state.canFinish ? 6 : state.built ? 5 : state.modified ? 4 : state.investigated ? 3
    : state.prediction ? 2 : session.learnedAt ? 1 : 0;
  const output = state.prediction?.stdout.trim();
  const lastRun = session.prediction?.runs.at(-1);
  const assistance = state.made.some((item) => item.hints.length > 0 || item.priorPass || item.seenBefore);

  const blocked = predicting || !!busyCount || draftFailed;
  const storageAlert = error && <div className="pilot-feedback" role="alert">
    <p>Local evidence could not be saved or read. Keep this page open and retry. Another tab may have changed this session.</p>
    {!results && <button onClick={() => save()}>Retry saving</button>}
  </div>;

  if (results) {
    return <LessonReport item={item} session={session} storageAlert={storageAlert}
      onSweat={(sweat) => save(withSweatRating(session, sweat), true)} />;
  }

  return (
    <article className="pilot">
      <a className="back-link" href="#/climb" onClick={(event) => {
        if (error || draftFailed || predicting || busyCount) event.preventDefault();
      }}>← The Climb</a>
      <p className="eyebrow">{legacy ? 'Pilot lesson' : 'Lesson'} · {lesson.id} · {lesson.estimatedMinutes} min</p>
      <h1>{sequence.titleAccent && lesson.title.endsWith(sequence.titleAccent)
        ? <>{lesson.title.slice(0, -sequence.titleAccent.length)}<span>{sequence.titleAccent}</span></> : lesson.title}</h1>
      <ol className="pilot-journey" aria-label="Lesson journey">
        {stages.map((label, index) => {
          const historicalBuild = label === 'Build' && session.completion && !session.completion.buildId;
          const complete = index < stage && !historicalBuild;
          return <li key={label} aria-current={index === stage ? 'step' : undefined} data-complete={complete}>
            {label}{complete && <span aria-label=" completed"> ✓</span>}
            {historicalBuild && <span> · added later</span>}
          </li>;
        })}
      </ol>
      {!error && !draftFailed && !session.completion && history.some(({ id }) => id === session.id) &&
        <p className="muted">Progress saved on this browser.</p>}
      {storageAlert}
      {session.completion && <p className="pilot-success">Lesson completed and saved. <a className="pilot-inline-link" href={`#/${resultsPath}`}>View learning report</a></p>}
      <section className="pilot-section" aria-labelledby="learn-heading">
        <h2 id="learn-heading" className="pilot-stage-heading">Learn</h2>
        <h3 className="pilot-exercise-heading">{sequence.learnTitle}</h3>
        {lesson.teachingBlocks.filter(({ type }) => type !== 'warning').map((block) => <TeachingText key={block.id} block={block} />)}
        {!session.learnedAt && !session.completion && <div className="pilot-controls">
          <button className="pilot-primary" onClick={() => update((old) => ({ ...old, learnedAt: now() }))}>Continue to Predict</button>
        </div>}
      </section>
      {!session.completion && <>
        {session.learnedAt && <section className="pilot-section" aria-labelledby="predict-heading">
          <h2 id="predict-heading" className="pilot-stage-heading">Predict</h2>
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
          {lastRun && <Console runs={[lastRun]} printedLabel="Printed result" />}
        </section>}
        {output !== undefined && session.prediction && <PredictionReview answer={session.prediction.answer} output={output} coaching={predictionCoaching}
          warning={lesson.teachingBlocks.find(({ type }) => type === 'warning')}
          reasoning={session.prediction.reasoning}
          onReasoning={(reasoning) => update((old) => ({ ...old, prediction: { ...old.prediction!, reasoning } }))}
          followUpResult={session.followUps.at(-1)}
          onFollowUp={(submitted, correct) => update((old) => ({ ...old, followUps: [...old.followUps,
            { id: crypto.randomUUID(), answer: submitted, correct, expected: predictionCoaching.followUp.expected, at: now() }] }))} />}
        {state.investigated && editor(modification, 'Modify')}
        {state.modified && <section className="pilot-section" aria-labelledby="build-plan-heading">
          <h2 id="build-plan-heading" className="pilot-stage-heading">Build</h2>
          <h3 className="pilot-exercise-heading">Plan the function</h3>
          <p><TeachingProseText content={buildPlan.prompt} /></p>
          <p>Inputs go in the declaration. Decide what the output represents before writing the body.</p>
          <fieldset disabled={session.buildPlan?.correct}>
            <legend>Choose the intended result</legend>
            {buildPlan.options.map(({ id, text }) => <label key={id}>
              <input type="radio" name="build-plan" checked={session.buildPlan?.choice === id}
                onChange={() => update((old) => {
                  const check = { choice: id, correct: id === buildPlan.correct, at: now() };
                  return { ...old, buildPlan: check, buildChecks: [...(old.buildChecks ?? []), check] };
                })} /> {text}
            </label>)}
          </fieldset>
          {session.buildPlan && <p role="status">{session.buildPlan.correct ? 'That matches the requirement.'
            : buildPlan.retry}</p>}
          {session.buildPlan?.correct && <p><TeachingProseText content={buildPlan.syntax} /></p>}
        </section>}
        {state.modified && session.buildPlan?.correct && editor(build, 'Build')}
        {state.built && editor(make, 'Make')}
        {state.built && assistance && !state.independent && !showTransfer && <div className="pilot-controls">
          <button disabled={!!busyCount} onClick={() => update((old) => ({ ...old, transferOpenedAt: now() }))}>Try a fresh Make problem</button>
        </div>}
        {state.built && showTransfer && <>
          {!legacy && history.some((item) => item.id !== session.id &&
            item.submissions.some((attempt) => attempt.exercise.id === transfer.id && attempt.exercise.version === transfer.version)) &&
            <p className="pilot-feedback">You have already attempted this transfer problem. A repeat is practice. This edition has no second transfer variant.</p>}
          {editor(transfer, 'Make')}
        </>}
      </>}
      <section className="pilot-section" aria-labelledby="finish-heading">
        <h2 id="finish-heading">Finish</h2>
        {session.completion ? (
          <div className="pilot-controls"><button onClick={startAgain}>Start another lesson session</button></div>
        ) : (
          <>
            {!state.canFinish && <p>{state.built && state.made.length
              ? 'The passing Make solution used implementation help. Pass the fresh Make problem to finish.'
              : 'Complete the prediction review and pass Modify, Build, and Make to finish.'}</p>}
            <div className="pilot-controls">
              {state.canFinish ? <button className="pilot-primary" disabled={blocked} onClick={() => {
                if (update((old) => finalizeEvidence(old, state), true)) window.location.hash = '/' + resultsPath;
              }}>Finish lesson</button> : <button disabled={blocked} onClick={() => {
                if (save()) window.location.hash = '/climb';
              }}>Save for later</button>}
            </div>
          </>
        )}
      </section>
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
