import type { ContentReference } from '../courses/contracts';

export interface TraceCheck extends ContentReference {
  title: string;
  prompt: string;
  source: string;
  columns: string[];
  rows: { label: string; expected: string[] }[];
  help: { concept: string; guidance: string; worked: string[] };
  mistake?: { id: string; message: string; cells: { row: number; column: number; value: string }[] };
}

export function gradeTrace(check: TraceCheck, input: string[][]) {
  const answers = input.map(row => row.map(answer => answer.trim().toLowerCase()));
  const missed = check.rows.flatMap(({ expected }, row) => expected.flatMap((value, column) =>
    answers[row]?.[column] === value ? [] : [{ row, column }]));
  const mistake = check.mistake;
  const pattern = missed.length > 0 && mistake?.cells.every(({ row, column, value }) => answers[row]?.[column] === value)
    ? mistake.id : undefined;
  return { answers, missed, correct: missed.length === 0, pattern };
}

export interface TraceAttempt extends ReturnType<typeof gradeTrace> {
  id: string;
  check: ContentReference;
  at: string;
  seenBefore?: boolean;
}

export function traceAttempts(attempts: TraceAttempt[] = [], check: ContentReference) {
  return attempts.filter(item => item.check.id === check.id && item.check.version === check.version);
}

export type TraceHelpLevel = 'concept' | 'guidance' | 'worked';
export const traceHelpOrder: TraceHelpLevel[] = ['concept', 'guidance', 'worked'];

export interface TraceHelpExposure {
  check: ContentReference;
  level: TraceHelpLevel;
  at: string;
}

export function traceHelpFor(exposures: TraceHelpExposure[] = [], check: ContentReference) {
  return exposures.filter(item => item.check.id === check.id && item.check.version === check.version).map(item => item.level);
}
