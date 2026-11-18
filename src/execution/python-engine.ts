import type { ExecutionEngine, ExecutionResult } from './contracts';
import { pythonEngineId, pythonVersion } from './python-config';

export const pythonEngine: ExecutionEngine = {
  id: pythonEngineId,
  execute(request, signal) {
    const start = performance.now();
    const failure = (status: ExecutionResult['status'], message: string): ExecutionResult => ({
      schemaVersion: '1.0', requestId: request.requestId, runtimeVersion: pythonVersion,
      status, stdout: '', stderr: '', error: { message }, durationMs: performance.now() - start,
    });
    if (signal.aborted) return Promise.resolve(failure('cancelled', 'Execution stopped.'));
    if (request.language !== 'python' || request.engineId !== pythonEngineId ||
        request.runtimeVersion !== pythonVersion ||
        (request.entryPoint && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(request.entryPoint))) {
      return Promise.resolve(failure('error', 'Unsupported Python execution configuration.'));
    }

    return new Promise((resolve) => {
      let worker: Worker;
      try {
        worker = new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
      } catch {
        resolve(failure('error', 'Could not start the Python worker.'));
        return;
      }
      let timer = window.setTimeout(() => finish(failure('timeout', 'Python took too long to load.')), 30_000);
      const stop = () => finish(failure('cancelled', 'Execution stopped.'));
      function finish(result: ExecutionResult) {
        window.clearTimeout(timer);
        signal.removeEventListener('abort', stop);
        worker.terminate();
        resolve(result);
      }
      signal.addEventListener('abort', stop, { once: true });
      worker.onmessage = ({ data }: MessageEvent<{ ready?: true; result?: ExecutionResult }>) => {
        if (data.result) finish(data.result);
        else if (data.ready) {
          window.clearTimeout(timer);
          timer = window.setTimeout(
            () => finish(failure('timeout', 'Execution exceeded the time limit.')),
            request.limits.timeoutMs,
          );
        }
      };
      worker.onerror = () => finish(failure('error', 'The Python worker could not load or stopped unexpectedly.'));
      worker.postMessage(request);
    });
  },
};
