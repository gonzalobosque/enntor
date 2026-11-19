import { useEffect, useRef, useState } from 'react';
import { readEvidence } from '../learning/evidence';
import { f01Observations } from './f01-observations';
import { GymRecordConflict, readGymRecords, recordId, saveGymRecord } from './workout-evidence';
import type { GymRecord, WorkoutAttempt } from './workout-evidence';

function load() {
  let records: GymRecord[] = [];
  let unreadable = false;
  try {
    records = readGymRecords();
  } catch {
    unreadable = true;
  }
  try {
    const sessions = readEvidence({ id: 'F01.01', version: '' }, 'python-ai-pilot');
    const observations = f01Observations(sessions, records);
    const rating = sessions.find(({ completion }) => completion && completion.sweat !== null)?.completion?.sweat;
    return { records, observations, rating, unreadable };
  } catch {
    return { records, observations: f01Observations([], records), rating: undefined, unreadable: true };
  }
}

export function useWorkoutEvidence() {
  const [loaded, setLoaded] = useState(load);
  const [pending, setPending] = useState<GymRecord[]>([]);
  const [conflict, setConflict] = useState(false);
  // Both callbacks for an async check can close over the render before it began.
  const startedAttempts = useRef(new Map<string, WorkoutAttempt>());
  const unsaved = useRef(new Map<string, { record: GymRecord; expected?: GymRecord }>());

  function persist(record: GymRecord, expected?: GymRecord) {
    const id = recordId(record);
    let saved = false;
    try {
      saveGymRecord(record, expected);
      unsaved.current.delete(id);
      if (record.kind === 'attempt' && !record.submission.finishedAt) startedAttempts.current.set(id, record);
      setLoaded(load());
      saved = true;
    } catch (error) {
      if (error instanceof GymRecordConflict) {
        unsaved.current.delete(id);
        setConflict(true);
        setLoaded(load());
      } else {
        unsaved.current.set(id, { record, expected });
      }
    }
    setPending([...unsaved.current.values()].map(({ record }) => record));
    return saved;
  }

  function write(record: GymRecord) {
    const id = recordId(record);
    const waiting = unsaved.current.get(id);
    const expected = waiting ? waiting.expected
      : startedAttempts.current.get(id) ?? loaded.records.find((item) => recordId(item) === id);
    if (record.kind === 'attempt' && record.submission.finishedAt) startedAttempts.current.delete(id);
    return persist(record, expected);
  }

  function retry() {
    for (const { record, expected } of [...unsaved.current.values()]) persist(record, expected);
    setLoaded(load());
  }

  return { ...loaded, pending, conflict, dismissConflict: () => setConflict(false), write, retry };
}

export function useWorkoutExitGuard(blocked: boolean) {
  useEffect(() => {
    if (!blocked) return;
    const prevent = (event: Event) => event.preventDefault();
    window.addEventListener('enntor:before-route-change', prevent);
    window.addEventListener('beforeunload', prevent);
    return () => {
      window.removeEventListener('enntor:before-route-change', prevent);
      window.removeEventListener('beforeunload', prevent);
    };
  }, [blocked]);
}
