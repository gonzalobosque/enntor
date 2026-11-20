import { coachCheck, correctionsFor } from './check-coaching';
import { TraceCheckpoint } from './TraceCheckpoint';
import { traceAttempts, traceHelpFor } from './trace';
import type { TraceCheck } from './trace';
import { useEffect, useRef, useState } from 'react';
import type { LoadedLesson } from '../courses/load-course-pack';
import type { ContentReference, Exercise, HintLevel } from '../courses/contracts';
import { runExercise } from '../execution/grading';
import { pythonEngine } from '../execution/python-engine';
import { TeachingText, TeachingProseText } from './TeachingText';
import { PredictionReview } from './PredictionReview';
import { Console, ExerciseEditor } from './ExerciseEditor';
import { finalizeEvidence, hasSeenExercise, hasSolutionHelp, learningState, now } from './evidence';
import type { Submission } from './evidence';
import { useEvidence } from './useEvidence';
import { LessonReport } from './LessonReport';
import { lessonPath } from '../app/areas';
const stages = ['Learn', 'Predict', 'Investigate', 'Modify', 'Build', 'Make', 'Finish'];

export function ClimbLesson({ item, results }: { item: LoadedLesson; results: boolean }) {
  const { pack, lesson, sequence } = item;
  const evidence = useEvidence(pack, { id: lesson.id, version: lesson.version }, !!sequence.legacy);
  return results ? <SavedLessonReport evidence={evidence} item={item} />
    : <LessonSession key={evidence.session.id} evidence={evidence} item={item} />;
}

function SavedLessonReport({ evidence, item }: { evidence: ReturnType<typeof useEvidence>; item: LoadedLesson }) {
  const [reportId, setReportId] = useState('');
  const reports = evidence.history.filter(({ completion }) => completion);
  const saved = reports.find(({ id }) => id === reportId) ?? reports[0] ?? evidence.session;
  return <LessonReport item={item} session={saved} reports={reports} onReport={setReportId}
    storageAlert={evidence.error && <p role="alert">Local evidence could not be saved or read. Reload the last saved report before trying again.</p>}
    onSweat={(sweat) => evidence.rate(saved, sweat)} />;
}

