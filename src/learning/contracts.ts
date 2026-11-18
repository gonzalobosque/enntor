import type { ContentReference } from '../courses/contracts';

/** Progression consumes versioned authored rules and recorded evidence. */
export interface LessonProgress {
  schemaVersion: '1.0';
  learnerId: string;
  coursePack: ContentReference;
  lesson: ContentReference;
  stageId?: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed' | 'needs-support';
  evidenceAttemptIds: string[];
  updatedAt: string;
}
