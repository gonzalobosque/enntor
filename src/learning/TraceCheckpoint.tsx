import { TeachingProseText } from './TeachingText';
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
  const [edited, setEdited] = useState(false);
  const format = check.labelChoices ? gradeTrace(check, answers).format ?? [] : [];
  const setCell = (row: number, column: number, value: string) => {
    setEdited(true);
    setAnswers(old => old.map((line, index) => index === row ? line.map((answer, col) => col === column ? value : answer) : line));
  };
  return <section className="pilot-section" aria-labelledby={check.id}>
    <h3 className="pilot-exercise-heading" id={check.id}>{check.title}</h3>
    <p className="exercise-prompt"><TeachingProseText content={check.prompt} /></p>
    <pre>{check.source}</pre>
    {help.length > 0 && <div className="pilot-feedback" aria-label="Trace help">
      <h4>Trace help</h4>
      {help.includes('concept') && <p><TeachingProseText content={check.help.concept} /></p>}
      {help.includes('guidance') && <p><TeachingProseText content={check.help.guidance} /></p>}
      {help.includes('worked') && <>
        <h4>Worked trace</h4>
        <ul>{check.rows.map(({ label, expected }, index) => <li key={label}>
          <strong>{label}.</strong> {check.columns.map((column, col) => <span key={column}>{col ? ' · ' : ''}{column}{' '}{check.labelChoices?.column === col
            ? <strong className="teaching-label">{expected[col].toUpperCase()}</strong>
            : <code>{expected[col]}</code>}</span>)}.
          {' '}<TeachingProseText content={check.help.worked[index]} />
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
      if (!last?.correct && !format.length && answers.every(row => row.every(answer => answer.trim()))) {
        setEdited(false);
        onCheck(gradeTrace(check, answers));
      }
    }}>
      <table className="trace-table">
        <thead><tr><th scope="col">After</th>{check.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{check.rows.map(({ label }, row) => <tr key={label}><th scope="row">{label}</th>
          {check.columns.map((column, col) => <td key={column}>
            {check.labelChoices?.column === col ? <>
              <select aria-label={label + ' · ' + column} required disabled={last?.correct}
                value={format.some(cell => cell.row === row) ? '' : answers[row][col].toLowerCase()}
                onChange={event => setCell(row, col, event.target.value)}>
                <option value="">Choose a label</option>
                {check.labelChoices.options.map(option => <option key={option} value={option.toLowerCase()}>{option}</option>)}
              </select>
              {answers[row][col] && format.some(cell => cell.row === row) &&
                <small>Saved response <code>{answers[row][col]}</code>. Choose an object label.</small>}
            </> : <input aria-label={label + ' · ' + column} readOnly={last?.correct} value={answers[row][col]} required
              onChange={event => setCell(row, col, event.target.value)} />}
          </td>)}
        </tr>)}</tbody>
      </table>
      <div className="pilot-controls"><button disabled={last?.correct}>Check trace</button></div>
    </form>
    {format.some(({ row, column }) => !!answers[row][column]) && <p role="status">
      The object-label column expects {check.labelChoices?.options.map((label, index) => <span key={label}>{index ? ' or ' : ''}<strong>{label}</strong></span>)}. A list, number or variable name uses a different answer format.
    </p>}
    {last && !edited && !format.length && <p role="status" className={last.correct ? 'pilot-success' : undefined}>{last.correct ? 'Trace checks out.'
      : last.pattern === check.mistake?.id && check.mistake ? <TeachingProseText content={check.mistake.message} />
        : `Recheck ${[...new Set(last.missed.map(({ row }) => check.rows[row].label))].join(', ')}. Trace each assignment before comparing.`}</p>}
  </section>;
}
