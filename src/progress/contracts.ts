import type { ContentReference, HintLevel } from '../courses/contracts';
import type { GradeResult } from '../execution/contracts';

/** Historical evidence retains the original content and runtime revisions. */
export interface Attempt {
  schemaVersion: '1.0';
  id: string;
  learnerId: string;
  coursePack: ContentReference;
  lesson: ContentReference;
  exercise: ContentReference;
  source: string;
  runtimeVersion: string;
  grade: GradeResult;
  hintLevels: HintLevel[];
  independent: boolean;
  createdAt: string;
}

export interface MistakeRecord {
  schemaVersion: '1.0';
  id: string;
  learnerId: string;
  attemptIds: string[];
  conceptIds: string[];
  observation: string;
  evidenceIds: string[];
  hypothesis?: { explanation: string; confidence: number; status: 'provisional' | 'supported' | 'disputed' | 'resolved' };
}
