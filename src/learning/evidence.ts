import type { ContentReference, HintLevel } from '../courses/contracts';
import type { ExecutionResult, GradeResult } from '../execution/contracts';

export const sweatChoices = [
  ['Nah, piece of cake!', 1],
  ['Just a little droplet', 0.5],
  ['Crunched my brain a little', 0],
  ['Almost gave me a nosebleed', -0.5],
  ['O_O', -1],
] as const;
export type Sweat = typeof sweatChoices[number][1] | null;

export interface Submission {
  id: string;
  exercise: ContentReference;
  source: string;
  hints: HintLevel[];
  priorPass: boolean;
  seenBefore?: boolean;
  startedAt: string;
  finishedAt?: string;
  elapsedMs?: number;
  grade?: GradeResult;
  runs?: ExecutionResult[];
}

export interface LessonEvidence {
  schemaVersion: 1;
  id: string;
  pack: ContentReference;
  lesson: ContentReference;
  startedAt: string;
  updatedAt: string;
  legacyDrafts: boolean;
  learnedAt?: string;
  buildPlan?: { choice: string; correct: boolean; at: string };
  buildChecks?: { choice: string; correct: boolean; at: string }[];
  transferOpenedAt?: string;
  sweat?: Sweat;
  prediction?: {
    id: string; exercise: ContentReference; answer: string; committedAt: string;
    runs: ExecutionResult[]; hypothesis?: string;
    reasoning?: 'confirmed' | 'rejected';
  };
  followUps: { id: string; answer: string; expected: number; correct: boolean; at: string }[];
  hints: { exercise: ContentReference; level: HintLevel; at: string }[];
  submissions: Submission[];
  completion?: { at: string; sweat: Sweat; modifyId: string; buildId?: string; makeId: string; independent: boolean };
}

const prefix = 'enntor.evidence.v1.';
export const now = () => new Date().toISOString();

export function readEvidence(lesson: ContentReference, packId?: string): LessonEvidence[] {
  return readPackEvidence(packId).filter((value) => value.lesson.id === lesson.id);
}

export function readPackEvidence(packId?: string): LessonEvidence[] {
  const sessions: LessonEvidence[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key?.startsWith(prefix)) continue;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const value: LessonEvidence = JSON.parse(raw);
    if (value.schemaVersion !== 1 || prefix + value.id !== key ||
        !Array.isArray(value.submissions) || !Array.isArray(value.hints) ||
        !Array.isArray(value.followUps)) throw new Error('Invalid local evidence.');
    if (packId === undefined || value.pack.id === packId) sessions.push(value);
  }
  return sessions.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export function writeEvidence(session: LessonEvidence, expected?: LessonEvidence) {
  const key = prefix + session.id;
  const old = localStorage.getItem(key);
  if (old !== (expected ? JSON.stringify(expected) : null)) {
    throw new Error('This session was changed in another tab.');
  }
  localStorage.setItem(key, JSON.stringify(session));
}

export const hasSolutionHelp = (hints: HintLevel[]) => hints.some((level) => level === 'H3' || level === 'H4');

export function learningState(session: LessonEvidence, modify: string, make: string, transfer: string, build?: string, freshTransferOnly = false) {
  const prediction = session.prediction?.runs.find((run) => run.status === 'completed');
  const investigated = !!prediction && (Number(prediction.stdout.trim()) === Number(session.prediction?.answer) ||
    session.followUps.some(({ correct }) => correct));
  const modified = session.submissions.find((item) => item.exercise.id === modify && item.grade?.verdict === 'passed');
  const buildPass = session.submissions.find((item) => item.exercise.id === build && item.grade?.verdict === 'passed');
  const built = !build || (!!session.buildPlan?.correct && !!buildPass);
  const made = session.submissions.filter((item) =>
    [make, transfer].includes(item.exercise.id) && item.grade?.verdict === 'passed');
  const independent = made.find((item) => item.hints.length === 0 && !item.priorPass && !item.seenBefore);
  const qualifying = independent ?? made.find((item) => !hasSolutionHelp(item.hints) && (!freshTransferOnly || item.exercise.id === make));
  return { prediction, investigated, modified, built, buildPass, made, independent, qualifying,
    activitiesComplete: !!(session.learnedAt && investigated && modified && built && made.length),
    canFinish: !!(session.learnedAt && investigated && modified && built && qualifying) };
}

export function finalizeEvidence(session: LessonEvidence, state: ReturnType<typeof learningState>): LessonEvidence {
  if (session.completion || !state.canFinish || !state.modified || !state.qualifying) return session;
  const at = now();
  return { ...session, updatedAt: at, completion: {
    at, sweat: session.sweat ?? null, modifyId: state.modified.id, buildId: state.buildPass?.id,
    makeId: state.qualifying.id, independent: !!state.independent,
  } };
}

export function withSweatRating(session: LessonEvidence, sweat: Sweat): LessonEvidence {
  if (!session.completion || session.completion.sweat === sweat) return session;
  return { ...session, updatedAt: now(), sweat, completion: { ...session.completion, sweat } };
}
