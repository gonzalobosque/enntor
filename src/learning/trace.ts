import type { ContentReference, TeachingProse } from '../courses/contracts';

export interface TraceCheck extends ContentReference {
  title: string;
  prompt: TeachingProse;
  labelChoices?: { column: number; options: string[] };
  source: string;
  columns: string[];
  rows: { label: string; expected: string[] }[];
  help: { concept: TeachingProse; guidance: TeachingProse; worked: TeachingProse[] };
  mistake?: { id: string; message: TeachingProse; cells: { row: number; column: number; value: string }[] };
}

export function gradeTrace(check: TraceCheck, input: string[][]) {
  const answers = input.map(row => row.map(answer => answer.trim().toLowerCase()));
  const missed = check.rows.flatMap(({ expected }, row) => expected.flatMap((value, column) =>
    answers[row]?.[column] === value ? [] : [{ row, column }]));
  const labels = check.labelChoices;
  const format = labels ? check.rows.flatMap((_, row) =>
    labels.options.some(option => option.toLowerCase() === answers[row]?.[labels.column]) ? [] : [{ row, column: labels.column }]) : [];
  const mistake = check.mistake;
  const pattern = !format.length && missed.length > 0 && mistake?.cells.every(({ row, column, value }) => answers[row]?.[column] === value)
    ? mistake.id : undefined;
  return { answers, missed, correct: !format.length && missed.length === 0, pattern, ...(format.length ? { format } : {}) };
}

export interface TraceAttempt extends ReturnType<typeof gradeTrace> {
  id: string;
  check: ContentReference;
  at: string;
  seenBefore?: boolean;
  presentationEdition?: string;
}

export function traceAttempts(attempts: TraceAttempt[] = [], check: ContentReference) {
  return attempts.filter(item => item.check.id === check.id && item.check.version === check.version);
}

export type TraceHelpLevel = 'concept' | 'guidance' | 'worked';
export const traceHelpOrder: TraceHelpLevel[] = ['concept', 'guidance', 'worked'];

export interface TraceHelpExposure {
  check: ContentReference;
  level: TraceHelpLevel;
  presentationEdition?: string;
  at: string;
}

export function traceHelpFor(exposures: TraceHelpExposure[] = [], check: ContentReference) {
  return exposures.filter(item => item.check.id === check.id && item.check.version === check.version).map(item => item.level);
}
