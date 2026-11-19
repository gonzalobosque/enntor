/** Evidence grouped by activity. A pass addresses earlier misses on that activity. */
export interface PracticeObservation {
  id: string;
  source: 'climb' | 'gym';
  activity: string;
  at: string;
  result: 'miss' | 'pass';
  independent?: boolean;
  assisted?: boolean;
  description: string;
}

export interface Recommendation {
  reason: 'insufficient' | 'reinforce' | 'repeated-errors' | 'try-unaided' | 'independent-practice';
  evidence: PracticeObservation[];
}

export function recommendPractice(observations: PracticeObservation[]): Recommendation {
  const unique = new Map(observations.map((observation) => [observation.id, observation]));
  const ordered = [...unique.values()].sort((a, b) => a.at.localeCompare(b.at));
  const open = new Map<string, PracticeObservation[]>();
  for (const item of ordered) {
    if (item.result === 'pass') open.delete(item.activity);
    else open.set(item.activity, [...(open.get(item.activity) ?? []), item]);
  }

  const repeated = [...open.values()].filter((items) => items.length >= 2)
    .sort((a, b) => b[b.length - 1].at.localeCompare(a[a.length - 1].at))[0];
  const independent = ordered.filter((item) => item.independent).at(-1);
  const recent = ordered[ordered.length - 1];
  if (!recent) return { reason: 'insufficient', evidence: [] };
  if (recent.source === 'gym' && recent.result === 'pass' && recent.assisted) {
    return { reason: 'try-unaided', evidence: [recent, ...(repeated ?? [])] };
  }
  if (repeated && (!independent || independent.at <= repeated[repeated.length - 1].at)) {
    return { reason: 'repeated-errors', evidence: repeated };
  }
  if (recent.assisted && recent.result === 'pass') {
    return { reason: 'try-unaided', evidence: [recent] };
  }
  if (independent?.source === 'gym' && recent.result === 'pass') {
    return { reason: 'independent-practice', evidence: [independent] };
  }
  const priorMiss = ordered.filter((item) => item.result === 'miss').at(-1);
  const supporting = [recent, independent, recent.result === 'pass' ? priorMiss : undefined];
  return { reason: 'reinforce', evidence: supporting.filter((item, index): item is PracticeObservation =>
    item !== undefined && supporting.indexOf(item) === index) };
}
