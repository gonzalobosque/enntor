import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { loadPyodide } from 'pyodide';

test('F01.01 starter is unsolved and the reference passes the required cases', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { loadPilot } = await vite.ssrLoadModule('/src/courses/load-pilot.ts');
    const { modification, build, make, transfer } = loadPilot();
    const python = await loadPyodide();
    const references = [
      [modification, 'def total(base, extra):\n    return (base + extra) * 3'],
      [build, 'def available(capacity, reserved):\n    return capacity * 2 - reserved'],
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

test('worked commentary and activity names stay in scope and scaffolding fades before Make', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { loadPilot } = await vite.ssrLoadModule('/src/courses/load-pilot.ts');
    const { unknownTeachingNames, exampleNames } = await vite.ssrLoadModule('/src/courses/teaching-quality.ts');
    const { predictionCoaching, buildPlan } = await vite.ssrLoadModule('/src/courses/f01-01.ts');
    const { lesson, prediction, modification, build, make, transfer } = loadPilot();
    assert.deepEqual(lesson.progression.requiredExerciseIds,
      [prediction.id, modification.id, build.id, make.id]);
    const learned = new Set(['print']);
    for (const block of lesson.teachingBlocks) {
      if (block.type === 'worked-example') {
        for (const name of exampleNames(block.code)) learned.add(name);
        assert.deepEqual(unknownTeachingNames(block.explanation, learned), []);
      }
      if (block.type === 'paragraph') assert.deepEqual(unknownTeachingNames(block.content, learned), []);
    }
    for (const prose of [predictionCoaching.explanation, predictionCoaching.possibleReasoning, predictionCoaching.actualReasoning]) {
      assert.deepEqual(unknownTeachingNames(prose, exampleNames(prediction.starterCode)), []);
    }
    assert.deepEqual(unknownTeachingNames(buildPlan.prompt, buildPlan.symbols), []);
    assert.deepEqual(unknownTeachingNames(buildPlan.syntax, exampleNames(build.starterCode)), []);
    for (const [exercise, symbols] of [[modification, exampleNames(modification.starterCode)],
      [build, buildPlan.symbols], [make, ['receipt', 'tickets', 'price']], [transfer, ['adjust_score', 'score', 'penalty']]]) {
      for (const prose of [exercise.prompt, ...exercise.hints.map(({ text }) => text)]) {
        assert.deepEqual(unknownTeachingNames(prose, symbols), [], exercise.id);
      }
    }
    assert.deepEqual(modification.hints.map(({ level }) => level), ['H0', 'H1', 'H2', 'H4']);
    for (const { text } of modification.hints.slice(0, -1)) {
      assert.doesNotMatch(JSON.stringify(text), /return \(|parentheses|\* 3/);
    }
    assert.match(build.starterCode, /^def available\(/);
    assert.match(make.starterCode, /^#[^\n]*\n?$/);
    assert.notEqual(build.execution.entryPoint, make.execution.entryPoint);
  } finally {
    await vite.close();
  }
});
