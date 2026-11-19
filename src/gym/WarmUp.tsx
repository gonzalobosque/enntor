import { TeachingProseText } from '../learning/TeachingText';
import type { TeachingProse } from '../courses/contracts';
import type { Recommendation } from './recommendation';

export interface WarmUpContent {
  id: string;
  title: string;
  refresher: TeachingProse;
  simpleCase: TeachingProse;
  focus: Partial<Record<Recommendation['reason'], string>>;
}

export function WarmUp({ content, reason, opened, onOpen, onFinish }: {
  content: WarmUpContent; reason: Recommendation['reason']; opened: boolean;
  onOpen: () => void; onFinish: (decision: 'completed' | 'skipped') => void;
}) {
  return <section className="pilot-section" aria-labelledby="gym-warmup">
    <h2 className="pilot-stage-heading" id="gym-warmup">Warm-up</h2>
    {opened ? <>
      <h3 className="pilot-exercise-heading">{content.title}</h3>
      {content.focus[reason] && <p>{content.focus[reason]}</p>}
      <p><TeachingProseText content={content.refresher} /></p>
      <p><TeachingProseText content={content.simpleCase} /></p>
    </> : <p>Take a moment to review the concept before writing code.</p>}
    <div className="pilot-controls">
      <button className="pilot-primary" onClick={opened ? () => onFinish('completed') : onOpen}>
        {opened ? 'Complete warm-up' : 'Open warm-up'}
      </button>
      <button onClick={() => onFinish('skipped')}>Skip warm-up</button>
    </div>
  </section>;
}
