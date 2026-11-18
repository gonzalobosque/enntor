import { useState } from 'react';
import { predictionCoaching } from '../courses/f01-01';

export function PredictionReview({ answer, output, explanation, onVerified }: {
  answer: string; output: string; explanation: string; onVerified: () => void;
}) {
  const matched = Number(answer) === Number(output);
  const suggested = !matched && Number(answer) === predictionCoaching.alternativeAnswer;
  const [reasoning, setReasoning] = useState<'confirmed' | 'rejected'>();
  const [followUp, setFollowUp] = useState('');
  const [result, setResult] = useState<'correct' | 'retry'>();
  const check = predictionCoaching.followUp;

  return (
    <section className="pilot-section" aria-labelledby="investigate-heading">
      <h2 id="investigate-heading">Investigate</h2>
      <p>{matched ? 'Your prediction matches.' : `You predicted ${answer}. Python printed ${output}.`}</p>
      {suggested ? (
        <>
          <p>{predictionCoaching.possibleReasoning}</p>
          <p>{predictionCoaching.actualReasoning}</p>
          <fieldset>
            <legend>Is that how you got 30?</legend>
            <label><input type="radio" name="reasoning" checked={reasoning === 'confirmed'}
              onChange={() => setReasoning('confirmed')} /> Yes, I added first</label>
            <label><input type="radio" name="reasoning" checked={reasoning === 'rejected'}
              onChange={() => setReasoning('rejected')} /> No, I used a different approach</label>
          </fieldset>
          {reasoning && <p role="status">{reasoning === 'confirmed'
            ? 'Thanks for confirming. Try tracing multiplication first in the next example.'
            : 'Thanks for clarifying. Start with the assignments and trace each dependency in the next example.'}</p>}
        </>
      ) : <p>{explanation}</p>}
      {!matched && (
        <div className="pilot-feedback">
          <h3>Check your understanding</h3>
          <p>What does this version print?</p>
          <pre>{check.code}</pre>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (result === 'correct' || !/^[+-]?\d+$/.test(followUp.trim())) return;
            const correct = Number(followUp) === check.expected;
            setResult(correct ? 'correct' : 'retry');
            if (correct) onVerified();
          }}>
            <label htmlFor="follow-up">Follow-up prediction</label>
            <div className="pilot-controls">
              <input id="follow-up" value={followUp} readOnly={result === 'correct'} onChange={(event) => {
                setFollowUp(event.target.value);
                setResult(undefined);
              }} />
              <button disabled={result === 'correct' || !/^[+-]?\d+$/.test(followUp.trim())}>Check prediction</button>
            </div>
          </form>
          <p role="status">{result === 'correct' ? `That matches. ${check.explanation}`
            : result === 'retry' ? `Try again. ${check.hint}` : ''}</p>
        </div>
      )}
    </section>
  );
}
