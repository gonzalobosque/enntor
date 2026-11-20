import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';

test('Climb coaching requires checked evidence and distinguishes code, cases and execution failures', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { coachCheck, correctionsFor } = await vite.ssrLoadModule('/src/learning/check-coaching.ts');
    const { f0102Exercises } = await vite.ssrLoadModule('/src/courses/f01-02.ts');
    const { learningState } = await vite.ssrLoadModule('/src/learning/evidence.ts');
    const exercise = f0102Exercises.find(item => item.id === 'F01.02.make');
    const source = 'def battery_after(start, used, restored):\n    intermediate = start - used\n    return start + restored';
    const submission = { id: 'wrong', source, exercise, hints: [],
      grade: { verdict: 'failed', evidence: [{ id: 'ordinary', passed: false }, { id: 'timeline', passed: false }] },
      runs: [{ status: 'completed', value: 12 }, { status: 'completed', value: 6 }] };
    const note = await coachCheck(exercise, submission, []);
    assert.match(note.fact, /calculates intermediate.*never contributes/);
    assert.match(note.question, /two recorded measurements/);
    assert.equal(note.caseId, 'ordinary');
    const prior = { ...submission, coaching: note };
    const firstCase = await coachCheck(exercise, submission, [prior]);
    assert.match(firstCase.fact, /returned 12.*16/);
    const earlier = [prior, { ...submission, coaching: firstCase }];
    assert.equal((await coachCheck(exercise, submission, earlier)).caseId, 'timeline');
    assert.equal(await coachCheck(exercise, submission, [...earlier, { coaching: { id: 'failed-case:timeline' } }]), undefined);
    const branch = { ...submission, source: source.replace('return start + restored', 'if start:\n        return start + restored\n    return intermediate') };
    assert.equal((await coachCheck(exercise, branch, [])).id, 'failed-case:ordinary');
    assert.equal(await coachCheck(exercise, { ...submission, grade: { verdict: 'passed', evidence: [] } }, []), undefined);

    for (const [type, phrase] of [['SyntaxError', 'could not parse'], ['ZeroDivisionError', 'raised ZeroDivisionError']]) {
      const check = { source, runs: [{ status: 'error', error: { message: type + ': synthetic' } }] };
      assert.match((await coachCheck(exercise, check, [])).fact, new RegExp(phrase));
    }
    const passed = { id: 'repair', exercise, hints: [], coachedBefore: true,
      grade: { verdict: 'passed', evidence: [{ id: 'ordinary', passed: true }] } };
    assert.deepEqual(correctionsFor(passed, [prior]), ['wrong']);
    assert.deepEqual(correctionsFor(passed, [prior, { corrects: ['wrong'] }]), []);
    const state = learningState({
      learnedAt: 'now', prediction: { answer: '1', runs: [{ status: 'completed', stdout: '1' }] },
      submissions: [{ ...passed, exercise: { id: 'modify' } }, passed],
    }, 'modify', exercise.id, 'transfer');
    assert.equal(state.canFinish, true);
    assert.equal(state.independent, undefined);
  } finally {
    await vite.close();
  }
});
