/** Stable IDs are opaque, namespaced strings (for example python-ai.f01.01).
 * Renaming a title never changes its ID. Version strings use semantic versioning.
 */
export type ContentId = string;
export type ContentVersion = string;
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface ContentReference {
  id: ContentId;
  version: ContentVersion;
}

export type TeachingInline = string | { role: 'function' | 'variable' | 'keyword' | 'code' | 'token' | 'operator' | 'label' | 'emphasis'; text: string };

export type TeachingProse = string | TeachingInline[];

export type TeachingBlock =
  | { id: ContentId; type: 'paragraph' | 'warning'; content: TeachingInline[] }
  | { id: ContentId; type: 'explanation'; markdown: string }
  | { id: ContentId; type: 'worked-example'; language: string; code: string; explanation: TeachingProse };

export interface MentorTip {
  id: ContentId;
  text: string;
  sourceRefs: string[];
}

export interface CoursePack {
  schemaVersion: '1.0';
  id: ContentId;
  version: ContentVersion;
  title: string;
  description: string;
  subject: string;
  language: string;
  modules: Module[];
  lessons: Lesson[];
  exercises: Exercise[];
}

export interface Module {
  id: ContentId;
  version: ContentVersion;
  title: string;
  prerequisites: ContentId[];
  lessonIds: ContentId[];
}

export interface Lesson {
  id: ContentId;
  version: ContentVersion;
  moduleId: ContentId;
  title: string;
  objectives: string[];
  prerequisites: ContentId[];
  estimatedMinutes: number;
  teachingBlocks: TeachingBlock[];
  mentorTips: MentorTip[];
  exerciseIds: ContentId[];
  progression: {
    requiredExerciseIds: ContentId[];
    /** Fresh unaided transfer is required for independent credit after solution help. */
    requiresIndependentTransfer: boolean;
  };
}

export type HintLevel = 'H0' | 'H1' | 'H2' | 'H3' | 'H4';

export interface PublicCase {
  id: string;
  input: JsonValue;
  expected: JsonValue;
  expectedArguments?: JsonValue[];
}

export interface Exercise {
  id: ContentId;
  version: ContentVersion;
  lessonId: ContentId;
  title: string;
  prompt: TeachingProse;
  kind: 'explain' | 'predict' | 'investigate' | 'modify' | 'write' | 'transfer';
  conceptIds: ContentId[];
  difficulty: number;
  starterCode?: string;
  coaching?: { unusedCalculationQuestion?: string };
  hints: { level: HintLevel; text: TeachingProse; solutionCode?: string }[];
  execution?: {
    engineId: string;
    language: string;
    runtimeVersion: string;
    entryPoint?: string;
    allowedDependencies: string[];
    limits: { timeoutMs: number; memoryMb: number; outputBytes: number };
  };
  grading: {
    graderId: string;
    graderVersion: string;
    rubric: string;
    publicCases: PublicCase[];
    /** Reference to trusted fixtures, never a promise of client-side secrecy. */
    fixtureSet?: ContentReference;
    configuration: Record<string, JsonValue>;
  };
}
