import { Fragment } from 'react';
import type { TeachingBlock, TeachingProse } from '../courses/contracts';

export function TeachingProseText({ content }: { content: TeachingProse }) {
  if (typeof content === 'string') return content;
  return content.map((part, index) => (
    <Fragment key={index}>
      {typeof part === 'string' ? part : ['variable', 'label', 'emphasis'].includes(part.role) ? <strong className={`teaching-${part.role}`}>{part.text}</strong> : <code className={`teaching-${part.role}`}>{part.text}</code>}
    </Fragment>
  ));
}

export function TeachingText({ block }: { block: TeachingBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p><TeachingProseText content={block.content} /></p>;
    case 'warning':
      return <aside className="teaching-warning"><span aria-hidden="true">⚠</span>
        <p><strong>Common pitfall.</strong> <TeachingProseText content={block.content} /></p>
      </aside>;
    case 'explanation':
      return <p>{block.markdown}</p>;
    case 'worked-example':
      return <div><pre>{block.code}</pre><p><TeachingProseText content={block.explanation} /></p></div>;
  }
}
