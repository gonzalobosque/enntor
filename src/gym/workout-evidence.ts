import type { ContentReference, HintLevel } from '../courses/contracts';
import type { Submission, Sweat } from '../learning/evidence';
import type { Diagnostic } from '../execution/diagnostics';
import type { Recommendation } from './recommendation';

interface WorkoutRecord {
  schemaVersion: 1;
  origin: 'gym';
  conceptId: string;
  exercise: ContentReference;
  sessionId?: string;
}

export interface WorkoutSession extends WorkoutRecord {
  kind: 'session';
  id: string;
  startedAt: string;
  legacyDraft?: boolean;
  completion?: {
    at: string;
    attemptIds: string[];
    outcome: 'passed' | 'not-passed';
    evidenceId: string;
    sweat: Sweat;
  };
}

export interface WorkoutHint extends WorkoutRecord {
  kind: 'hint';
  id: string;
  level: HintLevel;
  at: string;
}

export interface WorkoutWarmUp extends WorkoutRecord {
  kind: 'warm-up';
  id: string;
  warmUpId: string;
  decision: 'opened' | 'completed' | 'skipped';
  opened: boolean;
  at: string;
}

export interface WorkoutCoaching {
  observation: Diagnostic['observation'];
  hypothesis?: Diagnostic['hypothesis'];
  exposure?: Diagnostic['nudge'] & { shownAt: string };
  response?: { answer: 'confirmed' | 'rejected'; at: string };
}

export interface WorkoutAttempt extends WorkoutRecord {
  kind: 'attempt';
  submission: Submission;
  activity?: 'warm-up' | 'practice' | 'transfer';
  recommendation: { reason: Recommendation['reason']; evidenceIds: string[] };
  independent: boolean;
  seenInEarlierWorkout?: boolean;
  warmUpRecordId?: string;
  nudgeAttemptIds?: string[];
  coaching?: WorkoutCoaching;
  correctedAttemptIds?: string[];
}

export type GymRecord = WorkoutSession | WorkoutHint | WorkoutWarmUp | WorkoutAttempt;

const prefix = 'enntor.gym.v1.';

export function recordId(record: GymRecord) {
  return record.kind === 'attempt' ? record.submission.id : record.id;
}

export class GymRecordConflict extends Error {}

export function saveGymRecord(record: GymRecord, expected?: GymRecord) {
  const key = prefix + recordId(record);
  if (localStorage.getItem(key) !== (expected ? JSON.stringify(expected) : null)) {
    throw new GymRecordConflict('Gym evidence changed since it was loaded.');
  }
  localStorage.setItem(key, JSON.stringify(record));
}

export function readGymRecords(): GymRecord[] {
  const records: GymRecord[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(prefix)) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const record: GymRecord = JSON.parse(raw);
    if (record.schemaVersion !== 1 || record.origin !== 'gym' ||
        !record.exercise?.id || !record.exercise.version || typeof record.conceptId !== 'string' ||
        !['session', 'hint', 'warm-up', 'attempt'].includes(record.kind) || prefix + recordId(record) !== key ||
        (record.kind === 'attempt' && (!record.submission.exercise?.id ||
          !Array.isArray(record.submission.hints) || typeof record.submission.source !== 'string' ||
          typeof record.submission.startedAt !== 'string' ||
          (record.submission.grade && !Array.isArray(record.submission.grade.evidence)) ||
          (record.submission.runs && !Array.isArray(record.submission.runs))))) {
      throw new Error('Invalid Gym evidence.');
    }
    records.push(record);
  }
  return records;
}

export function mergeGymRecord(records: GymRecord[], record: GymRecord) {
  return [...records.filter((existing) => recordId(existing) !== recordId(record)), record];
}
