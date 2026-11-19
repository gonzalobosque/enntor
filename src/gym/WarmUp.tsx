import type { ReactNode } from 'react';
import { TeachingProseText } from '../learning/TeachingText';
import type { Exercise, TeachingProse } from '../courses/contracts';
import type { Recommendation } from './recommendation';

export interface WarmUpContent {
  id: string;
  title: string;
  refresher: TeachingProse;
  simpleCase: TeachingProse;
  focus: Partial<Record<Recommendation['reason'], string>>;
  guidedExercise?: Exercise;
  structureExample?: string;
}

const formats = { predict: 'reflect', modify: 'structure', build: 'scaffold', make: 'modify' } as const;

export function warmUpFormat(upcoming: keyof typeof formats) {
  return formats[upcoming];
}

export function WarmUp({ content, reason, format, opened, passed, busy, revisiting, children, onOpen, onFinish }: {
  content: WarmUpContent; reason: Recommendation['reason']; format: ReturnType<typeof warmUpFormat>;
  opened: boolean; passed: boolean; busy: boolean; revisiting: boolean; children?: ReactNode;
  onOpen: () => void; onFinish: (decision: 'completed' | 'skipped') => void;
}) {
  const executable = (format === 'modify' || format === 'scaffold') && !!content.guidedExercise;
  return <section className="pilot-section" aria-labelledby="gym-warmup">
    <h2 className="pilot-stage-heading" id="gym-warmup">Warm-up</h2>
    {opened ? <>
      <h3 className="pilot-exercise-heading">{content.title}</h3>
      {content.focus[reason] && <p>{content.focus[reason]}</p>}
      <p><TeachingProseText content={content.refresher} /></p>
      <p><TeachingProseText content={content.simpleCase} /></p>
      {format === 'structure' && content.structureExample && <pre>{content.structureExample}</pre>}
      {executable && children}
    </> : <p>Review the concept before writing code, or go straight to practice.</p>}
    <div className="pilot-controls">
      {(!opened || !executable || passed) &&
        <button className="pilot-primary" disabled={busy} onClick={opened ? () => onFinish('completed') : onOpen}>
          {opened ? 'Complete warm-up' : revisiting ? 'Revisit warm-up' : 'Open warm-up'}
        </button>}
      {(opened || !revisiting) && <button disabled={busy} onClick={() => onFinish('skipped')}>Skip warm-up</button>}
    </div>
  </section>;
}