function LessonSession({ evidence, item }: { evidence: ReturnType<typeof useEvidence>; item: LoadedLesson }) {
  const { lesson, sequence, prediction, modification, build, make, transfer } = item;
  const { buildPlan, predictionCoaching, legacy } = sequence;
  const resultsPath = lessonPath(lesson.id, true);
  const { session, history, update, save, error, startAgain } = evidence;
  const state = learningState(session, modification.id, make.id, transfer.id, build.id, !legacy, sequence);
  const earlierSessions = history.filter(({ id }) => id !== session.id);
  const seenExercise = (exercise: Exercise) => {
    const equivalent = sequence.equivalentExerciseVersions?.[exercise.id] ?? [];
    return [exercise.version, ...equivalent].some(version => hasSeenExercise(earlierSessions, { id: exercise.id, version }));
  };
  const repeatTransfer = !legacy && seenExercise(transfer);
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

  function trace(check: TraceCheck) {
    const ref = { id: check.id, version: check.version };
    return <TraceCheckpoint key={check.id} check={check} attempts={traceAttempts(session.traces, ref)}
      help={traceHelpFor(session.traceHelp, ref)}
      onHelp={level => update(old => traceHelpFor(old.traceHelp, ref).includes(level) ? old : {
        ...old, traceHelp: [...(old.traceHelp ?? []), { check: ref, level, at: now() }],
      })}
      onCheck={grade => {
        const seenBefore = earlierSessions.some(item =>
          traceAttempts(item.traces, ref).length > 0 || traceHelpFor(item.traceHelp, ref).length > 0);
        update(old => ({ ...old, traces: [...(old.traces ?? []), {
          ...grade, id: crypto.randomUUID(), at: now(), check: ref, seenBefore,
        }] }));
      }} />;
  }

  function editor(exercise: Exercise, stage: 'Modify' | 'Build' | 'Make') {
    const legacyDraft = legacy?.draftExerciseId === exercise.id;
    const draftVersion = legacyDraft ? legacy.draftVersion : exercise.version;
    const base = `enntor.draft.${exercise.id}.${draftVersion}`;
    const key = session.legacyDrafts && legacyDraft ? base : `${base}.${session.id}`;
    const visibleHints = session.hints.filter((hint) => hint.exercise.id === exercise.id && hint.exercise.version === exercise.version).map(({ level }) => level);
    const sameTask = (ref: ContentReference) => ref.id === exercise.id &&
      (legacy || ref.version === exercise.version || sequence.equivalentExerciseVersions?.[exercise.id]?.includes(ref.version));
    const priorHints = earlierSessions.flatMap((item) => item.hints).filter((hint) => sameTask(hint.exercise))
      .map(({ level }) => level);
    const priorPass = earlierSessions.some((item) => item.submissions.some((attempt) =>
      sameTask(attempt.exercise) && attempt.grade?.verdict === 'passed'));
    const seenBefore = !legacy && seenExercise(exercise);
    const previous = session.submissions.filter(attempt => sameTask(attempt.exercise));
    const priorCoaching = earlierSessions.some(item => item.submissions.some(attempt => sameTask(attempt.exercise) && attempt.coaching));
    const olderDraft = earlierSessions.find(item => !item.completion && sequence.draftsFromLesson === item.lesson.version);
    const earlierDraftKey = olderDraft ? `enntor.draft.${exercise.id}.${sequence.equivalentExerciseVersions?.[exercise.id]?.[0] ?? exercise.version}.${olderDraft.id}` : undefined;
    return <ExerciseEditor key={exercise.id} {...{ stage, exercise, draftKey: key, earlierDraftKey, priorPass }}
      hints={visibleHints} coach={attempt => coachCheck(exercise, attempt, previous)}
      onBusy={(value) => setBusy((old) => ({ ...old, [exercise.id]: value }))}
      onDraftFailure={(value) => setDraftFailures((old) => ({ ...old, [exercise.id]: value }))}
      onHint={(level: HintLevel) => update((old) => ({ ...old, hints: old.hints.some((hint) => hint.exercise.id === exercise.id &&
          hint.exercise.version === exercise.version && hint.level === level) ? old.hints : [...old.hints,
        { exercise: { id: exercise.id, version: exercise.version }, level, at: now() }] }))}
      onAttempt={(attempt) => {
        const corrects = attempt.finishedAt ? correctionsFor(attempt, previous) : [];
        record({ ...attempt, coachedBefore: priorCoaching || previous.some(item => !!item.coaching) || undefined,
        corrects: corrects.length ? corrects : undefined, seenBefore: seenBefore || undefined, priorSolutionHelp: !legacy && hasSolutionHelp(priorHints) || undefined,
        hints: legacy ? [...new Set([...priorHints, ...attempt.hints])] : attempt.hints });
      }} />;
  }

  const stage = session.completion ? 7 : state.canFinish ? 6 : state.built ? 5 : state.modified ? 4 : state.investigated && (!sequence.trace || state.trace) ? 3
    : state.prediction ? 2 : session.learnedAt ? 1 : 0;
  const output = state.prediction?.stdout.trim();
  const lastRun = session.prediction?.runs.at(-1);
  const assistance = state.made.some((item) => item.hints.length > 0 || item.priorPass || item.seenBefore || item.priorSolutionHelp || item.coachedBefore);

  const blocked = predicting || !!busyCount || draftFailed;
  const storageAlert = error && <div className="pilot-feedback" role="alert">
    <p>Local evidence could not be saved or read. Keep this page open and retry. Another tab may have changed this session.</p>
    <button onClick={() => save()}>Retry saving</button>
  </div>;

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
          {output !== undefined && session.prediction && <p role="status" className={Number(output) === Number(session.prediction.answer) ? 'pilot-success' : undefined}>
            {Number(output) === Number(session.prediction.answer) ? "That's right! Your prediction matches the printed result."
              : `Your prediction of ${session.prediction.answer} differs from the printed result.`}
          </p>}
        </section>}
        {output !== undefined && session.prediction && <PredictionReview answer={session.prediction.answer} output={output} coaching={predictionCoaching}
          warning={lesson.teachingBlocks.find(({ type }) => type === 'warning')}
          reasoning={session.prediction.reasoning}
          onReasoning={(reasoning) => update((old) => ({ ...old, prediction: { ...old.prediction!, reasoning } }))}
          followUpResult={session.followUps.at(-1)}
          onFollowUp={(submitted, correct) => update((old) => ({ ...old, followUps: [...old.followUps,
            { id: crypto.randomUUID(), answer: submitted, correct, expected: predictionCoaching.followUp.expected, at: now() }] }))} />}
        {state.investigated && sequence.trace && trace(sequence.trace)}
        {state.investigated && (!sequence.trace || state.trace) && editor(modification, 'Modify')}
        {state.modified && <section className="pilot-section" aria-labelledby="build-plan-heading">
          <h2 id="build-plan-heading" className="pilot-stage-heading">Build</h2>
          <h3 className="pilot-exercise-heading">Plan the function</h3>
          <p><TeachingProseText content={buildPlan.prompt} /></p>
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
          <button disabled={!!busyCount} onClick={() => update((old) => ({ ...old, transferOpenedAt: now(), openedTransfer: { id: transfer.id, version: transfer.version } }))}>{repeatTransfer ? 'Practise the transfer again' : 'Try a fresh Make problem'}</button>
        </div>}
        {state.built && showTransfer && <>
          {repeatTransfer && <p className="pilot-feedback">You have already seen this transfer. A correct repeat can finish this session as practice, without new independent coding evidence.</p>}
          {sequence.transferTrace && trace(sequence.transferTrace)}
          {(!sequence.transferTrace || state.transferTrace) && editor(transfer, 'Make')}
        </>}
      </>}
      <section className="pilot-section" aria-labelledby="finish-heading">
        <h2 id="finish-heading">Finish</h2>
        {session.completion ? (
          <div className="pilot-controls"><button onClick={startAgain}>Start another lesson session</button></div>
        ) : (
          <>
            {!state.canFinish && <p>{state.built && state.made.length
              ? repeatTransfer ? 'Pass the transfer again to finish this practice session.'
                : 'Pass the transfer to finish after using solution help.'
              : 'Complete Investigate and any trace checks, then pass Modify, Build, and Make.'}</p>}
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
