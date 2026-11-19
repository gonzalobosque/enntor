import { useEffect, useRef, useState } from 'react';
import { readEvidence } from '../learning/evidence';
import { f01Observations } from './f01-observations';
import { mergeGymRecord, readGymRecords, recordId, saveGymRecord } from './workout-evidence';
import type { GymRecord } from './workout-evidence';

function load() {
  let records: GymRecord[] = [];
  let unreadable = false;
  try {
    records = readGymRecords();
  } catch {
    unreadable = true;
  }
  try {
    const sessions = readEvidence({ id: 'F01.01', version: '' });
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
  const unsaved = useRef<GymRecord[]>([]);

  function write(record: GymRecord) {
    let saved = false;
    try {
      saveGymRecord(record);
      saved = true;
      unsaved.current = unsaved.current.filter((item) => recordId(item) !== recordId(record));
      setLoaded(load());
    } catch {
      unsaved.current = mergeGymRecord(unsaved.current, record);
    }
    setPending(unsaved.current);
    return saved;
  }

  function retry() {
    for (const record of unsaved.current) write(record);
    setLoaded(load());
  }

  return { ...loaded, pending, write, retry };
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
