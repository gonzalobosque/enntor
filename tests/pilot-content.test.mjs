import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { loadPyodide } from 'pyodide';

test('F01.01 starter is unsolved and the reference passes the required cases', async () => {
  const vite = await createServer({ server: { middlewareMode: true, ws: false } });
  try {
    const { loadPilot } = await vite.ssrLoadModule('/src/courses/load-pilot.ts');
    const { modification } = loadPilot();
    const python = await loadPyodide();
    const cases = modification.grading.publicCases;
    function runCases(source) {
      return cases.map(({ input }) => {
        const namespace = python.toPy({});
        try {
          namespace.set('case_arguments', JSON.stringify(input));
          python.runPython(source, { globals: namespace });
          return python.runPython(
            `import json\n${modification.execution.entryPoint}(*json.loads(case_arguments))`,
            { globals: namespace },
          );
        } finally {
          namespace.destroy();
        }
      });
    }
    const expected = cases.map(({ expected: value }) => value);
    assert.notDeepEqual(runCases(modification.starterCode), expected);
    assert.deepEqual(runCases('def total(base, extra):\n    return (base + extra) * 3'), expected);
  } finally {
    await vite.close();
  }
});
