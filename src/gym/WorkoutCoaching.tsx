import type { WorkoutCoaching as Coaching } from './workout-evidence';

export function WorkoutCoaching({ coaching, onRespond }: {
  coaching: Coaching; onRespond?: (answer: 'confirmed' | 'rejected') => void;
}) {
  const { observation, exposure, hypothesis, response } = coaching;
  return <div className="pilot-feedback">
    {exposure && <h3>Conceptual nudge</h3>}
    <p role={onRespond ? 'status' : undefined}>For inputs <code>{JSON.stringify(observation.inputs)}</code>, your function returned <code>{observation.actual}</code>.
      The expected result was <code>{observation.expected}</code>.
      {observation.kind === 'negative-for-positive' && ' This case should have a positive cargo weight.'}</p>
    {exposure && <p>{exposure.question}</p>}
    {exposure && hypothesis && <>
      <p>{hypothesis.question}</p>
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
