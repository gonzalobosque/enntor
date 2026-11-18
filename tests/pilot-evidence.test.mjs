import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

test('pilot completion separates activity, assistance, independence, and durable evidence', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  const entries = new Map();
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    get length() { return entries.size; },
    key(index) { return [...entries.keys()][index] ?? null; },
    getItem(key) { return entries.get(key) ?? null; },
    setItem(key, value) { entries.set(key, value); },
  } });
  try {
    const { learningState, writeEvidence, readEvidence, sweatChoices } =
      await vite.ssrLoadModule('/src/learning/evidence.ts');
    const lesson = { id: 'F01.01', version: '1.2.0' };
    const base = { schemaVersion: 1, id: 'session', lesson, startedAt: '2026-01-01', learnedAt: '2026-01-01',
      prediction: { answer: '30', runs: [{ status: 'completed', stdout: '22' }] },
      followUps: [{ correct: true }], hints: [], submissions: [] };
    const submit = (id, hints, verdict = 'passed', priorPass = false) =>
      ({ id, exercise: { id }, grade: { verdict }, hints, priorPass });
    const modify = submit('modify', []);
    const assisted = { ...base, submissions: [modify, submit('make', ['H3'])] };
    const check = (session) => learningState(session, 'modify', 'make', 'transfer');
    assert.equal(check({ ...base, submissions: [modify, submit('make', [], 'failed')] }).canFinish, false);
    assert.equal(check(assisted).activitiesComplete, true);
    assert.equal(check(assisted).canFinish, false);
    const conceptual = { ...base, submissions: [modify, submit('make', ['H1'])] };
    assert.equal(check(conceptual).canFinish, true);
    assert.equal(check(conceptual).independent, undefined);
    assert.equal(check({ ...base, submissions: [modify, submit('make', [], 'passed', true)] }).independent, undefined);
    const completed = { ...assisted, submissions: [...assisted.submissions, submit('transfer', [])] };
    assert.equal(check(completed).independent.id, 'transfer');
    assert.equal(check(completed).canFinish, true);
    writeEvidence(base);
    for (const sweat of [...sweatChoices.map(([, value]) => value), null]) {
      const next = { ...completed, completion: { sweat } };
      const [previous] = readEvidence(lesson);
      writeEvidence(next, previous);
      assert.equal(readEvidence(lesson).length, 1);
      assert.equal(readEvidence(lesson)[0].completion.sweat, sweat);
    }
    assert.throws(() => writeEvidence(base), /another tab/);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
    await vite.close();
  }
});

test('Build gates new completion while existing completions and rating history stay intact', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { learningState, finalizeEvidence, withSweatRating, sweatChoices } =
      await vite.ssrLoadModule('/src/learning/evidence.ts');
    const passed = (id) => ({ id, exercise: { id }, hints: [], grade: { verdict: 'passed' } });
    const session = { followedUp: true, learnedAt: 'earlier',
      prediction: { answer: '22', runs: [{ status: 'completed', stdout: '22' }] },
      followUps: [], submissions: [passed('modify'), passed('make'), passed('build')] };
    const check = (value) => learningState(value, 'modify', 'make', 'transfer', 'build');
    assert.equal(check(session).canFinish, false);
    const ready = { ...session, buildPlan: { correct: true } };
    const finished = finalizeEvidence(ready, check(ready));
    assert.equal(finished.completion.buildId, 'build');
    assert.equal(finalizeEvidence(finished, check(finished)), finished);
    const historical = { ...session, completion: { at: 'historical', sweat: 0, modifyId: 'modify',
      makeId: 'make', independent: true } };
    assert.equal(finalizeEvidence(historical, check(historical)), historical);
    for (const value of [null, ...sweatChoices.map(([, score]) => score)]) {
      const rated = withSweatRating(historical, value);
      assert.equal(rated.completion.sweat, value);
      assert.equal(rated.completion.at, 'historical');
      assert.deepEqual(rated.submissions, historical.submissions);
    }
  } finally {
    await vite.close();
  }
});
