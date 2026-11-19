import type { TeachingBlock } from '../courses/contracts';
import { TeachingText, TeachingProseText } from './TeachingText';
import { useState } from 'react';
import type { LessonSequence } from '../courses/load-course-pack';

export function PredictionReview({ answer, output, warning, coaching, reasoning, onReasoning, followUpResult, onFollowUp }: {
  answer: string; output: string; warning?: TeachingBlock; coaching: LessonSequence['predictionCoaching'];
  reasoning?: 'confirmed' | 'rejected'; onReasoning: (value: 'confirmed' | 'rejected') => void;
  followUpResult?: { answer: string; correct: boolean }; onFollowUp: (answer: string, correct: boolean) => void;
}) {
  const matched = Number(answer) === Number(output);
  const hypothesis = !matched && Number(answer) === coaching.hypothesis?.answer ? coaching.hypothesis : undefined;
  const [followUp, setFollowUp] = useState(followUpResult?.answer ?? '');
  const result = followUpResult?.correct ? 'correct'
    : followUpResult?.answer === followUp.trim() ? 'retry' : undefined;
  const check = coaching.followUp;

  return (
    <section className="pilot-section" aria-labelledby="investigate-heading">
      <h2 id="investigate-heading" className="pilot-stage-heading">Investigate</h2>
      <p className={matched ? 'pilot-success' : undefined}>{matched ? <><strong>That's right!</strong> Python printed <code>{output}</code>, matching your prediction.</> : `You predicted ${answer}. Python printed ${output}.`}</p>
      {hypothesis ? (
        <>
          <p><TeachingProseText content={hypothesis.possibleReasoning} /></p>
          <p><TeachingProseText content={hypothesis.actualReasoning} /></p>
          <fieldset>
            <legend>{hypothesis.question}</legend>
            <label><input type="radio" name="reasoning" checked={reasoning === 'confirmed'}
              onChange={() => onReasoning('confirmed')} /> {hypothesis.confirm}</label>
            <label><input type="radio" name="reasoning" checked={reasoning === 'rejected'}
              onChange={() => onReasoning('rejected')} /> No, I used a different approach</label>
          </fieldset>
          {reasoning && <p role="status">{reasoning === 'confirmed'
            ? hypothesis.confirmedFeedback
            : hypothesis.rejectedFeedback}</p>}
        </>
      ) : <p><TeachingProseText content={coaching.explanation} /></p>}
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
