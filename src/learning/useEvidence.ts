import { useRef, useState } from 'react';
import type { ContentReference } from '../courses/contracts';
import { now, readEvidence, writeEvidence } from './evidence';
import type { LessonEvidence } from './evidence';

function newEvidence(pack: ContentReference, lesson: ContentReference, legacyDrafts: boolean): LessonEvidence {
  const at = now();
  return { schemaVersion: 1, id: crypto.randomUUID(), pack, lesson, legacyDrafts,
    startedAt: at, updatedAt: at, followUps: [], hints: [], submissions: [] };
}

export function useEvidence(pack: ContentReference, lesson: ContentReference) {
  const [initial] = useState(() => {
    try {
      const history = readEvidence(lesson);
      const current = history[0];
      return { history, current, error: false };
    } catch {
      return { history: [], current: undefined, error: true };
    }
  });
  const [session, setSession] = useState(() => initial.current ?? newEvidence(pack, lesson, !initial.history.length));
  const current = useRef(session);
  const persisted = useRef(initial.current);
  const [history, setHistory] = useState(initial.history);
  const [error, setError] = useState(initial.error);

  function save(next = current.current, requireDurable = false) {
    try {
      writeEvidence(next, persisted.current);
      persisted.current = next;
      setHistory((old) => [next, ...old.filter(({ id }) => id !== next.id)]);
      setError(false);
    } catch {
      setError(true);
      if (requireDurable) return false;
      current.current = next;
      setSession(next);
      return false;
    }
    current.current = next;
    setSession(next);
    return true;
  }

  function update(change: (previous: LessonEvidence) => LessonEvidence, requireDurable = false) {
    if (current.current.completion) return false;
    return save({ ...change(current.current), updatedAt: now() }, requireDurable);
  }

  function startAgain() {
    if (!save()) return;
    const next = newEvidence(pack, lesson, false);
    try {
      writeEvidence(next);
      persisted.current = next;
      current.current = next;
      setSession(next);
      setHistory((old) => [next, ...old]);
    } catch {
      setError(true);
    }
  }

  return { session, history, error, update, save, startAgain };
}
