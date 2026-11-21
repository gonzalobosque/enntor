import type { Exercise, HintLevel } from '../courses/contracts';
import { hasSolutionHelp } from './evidence';
import { TeachingProseText } from './TeachingText';

export function ExerciseHints({ hints, revealed, busy, allowAssistedFinish, onReveal }: {
  hints: Exercise['hints']; revealed: HintLevel[]; busy: boolean;
  allowAssistedFinish?: boolean; onReveal: (level: HintLevel) => void;
}) {
  const next = hints.find(({ level }) => !revealed.includes(level));
  const visible = hints.filter(({ level }) => revealed.includes(level));
  const solution = next && hasSolutionHelp([next.level]);
  return <>
    {visible.map(({ level, text, solutionCode }) => (
      <div className="pilot-feedback" key={level}>
        <p>{hasSolutionHelp([level]) && <strong>Solution-level help. </strong>}
          <TeachingProseText content={text} /></p>
        {solutionCode && <pre>{solutionCode}</pre>}
      </div>
    ))}
    {next && <div className="pilot-controls">
      <button disabled={busy} onClick={() => onReveal(next.level)}>
        {next.level === 'H4' ? next.solutionCode ? 'Show full solution and explanation' : 'Reveal complete solution' : solution ? 'Reveal implementation hint'
          : visible.length ? 'Another hint' : 'Show hint'}
      </button>
      {solution && <p className="muted">{allowAssistedFinish ? 'Seeing a solution counts as help. You can still pass the checks and finish as practice.'
        : 'Solution-level help. Independent skill requires a fresh problem without this help.'}</p>}
    </div>}
  </>;
}
