import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

test('Cargo coaching requires a structural match corroborated by failed cases', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { diagnoseCargo } = await vite.ssrLoadModule('/src/gym/cargo-diagnostic.ts');
    const { cargoWorkout, evaluationWarmUp } = await vite.ssrLoadModule('/src/gym/f01-workout.ts');
    const reversed = 'def cargo_weight(gross, pallets):\n    return pallets * 4 - gross';
    const sample = (source, values, verdict = 'failed') => ({
      source, grade: { verdict, evidence: cargoWorkout.grading.publicCases.map(({ id, expected }, i) =>
        ({ id, passed: values[i] === expected })) },
      runs: values.map(value => ({ status: 'completed', value })),
    });
    const evidence = [-19, -23, 0];
    const result = diagnoseCargo(cargoWorkout, sample(reversed, evidence));
    assert.deepEqual(result.observation, { kind: 'negative-for-positive', caseId: 'multiple-pallets',
      inputs: [31, 3], actual: -19, expected: 19 });
    assert.equal(result.hypothesis.id, 'reversed-subtraction');
    assert.match(result.hypothesis.question, /may have/);
    assert.match(result.nudge.question, /no pallets/);
    for (const text of [result.hypothesis.question, result.nudge.question, JSON.stringify(evaluationWarmUp)]) {
      assert.doesNotMatch(text, /cargo_weight|pallets\s*\*\s*4|return\s\w/);
    }
    assert.equal(diagnoseCargo(cargoWorkout, sample(
      'def cargo_weight(weight, count):\n    # Packaging\n    return (4 * count) - (weight)', evidence,
    )).hypothesis.id, 'reversed-subtraction');
    for (const submission of [
      sample(reversed, [-19, 20, 0]),
      sample('def cargo_weight(gross, pallets):\n    return -abs(gross - pallets * 4)', evidence),
      sample('def cargo_weight(gross, pallets):\n    return gross + 4', [35, 27, 12]),
    ]) {
      assert.equal(diagnoseCargo(cargoWorkout, submission).hypothesis, undefined);
      assert.equal(diagnoseCargo(cargoWorkout, submission).nudge.id, 'trace-one-case');
    }
    assert.equal(diagnoseCargo(cargoWorkout, sample(
      'def cargo_weight(gross, pallets):\n    return gross - pallets * 4', [19, 23, 0], 'passed')), undefined);
    assert.equal(diagnoseCargo(cargoWorkout, sample(reversed, [], 'ungraded')), undefined);
  } finally {
    await vite.close();
  }
});
