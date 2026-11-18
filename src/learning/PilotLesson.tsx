import { TeachingText } from './TeachingText';
import { PredictionReview } from './PredictionReview';
import { useEffect, useRef, useState } from 'react';
import { loadPilot } from '../courses/load-pilot';
import type { ExecutionResult, GradeResult } from '../execution/contracts';
import { gradeExercise, runExercise } from '../execution/grading';
import { pythonEngine } from '../execution/python-engine';

const { lesson, prediction, modification } = loadPilot();
const initialCode = modification.starterCode!;
const draftKey = `enntor.draft.${modification.id}.${modification.version}`;

function readDraft() {
  try {
    return localStorage.getItem(draftKey) ?? initialCode;
  } catch {
    return initialCode;
  }
}

function Console({ runs }: { runs: ExecutionResult[] }) {
  return (
    <div role="status" className="pilot-console">
      {runs.map((result, index) => (
        <div key={result.requestId}>
          <strong>{runs.length > 1 ? `Test ${index + 1} · ` : ''}Execution {result.status}</strong>
          {result.stdout && <pre>stdout{'\n'}{result.stdout}</pre>}
          {result.stderr && <pre>stderr{'\n'}{result.stderr}</pre>}
          {result.error && <pre>{result.status === 'error' ? 'Exception or runtime error\n' : ''}{result.error.message}</pre>}
          {result.status === 'completed' && !result.stdout && !result.stderr && <p>{result.value !== undefined ? 'The function returned a value without printing.' : 'No console output.'}</p>}
        </div>
      ))}
    </div>
  );
}

export const pilotTitle = lesson.title;

