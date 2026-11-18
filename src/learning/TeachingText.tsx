import { Fragment } from 'react';
import type { TeachingBlock, TeachingInline } from '../courses/contracts';

function Inline({ content }: { content: TeachingInline[] }) {
  return content.map((part, index) => (
    <Fragment key={index}>
      {typeof part === 'string' ? part : <code className={`teaching-${part.role}`}>{part.text}</code>}
    </Fragment>
  ));
}

export function TeachingText({ block }: { block: TeachingBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p><Inline content={block.content} /></p>;
    case 'warning':
      return <aside className="teaching-warning"><span aria-hidden="true">⚠</span>
        <p><strong>Common pitfall.</strong> <Inline content={block.content} /></p>
      </aside>;
    case 'explanation':
      return <p>{block.markdown}</p>;
    case 'worked-example':
      return <div><pre>{block.code}</pre><p>{block.explanation}</p></div>;
  }
}
