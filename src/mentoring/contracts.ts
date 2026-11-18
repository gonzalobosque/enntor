import type { ContentReference, HintLevel } from '../courses/contracts';

/** Request boundary for a future tutor. No provider or network calls exist. */
export interface MentoringRequest {
  schemaVersion: '1.0';
  task: 'explain' | 'review-reasoning' | 'generate-supplement';
  lesson: ContentReference;
  exercise?: ContentReference;
  learnerConsentId: string;
  relevantAttemptIds: string[];
  allowedHintLevel: HintLevel;
  difficulty: 'routine' | 'complex';
  qualityRequirement: 'standard' | 'high';
}

export interface MentoringFeedback {
  schemaVersion: '1.0';
  observation: string;
  evidenceIds: string[];
  plausibleMisconception?: string;
  nextStep: string;
  hintLevel: HintLevel;
  /** Supplementary AI material must be explicitly reviewed before promotion. */
  provenance: 'ai-supplement';
}
