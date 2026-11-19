import type { WorkoutCoaching as Coaching } from './workout-evidence';

const category = {
  'syntax-error': 'Syntax error',
  'indentation-error': 'Indentation error',
  'runtime-exception': 'Runtime exception',
  'missing-return': 'No numeric return value',
  'unexpected-result': 'Unexpected result',
  'negative-for-positive': 'Unexpected negative result',
  grouping: 'Grouping in the returned expression',
  'edge-case': 'Failed boundary case',
} as const;

export function WorkoutCoaching({ coaching, onRespond }: {
  coaching: Coaching; onRespond?: (answer: 'confirmed' | 'rejected') => void;
}) {
  const { observation, exposure, hypothesis, response } = coaching;
  return <div className="pilot-feedback">
    {exposure && <h3>Conceptual nudge</h3>}
    <p role={onRespond ? 'status' : undefined}>
      <strong>{category[observation.kind]}. </strong>{'exception' in observation ? <>Python reported <code>{observation.exception}</code> while checking the submission.</>
        : <>For inputs <code>{JSON.stringify(observation.inputs)}</code>, your function returned <code>{observation.actual}</code>.
          The expected result was <code>{observation.expected}</code>.
          {observation.kind === 'negative-for-positive' && ' This case should have a positive cargo weight.'}</>}
    </p>
    {exposure && <p>{exposure.question}</p>}
    {exposure && hypothesis && <>
      <p><strong>Possible explanation.</strong> {hypothesis.question}</p>
      {onRespond && <div className="pilot-controls">
        <button aria-pressed={response?.answer === 'confirmed'} onClick={() => onRespond('confirmed')}>Yes, that was my reasoning</button>
        <button aria-pressed={response?.answer === 'rejected'} onClick={() => onRespond('rejected')}>No, I reasoned differently</button>
      </div>}
      {response && <p role="status">{response.answer === 'confirmed'
        ? 'You confirmed this explanation for this attempt.'
        : 'You rejected this explanation for this attempt.'}</p>}
    </>}
  </div>;
}
