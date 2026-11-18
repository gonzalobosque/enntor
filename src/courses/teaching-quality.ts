import type { TeachingProse } from './contracts';

/** Checks explicitly tagged names against the symbols introduced for a specific activity. */
export function unknownTeachingNames(prose: TeachingProse, introduced: Iterable<string>): string[] {
  if (typeof prose === 'string') return [];
  const known = new Set(introduced);
  return prose.flatMap((part) => {
    if (typeof part === 'string' || part.role === 'code') return [];
    const name = part.role === 'function' ? part.text.replace(/\(\)$/, '') : part.text;
    return known.has(name) ? [] : [name];
  });
}

/** Lightweight token inventory for small authored examples. Review actual introductions manually. */
export function exampleNames(source: string): string[] {
  return source.match(/[A-Za-z_][A-Za-z0-9_]*/g) ?? [];
}
