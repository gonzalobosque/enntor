import type { ContentReference, JsonValue } from '../courses/contracts';

export interface ExecutionRequest {
  schemaVersion: '1.0';
  requestId: string;
  exercise: ContentReference;
  engineId: string;
  runtimeVersion: string;
  language: string;
  source: string;
  entryPoint?: string;
  input?: JsonValue;
  observeArguments?: boolean;
  limits: { timeoutMs: number; memoryMb: number; outputBytes: number };
}

export interface ExecutionResult {
  schemaVersion: '1.0';
  requestId: string;
  runtimeVersion: string;
  status: 'completed' | 'error' | 'timeout' | 'cancelled' | 'resource-limit';
  stdout: string;
  stderr: string;
  value?: JsonValue;
  argumentsAfter?: JsonValue[];
  invalidTypes?: ('return' | 'arguments')[];
  error?: { message: string; line?: number; traceback?: string };
  durationMs: number;
}

/** Runtime adapters must enforce limits and stop work when the signal aborts.
 * A worker alone does not establish a hostile-code security boundary.
 */
export interface ExecutionEngine {
  id: string;
  execute(request: ExecutionRequest, signal: AbortSignal): Promise<ExecutionResult>;
}

/** Grading is separate from execution. The AI cannot set this verdict. */
export interface GradeResult {
  schemaVersion: '1.0';
  exercise: ContentReference;
  grader: ContentReference;
  verdict: 'passed' | 'failed' | 'ungraded';
  evidence: { id: string; passed: boolean; message: string }[];
}
