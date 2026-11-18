import type { TeachingBlock } from '../courses/contracts';
import { TeachingText, TeachingProseText } from './TeachingText';
import { useState } from 'react';
import { predictionCoaching } from '../courses/f01-01';

export function PredictionReview({ answer, output, warning, reasoning, onReasoning, followUpResult, onFollowUp }: {
  answer: string; output: string; warning?: TeachingBlock;
  reasoning?: 'confirmed' | 'rejected'; onReasoning: (value: 'confirmed' | 'rejected') => void;
  followUpResult?: { answer: string; correct: boolean }; onFollowUp: (answer: string, correct: boolean) => void;
}) {
  const matched = Number(answer) === Number(output);
  const suggested = !matched && Number(answer) === predictionCoaching.alternativeAnswer;
  const [followUp, setFollowUp] = useState(followUpResult?.answer ?? '');
  const result = followUpResult?.correct ? 'correct'
    : followUpResult?.answer === followUp.trim() ? 'retry' : undefined;
  const check = predictionCoaching.followUp;

  return (
    <section className="pilot-section" aria-labelledby="investigate-heading">
      <h2 id="investigate-heading">Investigate</h2>
      <p className={matched ? 'pilot-success' : undefined}>{matched ? <><strong>That's right!</strong> Python printed <code>{output}</code>, matching your prediction.</> : `You predicted ${answer}. Python printed ${output}.`}</p>
      {suggested ? (
        <>
          <p><TeachingProseText content={predictionCoaching.possibleReasoning} /></p>
          <p><TeachingProseText content={predictionCoaching.actualReasoning} /></p>
          <fieldset>
            <legend>Is that how you got 30?</legend>
            <label><input type="radio" name="reasoning" checked={reasoning === 'confirmed'}
              onChange={() => onReasoning('confirmed')} /> Yes, I added first</label>
            <label><input type="radio" name="reasoning" checked={reasoning === 'rejected'}
              onChange={() => onReasoning('rejected')} /> No, I used a different approach</label>
          </fieldset>
          {reasoning && <p role="status">{reasoning === 'confirmed'
            ? 'Thanks for confirming. Try tracing multiplication first in the next example.'
            : 'Thanks for clarifying. Start with the assignments and trace each dependency in the next example.'}</p>}
        </>
      ) : <p><TeachingProseText content={predictionCoaching.explanation} /></p>}
      {warning && <TeachingText block={warning} />}
      {!matched && (
        <div className="pilot-feedback">
          <h3>Check your understanding</h3>
          <p>What does this version print?</p>
          <pre>{check.code}</pre>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (result === 'correct' || !/^[+-]?\d+$/.test(followUp.trim())) return;
            const correct = Number(followUp) === check.expected;
            onFollowUp(followUp.trim(), correct);
          }}>
            <label htmlFor="follow-up">Follow-up prediction</label>
            <div className="pilot-controls">
              <input id="follow-up" value={followUp} readOnly={result === 'correct'} onChange={(event) => setFollowUp(event.target.value)} />
              <button className="pilot-primary" disabled={result === 'correct' || !/^[+-]?\d+$/.test(followUp.trim())}>Check prediction</button>
            </div>
          </form>
          <p role="status" className={result === 'correct' ? 'pilot-success' : undefined}>{result === 'correct' ? <>That matches. <TeachingProseText content={check.explanation} /></>
            : result === 'retry' ? <>Try again. <TeachingProseText content={check.hint} /></> : ''}</p>
        </div>
      )}
    </section>
  );
}
