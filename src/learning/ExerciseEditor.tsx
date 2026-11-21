import { ExerciseHints } from './ExerciseHints';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { Exercise, HintLevel } from '../courses/contracts';
import type { ExecutionResult, GradeResult } from '../execution/contracts';
import { gradeExercise } from '../execution/grading';
import { pythonEngine } from '../execution/python-engine';
import { TeachingProseText } from './TeachingText';
import type { CheckCoaching } from './check-coaching';
import type { Submission } from './evidence';
import { now } from './evidence';

const PythonEditor = lazy(async () => ({ default: (await import('./PythonEditor')).PythonEditor }));

function readDraft(draftKey: string) {
  try {
    return localStorage.getItem(draftKey);
  } catch {
    return null;
  }
}

function readArchive(archiveKey: string): string[] {
  const entries: unknown = JSON.parse(localStorage.getItem(archiveKey) ?? '[]');
  if (!Array.isArray(entries) || !entries.every((entry) => typeof entry === 'string')) {
    throw new Error('Stored draft archive is invalid.');
  }
  return entries;
}

export function Console({ runs, printedLabel = 'stdout' }: { runs: ExecutionResult[]; printedLabel?: string }) {
  if (!runs.length) return null;
  const last = runs[runs.length - 1];
  const details = runs.filter((result) => result.stdout || result.stderr || result.error);
  return (
    <div role="status" className="pilot-console">
      <p><strong>Execution {last.status}</strong></p>
      {details.map((result) => (
        <div key={result.requestId}>
          {runs.length > 1 && <strong>Test {runs.indexOf(result) + 1}</strong>}
          {result.stdout && <pre>{printedLabel}{'\n'}{result.stdout}</pre>}
          {result.stderr && <pre>stderr{'\n'}{result.stderr}</pre>}
          {result.error && <pre>{result.status === 'error' ? 'Exception or runtime error\n' : ''}{result.error.message}</pre>}
        </div>
      ))}
    </div>
  );
}

