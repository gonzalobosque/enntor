import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { loadPyodide } from 'pyodide';

const stamp = (order) => new Date(Date.UTC(2026, 0, order)).toISOString();
const prediction = (order, reasoning, followUp = false) => ({
  prediction: { id: 'pred-' + order, answer: '30', committedAt: stamp(order),
    runs: [{ status: 'completed', stdout: '22' }], hypothesis: 'addition-first', reasoning },
  followUps: followUp ? [{ id: 'follow-up-' + order, correct: true, at: stamp(order + 1) }] : [],
  submissions: [],
});
const submission = (id, exercise, order, verdict, hints = []) => ({
  id, source: '# example', exercise: { id: exercise, version: '1.0.0' }, startedAt: stamp(order),
  hints, priorPass: false, grade: { verdict },
});

test('Gym recommendations follow observations, corrections, and help instead of diagnosing the learner', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { recommendPractice } = await vite.ssrLoadModule('/src/gym/recommendation.ts');
    const { f01Observations } = await vite.ssrLoadModule('/src/gym/f01-observations.ts');
    const { cargoWorkout, f01Concept } = await vite.ssrLoadModule('/src/gym/f01-workout.ts');
    const recommend = (sessions, records = []) => recommendPractice(f01Observations(sessions, records));
    assert.equal(recommend([]).reason, 'insufficient');
    const rejected = prediction(1, 'rejected');
    const unconfirmed = prediction(2);
    assert.equal(recommend([rejected]).reason, 'reinforce');
    assert.equal(recommend([rejected, rejected]).reason, 'reinforce');
    const repeated = recommend([rejected, unconfirmed]);
    assert.equal(repeated.reason, 'repeated-errors');
    assert.deepEqual(repeated.evidence.map(({ id }) => id), ['pred-1', 'pred-2']);
    assert(repeated.evidence.every(({ description }) => !description.includes('adding first')));
    assert.match(recommend([prediction(1, 'confirmed')]).evidence[0].description, /confirmed adding first on that attempt/);
    assert.equal(recommend([rejected, prediction(2, undefined, true)]).reason, 'reinforce');

    const soloMake = submission('make', 'F01.01.make', 4, 'passed');
    const corrected = { ...prediction(1, 'rejected', true), submissions: [soloMake] };
    assert.equal(recommend([corrected]).reason, 'reinforce');
    assert.equal(recommend([corrected]).evidence[0].independent, true);
    assert.equal(recommend([rejected, unconfirmed, corrected]).reason, 'reinforce');

    const assistedMake = submission('assisted', 'F01.01.make', 4, 'passed', ['H3']);
    const assisted = recommend([{ ...rejected, submissions: [assistedMake] }]);
    assert.equal(assisted.reason, 'try-unaided');
    assert.match(assisted.evidence[0].description, /solution help/);
    assert.equal(assisted.evidence[0].independent, false);

    const attempt = (id, day, verdict, independent, hints = []) => ({
      kind: 'attempt', conceptId: f01Concept, exercise: cargoWorkout, independent,
      submission: submission(id, cargoWorkout.id, day, verdict, hints),
    });
    const misses = [attempt('g1', 5, 'failed', false), attempt('g2', 6, 'failed', false)];
    assert.equal(recommend([], misses).reason, 'repeated-errors');
    assert.equal(recommend([], [...misses, attempt('g3', 7, 'passed', false, ['H0'])]).reason, 'try-unaided');
    const coached = { ...attempt('g3', 7, 'passed', false), nudgeAttemptIds: ['g1'] };
    const afterCoaching = recommend([rejected, unconfirmed], [...misses, coached]);
    assert.equal(afterCoaching.reason, 'try-unaided');
    assert.deepEqual(afterCoaching.evidence.map(({ id }) => id), ['g3', 'pred-1', 'pred-2']);
    assert.equal(recommend([rejected, unconfirmed], [...misses, attempt('g3', 7, 'passed', true)]).reason, 'independent-practice');

    const python = await loadPyodide();
    python.runPython('def cargo_weight(gross, pallets):\n    return gross - pallets * 4');
    for (const example of cargoWorkout.grading.publicCases) {
      assert.equal(python.runPython(`cargo_weight(${example.input.join(',')})`), example.expected);
    }
    python.runPython('def cargo_weight(gross, pallets):\n    return (gross - pallets) * 4');
    assert.notEqual(python.runPython('cargo_weight(31, 3)'), 19);
  } finally {
    await vite.close();
  }
});
