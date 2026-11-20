import { useState } from 'react';
import { gradeTrace, traceHelpOrder } from './trace';
import type { TraceAttempt, TraceCheck, TraceHelpLevel } from './trace';

export function TraceCheckpoint({ check, attempts, help, onHelp, onCheck }: {
  check: TraceCheck; attempts: TraceAttempt[]; help: TraceHelpLevel[];
  onHelp: (level: TraceHelpLevel) => void; onCheck: (grade: ReturnType<typeof gradeTrace>) => void;
}) {
  const next = traceHelpOrder.find(level => !help.includes(level));
  const last = attempts.at(-1);
  const [answers, setAnswers] = useState(() => last?.answers ?? check.rows.map(() => check.columns.map(() => '')));
  return <section className="pilot-section" aria-labelledby={check.id}>
    <h3 className="pilot-exercise-heading" id={check.id}>{check.title}</h3>
    <p>{check.prompt}</p>
    <pre>{check.source}</pre>
    {help.length > 0 && <div className="pilot-feedback" aria-label="Trace help">
      <h4>Trace help</h4>
      {help.includes('concept') && <p>{check.help.concept}</p>}
      {help.includes('guidance') && <p>{check.help.guidance}</p>}
      {help.includes('worked') && <>
        <h4>Worked trace</h4>
        <ul>{check.rows.map(({ label, expected }, index) => <li key={label}>
          <strong>{label}.</strong> {check.columns.map((column, col) => column + ': ' + expected[col]).join(' · ')}.
          {' '}{check.help.worked[index]}
        </li>)}</ul>
        <p>Use the explanation to correct the table and check it again. Your result will be recorded as assisted practice.</p>
      </>}
    </div>}
    {next && !last?.correct && <div className="pilot-controls">
      <button type="button" onClick={() => onHelp(next)}>{{
        concept: 'Show trace hint', guidance: 'Show tracing guidance', worked: 'Show worked trace',
      }[next]}</button>
    </div>}
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