export function ExerciseEditor({ stage, exercise, draftKey, earlierDraftKey, hints, allowAssistedFinish, priorPass, coach, onHint, onAttempt, onBusy, onDraftFailure, onEdit }: {
  stage: 'Modify' | 'Build' | 'Make' | 'Practice'; exercise: Exercise; draftKey: string; earlierDraftKey?: string; hints: HintLevel[];
  priorPass: boolean; allowAssistedFinish?: boolean; coach?: (attempt: Submission) => Promise<CheckCoaching | undefined>; onHint: (level: HintLevel) => void;
  onAttempt: (attempt: Submission) => void; onBusy: (value: boolean) => void; onDraftFailure: (value: boolean) => void; onEdit?: () => void;
}) {
  const initialCode = exercise.starterCode!;
  const archiveKey = `${draftKey}.previous`;
  const [savedDraft] = useState(() => readDraft(draftKey) ?? (earlierDraftKey ? readDraft(earlierDraftKey) : null));
  const [code, setCode] = useState(savedDraft ?? initialCode);
  const [draftNotice, setDraftNotice] = useState(savedDraft !== null && savedDraft !== initialCode ? 'Previous draft restored' : '');
  const [archive, setArchive] = useState(() => {
    try { return readArchive(archiveKey); } catch { return []; }
  });
  const [saveFailed, setSaveFailed] = useState(false);
  const [runs, setRuns] = useState<ExecutionResult[]>([]);
  const [grade, setGrade] = useState<GradeResult>();
  const [coaching, setCoaching] = useState<CheckCoaching>();
  const [busy, setBusy] = useState(false);
  const active = useRef<AbortController | null>(null);

  useEffect(() => () => {
    active.current?.abort();
    active.current = null;
  }, []);

  function saveCode(value: string) {
    onEdit?.();
    setDraftNotice('');
    setCode(value);
    setRuns([]);
    setGrade(undefined);
    setCoaching(undefined);
    try {
      localStorage.setItem(draftKey, value);
      setSaveFailed(false);
      onDraftFailure(false);
    } catch {
      setSaveFailed(true);
      onDraftFailure(true);
    }
  }

  function replaceDraft(value: string, notice: string) {
    try {
      const previous = readArchive(archiveKey);
      const stored = localStorage.getItem(draftKey);
      for (const draft of [stored, code]) {
        if (draft !== null && draft !== initialCode && draft !== value && !previous.includes(draft)) {
          previous.push(draft);
        }
      }
      localStorage.setItem(archiveKey, JSON.stringify(previous));
      setArchive(previous);
      localStorage.setItem(draftKey, value);
    } catch {
      setDraftNotice('Could not safely save your draft. The editor was kept as-is.');
      return;
    }
    onEdit?.();
    setCode(value);
    setRuns([]);
    setGrade(undefined);
    setCoaching(undefined);
    setSaveFailed(false);
    onDraftFailure(false);
    setDraftNotice(notice);
  }

  async function execute() {
    if (active.current) return;
    const job = new AbortController();
    active.current = job;
    setBusy(true);
    onBusy(true);
    setRuns([]);
    setGrade(undefined);
    setCoaching(undefined);
    try {
      const attempt = { id: crypto.randomUUID(), exercise: { id: exercise.id, version: exercise.version },
        source: code, hints: [...hints], priorPass, startedAt: now() };
      const start = performance.now();
      onAttempt(attempt);
      const checked = await gradeExercise(pythonEngine, exercise, code, job.signal);
      const finishedAt = now();
      const complete = { ...attempt, ...checked, finishedAt, elapsedMs: performance.now() - start };
      const note = active.current === job ? await coach?.(complete) : undefined;
      onAttempt({ ...complete, coaching: note && active.current === job ? { ...note, shownAt: now() } : undefined });
      if (active.current === job) {
        setRuns(checked.runs);
        setGrade(checked.grade);
        setCoaching(note);
      }
    } finally {
      if (active.current === job) {
        active.current = null;
        setBusy(false);
        onBusy(false);
      }
    }
  }

  return (
        <section className="pilot-section" aria-label={`${stage} · ${exercise.title}`}>
          {stage !== 'Build' && <h2 className="pilot-stage-heading">{stage}</h2>}
          <h3 className="pilot-exercise-heading" id={`${exercise.id}-heading`}>{exercise.title}</h3>
          <p className="exercise-prompt"><TeachingProseText content={exercise.prompt} /></p>
          <ExerciseHints allowAssistedFinish={allowAssistedFinish} hints={exercise.hints} revealed={hints} busy={busy} onReveal={onHint} />
          <p className="python-editor-label">{stage} Python code</p>
          <Suspense fallback={<p role="status">Loading the Python editor…</p>}>
            <PythonEditor id={`${exercise.id}-editor`} label={`${stage} Python code`}
            value={code} readOnly={busy} onChange={saveCode} />
          </Suspense>
          <p className="muted" role="status">{saveFailed ? 'Draft could not be saved in this browser.' : 'Drafts are saved in this browser.'}</p>
          {saveFailed && <button disabled={busy} onClick={() => saveCode(code)}>Retry saving draft</button>}
          <div className="pilot-controls">
            <button className="pilot-primary" disabled={busy} onClick={() => void execute()}>Check solution</button>
            <button disabled={!busy} onClick={() => active.current?.abort()}>Stop</button>
            <button disabled={busy || code === initialCode} onClick={() => {
              if (window.confirm('Reset to starter code? Your draft will be saved under Previous drafts.')) {
                replaceDraft(initialCode, 'Editor reset to starter code.');
              }
            }}>Reset</button>
            <button disabled={busy} onClick={() => {
              if (window.confirm('Start from scratch? Your current draft will be saved under Previous drafts.')) {
                replaceDraft(initialCode, 'Fresh attempt started.');
              }
            }}>Try again from scratch</button>
          </div>
          {draftNotice && <p className="muted" role="status">{draftNotice}</p>}
          {archive.length > 0 && (
            <details>
              <summary>Previous drafts ({archive.length})</summary>
              <ol>{archive.map((draft, index) => <li key={index}>
                <button type="button" disabled={busy || draft === code} onClick={() => {
                  if (window.confirm('Restore this draft? Your current edits will be kept under Previous drafts.')) {
                    replaceDraft(draft, 'Previous draft restored');
                  }
                }}>Restore draft {index + 1}</button>
              </li>)}</ol>
            </details>
          )}
          <p className="muted">Check solution calls your function with public test inputs.</p>
          {busy && <p role="status">Python is running…</p>}
          <Console runs={runs} />
          {grade && (
            <div className="pilot-feedback" role="status">
              <h3>Test results</h3>
              <p className={grade.verdict === 'passed' ? 'pilot-success' : undefined}>{grade.verdict === 'passed' ? 'All public cases passed.' : grade.verdict === 'failed'
                ? 'Some public cases failed.'
                : 'Check incomplete. See the execution output above.'}</p>
              {coaching && <p className="check-coaching"><strong>{coaching.fact}</strong> {coaching.question}</p>}
              <table className="pilot-tests">
                <caption>{exercise.grading.graderId === 'return-and-arguments'
                  ? 'Public return and input-state checks' : 'Public return-value checks'}</caption>
                <thead><tr><th scope="col">Inputs</th><th scope="col">Expected</th>
                  <th scope="col">Actual</th><th scope="col">Status</th></tr></thead>
                <tbody>{exercise.grading.publicCases.map((test, index) => {
                  const run = runs[index];
                  const evidence = grade.evidence[index];
                  return <tr key={test.id}>
                    <td><code>{JSON.stringify(test.input)}</code></td>
                    <td>
                      {test.expectedArguments !== undefined && <span>Return </span>}
                      <code>{JSON.stringify(test.expected)}</code>
                      {test.expectedArguments !== undefined && <div>Inputs after call <code>{JSON.stringify(test.expectedArguments)}</code></div>}
                    </td>
                    <td>
                      {test.expectedArguments !== undefined && <span>Return </span>}
                      <code>{run?.status === 'completed' ? JSON.stringify(run.value) : '—'}</code>
                      {test.expectedArguments !== undefined && <div>Inputs after call <code>{run?.argumentsAfter === undefined ? '—' : JSON.stringify(run.argumentsAfter)}</code></div>}
                    </td>
                    <td>{evidence ? evidence.passed ? 'Passed' : 'Failed' : run ? 'Incomplete' : 'Not run'}</td>
                  </tr>;
                })}</tbody>
              </table>
              <p className="muted">{stage === 'Practice' ? 'These checks cover the listed cases.' : 'These checks cover the listed cases. Lesson mastery requires independent practice.'}</p>
            </div>
          )}
        </section>
  );
}
