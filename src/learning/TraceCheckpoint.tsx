import { useState } from 'react';
import { gradeTrace } from './trace';
import type { TraceAttempt, TraceCheck } from './trace';

export function TraceCheckpoint({ check, attempts, onCheck }: {
  check: TraceCheck; attempts: TraceAttempt[]; onCheck: (grade: ReturnType<typeof gradeTrace>) => void;
}) {
  const last = attempts.at(-1);
  const [answers, setAnswers] = useState(() => last?.answers ?? check.rows.map(() => check.columns.map(() => '')));
  return <section className="pilot-section" aria-labelledby={check.id}>
    <h3 className="pilot-exercise-heading" id={check.id}>{check.title}</h3>
    <p>{check.prompt}</p>
    <pre>{check.source}</pre>
    <form onSubmit={event => {
      event.preventDefault();
      if (!last?.correct && answers.every(row => row.every(answer => answer.trim()))) onCheck(gradeTrace(check, answers));
    }}>
      <table className="trace-table">
        <thead><tr><th scope="col">After</th>{check.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{check.rows.map(({ label }, row) => <tr key={label}><th scope="row">{label}</th>
          {check.columns.map((column, col) => <td key={column}>
            <input aria-label={label + ' · ' + column} readOnly={last?.correct} value={answers[row][col]} required
              onChange={event => {
                const value = event.target.value;
                setAnswers(old => old.map((line, index) => index === row ? line.map((answer, i) => i === col ? value : answer) : line));
              }} />
          </td>)}
        </tr>)}</tbody>
      </table>
      <div className="pilot-controls"><button disabled={last?.correct}>Check trace</button></div>
    </form>
    {last && <p role="status" className={last.correct ? 'pilot-success' : undefined}>{last.correct ? 'Trace checks out.'
      : last.pattern === check.mistake?.id && check.mistake ? check.mistake.message
        : `Recheck ${[...new Set(last.missed.map(({ row }) => check.rows[row].label))].join(', ')}. Trace each assignment before comparing.`}</p>}
  </section>;
}
