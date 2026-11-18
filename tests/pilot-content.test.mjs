import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { loadPyodide } from 'pyodide';

test('F01.01 starter is unsolved and the reference passes the required cases', async () => {
  const vite = await createServer({ server: { middlewareMode: true, ws: false } });
  try {
    const { loadPilot } = await vite.ssrLoadModule('/src/courses/load-pilot.ts');
    const { modification, make, transfer } = loadPilot();
    const python = await loadPyodide();
    const references = [
      [modification, 'def total(base, extra):\n    return (base + extra) * 3'],
      [make, 'def receipt(tickets, price):\n    return tickets * price + 4'],
      [transfer, 'def adjust_score(score, penalty):\n    return score * 2 - penalty'],
    ];
    for (const [exercise, reference] of references) {
      const cases = exercise.grading.publicCases;
      function runCases(source) {
        return cases.map(({ input }) => {
          const namespace = python.toPy({});
          try {
            namespace.set('case_arguments', JSON.stringify(input));
            python.runPython(source, { globals: namespace });
            return python.runPython(
              `import json\n${exercise.execution.entryPoint}(*json.loads(case_arguments))`,
              { globals: namespace },
            );
          } catch (error) {
            if (String(error).includes('NameError:')) return undefined;
            throw error;
          } finally {
            namespace.destroy();
          }
        });
      }
      const expected = cases.map(({ expected: value }) => value);
      assert.notDeepEqual(runCases(exercise.starterCode), expected, exercise.id);
      assert.deepEqual(runCases(reference), expected, exercise.id);
    }
  } finally {
    await vite.close();
  }
});
