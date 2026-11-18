/// <reference types="vite/client" />
import type { ExecutionRequest, ExecutionResult } from './contracts';

self.onmessage = async ({ data: request }: MessageEvent<ExecutionRequest>) => {
  const start = performance.now();
  const result: ExecutionResult = {
    schemaVersion: '1.0', requestId: request.requestId, runtimeVersion: request.runtimeVersion,
    status: 'completed', stdout: '', stderr: '', durationMs: 0,
  };
  const encoder = new TextEncoder();
  let remaining = request.limits.outputBytes;
  let outputLimited = false;
  function capture(channel: 'stdout' | 'stderr', line: string) {
    const bytes = encoder.encode(line + '\n');
    result[channel] += new TextDecoder().decode(bytes.subarray(0, remaining));
    if (bytes.length > remaining) {
      outputLimited = true;
      remaining = 0;
      throw new Error('Python exceeded the output limit.');
    }
    remaining -= bytes.length;
  }

  try {
    const indexURL = new URL(import.meta.env.BASE_URL + 'python/', self.location.origin);
    const loaderURL = new URL('pyodide.mjs', indexURL).href;
    const { loadPyodide }: typeof import('pyodide') = await import(/* @vite-ignore */ loaderURL);
    const python = await loadPyodide({
      indexURL: indexURL.href,
      jsglobals: Object.create(null),
      stdout: (line) => capture('stdout', line),
      stderr: (line) => capture('stderr', line),
    });
    self.postMessage({ ready: true });
    const namespace = python.toPy({});
    try {
      python.runPython(request.source, { globals: namespace, filename: 'exercise.py' });
      if (request.entryPoint) {
        namespace.set('_enntor_args_json', JSON.stringify(request.input ?? []));
        const serialized = python.runPython(
          `import json as _enntor_json\n_enntor_json.dumps(${request.entryPoint}(*_enntor_json.loads(_enntor_args_json)), allow_nan=False)`,
          { globals: namespace, filename: 'check.py' },
        );
        if (serialized.length > request.limits.outputBytes) {
          outputLimited = true;
          throw new Error('Python exceeded the return value limit.');
        }
        result.value = JSON.parse(serialized);
      }
    } finally {
      namespace.destroy();
    }
  } catch (error) {
    result.status = outputLimited ? 'resource-limit' : 'error';
    result.error = { message: String(error).slice(0, 4000) };
  }
  result.durationMs = performance.now() - start;
  self.postMessage({ result });
};
