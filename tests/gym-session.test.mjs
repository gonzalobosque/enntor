import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { loadPyodide } from 'pyodide';

async function server() {
  return createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
}

test('Gym report uses the latest evaluated result and updates Sweat on one completion', async () => {
  const vite = await server();
  try {
    const { finishWorkout, rateWorkout } = await vite.ssrLoadModule('/src/gym/workout-session.ts');
    const { warmUpFormat } = await vite.ssrLoadModule('/src/gym/WarmUp.tsx');
    assert.deepEqual(['predict', 'modify', 'build', 'make'].map(warmUpFormat),
      ['reflect', 'structure', 'scaffold', 'modify']);
    const session = { id: 'current' };
    const attempt = (id, verdict, activity = 'practice', sessionId = session.id) => ({
      sessionId, activity, submission: { id, finishedAt: 'time', grade: { verdict } },
    });
    const older = attempt('previous-session', 'passed', 'practice', 'older');
    const warm = attempt('warm-up-pass', 'passed', 'warm-up');
    const unchecked = attempt('stopped', 'ungraded');
    assert.equal(finishWorkout(session, [older, warm, unchecked]), session);
    const failed = attempt('mistake', 'failed');
    const finished = finishWorkout(session, [older, warm, failed, unchecked]);
    assert.equal(finished.completion.outcome, 'not-passed');
    assert.deepEqual(finished.completion.attemptIds, ['warm-up-pass', 'mistake', 'stopped']);
    const transfer = { ...attempt('transfer', 'passed', 'transfer'), independent: true };
    const success = finishWorkout(session, [failed, transfer]);
    assert.equal(success.completion.outcome, 'passed');
    assert.equal(success.completion.evidenceId, 'transfer');
    assert.equal(finishWorkout(finished, [transfer]), finished);
    for (const value of [1, .5, 0, -.5, -1, null]) {
      const rated = rateWorkout(finished, value);
      assert.equal(rated.completion.sweat, value);
      assert.equal(rated.completion.at, finished.completion.at);
      assert.equal(rated.id, session.id);
    }
    const syntax = { ...unchecked, coaching: { observation: { kind: 'syntax-error', exception: 'SyntaxError' } } };
    assert.equal(finishWorkout(session, [syntax]).completion.outcome, 'not-passed');
  } finally {
    await vite.close();
  }
});

test('Gym examples, worked solution, warm-up, and new transfer match the public contracts', async () => {
  const vite = await server();
  try {
    const { cargoWorkout, visitorWarmUp, postcardTransfer } = await vite.ssrLoadModule('/src/gym/f01-workout.ts');
    const python = await loadPyodide();
    for (const [exercise, solution] of [
      [cargoWorkout, cargoWorkout.hints.at(-1).solutionCode],
      [visitorWarmUp, 'def visitors(confirmed, extra):\n    return confirmed + extra * 2'],
      [postcardTransfer, 'def postcard_total(cartons, loose):\n    return cartons * 6 + loose'],
    ]) {
      python.runPython(solution);
      for (const check of exercise.grading.publicCases) {
        assert.equal(python.runPython(`${exercise.execution.entryPoint}(${check.input.join(',')})`), check.expected);
      }
    }
    assert.match(postcardTransfer.starterCode, /^#[^\n]*\n?$/);
    assert.doesNotMatch(visitorWarmUp.starterCode, /cargo_weight|gross|pallet/);
    assert.match(cargoWorkout.prompt.join(' '), /31 kg with 3 pallets.*19 kg/);
  } finally {
    await vite.close();
  }
});

test('Gym rejects stale completion and rating writes and keeps separate attempts', async () => {
  const vite = await server();
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const map = new Map();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key) => map.get(key) ?? null, setItem: (key, value) => map.set(key, value),
    key: (i) => [...map.keys()][i] ?? null, get length() { return map.size; },
  } });
  try {
    const { GymRecordConflict, readGymRecords, saveGymRecord } = await vite.ssrLoadModule('/src/gym/workout-evidence.ts');
    const { finishWorkout, rateWorkout } = await vite.ssrLoadModule('/src/gym/workout-session.ts');
    const exercise = { id: 'exercise', version: '1.0.0' };
    const base = { schemaVersion: 1, origin: 'gym', exercise, conceptId: 'evaluation-order' };
    const session = { ...base, id: 'shared', kind: 'session', startedAt: 'start' };
    saveGymRecord(session);
    const attempt = (id, verdict) => ({ ...base, sessionId: session.id, kind: 'attempt',
      submission: { id, exercise, source: '# synthetic', startedAt: 'start', finishedAt: 'end',
        hints: [], grade: { verdict, evidence: [] } },
    });
    const passed = attempt('success', 'passed');
    const failed = attempt('failure', 'failed');
    saveGymRecord(passed);
    saveGymRecord(failed);
    const completion = finishWorkout(session, [passed]);
    saveGymRecord(completion, session);
    assert.throws(() => saveGymRecord(finishWorkout(session, [failed]), session), GymRecordConflict);
    assert.deepEqual(readGymRecords(), [completion, passed, failed]);
    const firstRating = rateWorkout(completion, 1);
    saveGymRecord(firstRating, completion);
    assert.throws(() => saveGymRecord(rateWorkout(completion, -1), completion), GymRecordConflict);
    assert.deepEqual(readGymRecords(), [firstRating, passed, failed]);
    saveGymRecord(rateWorkout(firstRating, -1), firstRating);
    assert.deepEqual(readGymRecords()[0].completion, { ...completion.completion, sweat: -1 });
  } finally {
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
    else delete globalThis.localStorage;
    await vite.close();
  }
});