export function PilotLesson() {
  const [answer, setAnswer] = useState('');
  const [committed, setCommitted] = useState<string>();
  const [verified, setVerified] = useState(false);
  const [predictionRun, setPredictionRun] = useState<ExecutionResult>();
  const [code, setCode] = useState(readDraft);
  const [saveFailed, setSaveFailed] = useState(false);
  const [runs, setRuns] = useState<ExecutionResult[]>([]);
  const [grade, setGrade] = useState<GradeResult>();
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);

  useEffect(() => () => {
    active.current?.abort();
    active.current = null;
  }, []);

  function saveCode(value: string) {
    setCode(value);
    setRuns([]);
    setGrade(undefined);
    try {
      localStorage.setItem(draftKey, value);
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }

  async function execute(mode: 'predict' | 'run' | 'check') {
    if (active.current) return;
    const job = new AbortController();
    active.current = job;
    setBusy(true);
    try {
      if (mode === 'predict') {
        if (committed === undefined) setCommitted(answer.trim());
        const result = await runExercise(pythonEngine, prediction, prediction.starterCode!, job.signal);
        if (active.current === job) setPredictionRun(result);
      } else {
        setRuns([]);
        setGrade(undefined);
        if (mode === 'check') {
          const checked = await gradeExercise(pythonEngine, modification, code, job.signal);
          if (active.current === job) {
            setRuns(checked.runs);
            setGrade(checked.grade);
          }
        } else {
          const result = await runExercise(pythonEngine, modification, code, job.signal);
          if (active.current === job) setRuns([result]);
        }
      }
    } finally {
      if (active.current === job) {
        active.current = null;
        setBusy(false);
      }
    }
  }

  const output = predictionRun?.status === 'completed' ? predictionRun.stdout.trim() : undefined;
  const numericAnswer = /^[+-]?\d+$/.test(answer.trim());
  return (
    <article className="pilot">
      <a className="back-link" href="#/climb">← The Climb</a>
      <p className="eyebrow">Pilot lesson · {lesson.id} · {lesson.estimatedMinutes} min</p>
      <h1>{lesson.title}</h1>
      <section className="pilot-section" aria-labelledby="learn-heading">
        <h2 id="learn-heading">Trace backwards, execute forwards</h2>
        {lesson.teachingBlocks.map((block) => <TeachingText key={block.id} block={block} />)}
      </section>
      <section className="pilot-section" aria-labelledby="predict-heading">
        <h2 id="predict-heading">Predict</h2>
        <p>{prediction.prompt}</p>
        <pre>{prediction.starterCode}</pre>
        <form onSubmit={(event) => {
          event.preventDefault();
          if (numericAnswer && output === undefined) void execute('predict');
        }}>
          <label htmlFor="prediction">Your prediction</label>
          <div className="pilot-controls">
            <input id="prediction" value={answer} onChange={(event) => setAnswer(event.target.value)}
              readOnly={committed !== undefined} autoComplete="off" />
            <button disabled={!numericAnswer || busy || output !== undefined}>
              {committed === undefined ? 'Commit prediction & run' : 'Run prediction'}
            </button>
            {output === undefined && <button type="button" disabled={!busy} onClick={() => active.current?.abort()}>Stop</button>}
          </div>
        </form>
        {predictionRun && <Console runs={[predictionRun]} />}
      </section>
      {output !== undefined && committed !== undefined && (
        <PredictionReview answer={committed} output={output}
          explanation={String(prediction.grading.configuration.explanation)}
          onVerified={() => setVerified(true)} />
      )}
      {output !== undefined && (verified || Number(committed) === Number(output)) && (
        <section className="pilot-section" aria-labelledby="modify-heading">
          <h2 id="modify-heading">Modify · {modification.title}</h2>
          <p>{modification.prompt}</p>
          <details><summary>Hint</summary><p>{modification.hints[0].text}</p></details>
          <label htmlFor="python-editor">Python code</label>
          <textarea id="python-editor" rows={8} value={code} spellCheck={false} autoCapitalize="off"
            autoComplete="off" readOnly={busy} onChange={(event) => saveCode(event.target.value)} />
          <p className="muted" role="status">{saveFailed ? 'Draft could not be saved in this browser.' : 'Drafts are saved in this browser.'}</p>
          <div className="pilot-controls">
            <button disabled={busy} onClick={() => void execute('run')}>Run</button>
            <button disabled={busy} onClick={() => void execute('check')}>Check solution</button>
            <button disabled={!busy} onClick={() => active.current?.abort()}>Stop</button>
            <button disabled={busy || code === initialCode} onClick={() => {
              if (window.confirm('Replace this draft with the starter code?')) saveCode(initialCode);
            }}>Reset</button>
          </div>
          <p className="muted">Run executes the editor as a script. Check solution calls your function with public test inputs.</p>
          <Console runs={runs} />
          {grade && (
            <div className="pilot-feedback" role="status">
              <h3>Test results</h3>
              <p>{grade.verdict === 'passed' ? 'All public cases passed.' : grade.verdict === 'failed'
                ? 'Some public cases failed. Compare the returned values with the expected values and check which operation runs first.'
                : 'Check incomplete. See the execution output above.'}</p>
              <table className="pilot-tests">
                <caption>Public return-value checks</caption>
                <thead><tr><th scope="col">Inputs</th><th scope="col">Expected</th>
                  <th scope="col">Actual</th><th scope="col">Status</th></tr></thead>
                <tbody>{modification.grading.publicCases.map((test, index) => {
                  const run = runs[index];
                  const evidence = grade.evidence[index];
                  return <tr key={test.id}>
                    <td><code>{JSON.stringify(test.input)}</code></td>
                    <td><code>{JSON.stringify(test.expected)}</code></td>
                    <td><code>{run?.status === 'completed' ? JSON.stringify(run.value) : '—'}</code></td>
                    <td>{evidence ? evidence.passed ? 'Passed' : 'Failed' : run ? 'Incomplete' : 'Not run'}</td>
                  </tr>;
                })}</tbody>
              </table>
              <p className="muted">These checks cover the listed cases. Lesson mastery requires independent practice.</p>
            </div>
          )}
        </section>
      )}
      {busy && <p className="pilot-running" role="status">Python is running…</p>}
    </article>
  );
}
