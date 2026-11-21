import { useRef, useState } from 'react';
import type { ContentReference } from '../courses/contracts';
import { now, readEvidence, withSweatRating, writeEvidence } from './evidence';
import type { LessonEvidence, Sweat } from './evidence';

function newEvidence(pack: ContentReference, lesson: ContentReference, legacyDrafts: boolean): LessonEvidence {
  const at = now();
  return { schemaVersion: 1, id: crypto.randomUUID(), pack, lesson, legacyDrafts,
    startedAt: at, updatedAt: at, followUps: [], hints: [], submissions: [] };
}

export function useEvidence(pack: ContentReference, lesson: ContentReference, legacyDrafts: boolean, resumableVersions: string[] = []) {
  const [initial] = useState(() => {
    try {
      const history = readEvidence(lesson, pack.id);
      const current = history.find((item) => item.lesson.version === lesson.version || resumableVersions.includes(item.lesson.version) || item.completion);
      return { history, current, error: false };
    } catch {
      return { history: [], current: undefined, error: true };
    }
  });
  const [session, setSession] = useState(() => initial.current ?? newEvidence(pack, lesson, legacyDrafts && !initial.history.length));
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

  function rate(target: LessonEvidence, sweat: Sweat) {
    const rated = withSweatRating(target, sweat);
    if (target === rated) return;
    if (current.current.id === target.id) {
      save(rated, true);
      return;
    }
    try {
      writeEvidence(rated, target);
      setHistory((old) => old.map((item) => item.id === rated.id ? rated : item));
      setError(false);
    } catch {
      setError(true);
    }
  }

  return { session, history, error, update, save, startAgain, rate };
}
