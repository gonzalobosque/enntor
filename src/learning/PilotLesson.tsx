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
          <strong>{runs.length > 1 ? `Test ${index + 1} · ` : ''}{result.status}</strong>
          {result.stdout && <pre>stdout{'\n'}{result.stdout}</pre>}
          {result.stderr && <pre>stderr{'\n'}{result.stderr}</pre>}
          {result.error && <pre>{result.error.message}</pre>}
          {result.status === 'completed' && !result.stdout && !result.stderr && <p>No console output.</p>}
        </div>
      ))}
    </div>
  );
}

export const pilotTitle = lesson.title;

export function PilotLesson() {
  const [answer, setAnswer] = useState('');
  const [committed, setCommitted] = useState<string>();
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
        {lesson.teachingBlocks.map((block) => block.type === 'explanation'
          ? <p key={block.id}>{block.markdown}</p>
          : <div key={block.id}><pre>{block.code}</pre><p>{block.explanation}</p></div>)}
      </section>
      <section className="pilot-section" aria-labelledby="predict-heading">
        <h2 id="predict-heading">Predict → Run → Investigate</h2>
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
        {output !== undefined && (
          <div className="pilot-feedback">
            <h3>Investigate</h3>
            <p>{Number(committed) === Number(output) ? 'Your prediction matches.' : `You predicted ${committed}. Python printed ${output}.`}</p>
            <p>{String(prediction.grading.configuration.explanation)}</p>
            <p>Which part would you put in parentheses to make Python add first?</p>
          </div>
        )}
      </section>
      {output !== undefined && (
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
              <ul>{grade.evidence.map((test) => (
                <li key={test.id}>{test.passed ? 'Pass' : 'Fail'} · {test.id}. {test.message}</li>
              ))}</ul>
            </div>
          )}
        </section>
      )}
      {busy && <p className="pilot-running" role="status">Python is running…</p>}
    </article>
  );
}
