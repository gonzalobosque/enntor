import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { validateContent } from '../scripts/content/validate.mjs';

test('the curriculum unit has executable examples, references and discriminating wrong solutions', async () => {
  const reports = await validateContent();
  assert.deepEqual(reports.map(report => report.split(' ')[0]), ['F01.01', 'F01.02', 'F01.03']);
});

test('pack loader orders prerequisites and rejects cross-lesson or duplicate activities', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { coursePack, course } = await vite.ssrLoadModule('/src/courses/course.ts');
    const { loadCoursePack, unmetPrerequisites } = await vite.ssrLoadModule('/src/courses/load-course-pack.ts');
    const sequences = Object.fromEntries(course.map(({ lesson, sequence }) => [lesson.id, sequence]));
    assert.deepEqual(unmetPrerequisites(course[1], coursePack, new Set()), ['F01.01']);
    assert.deepEqual(unmetPrerequisites(course[2], coursePack, new Set(['F01.02'])), []);
    const invalid = structuredClone(coursePack);
    invalid.lessons[0].prerequisites = ['F01.03'];
    assert.throws(() => loadCoursePack(invalid, sequences), /prerequisites must precede/);
    invalid.lessons[0].prerequisites = [];
    invalid.lessons[0].exerciseIds[0] = invalid.lessons[1].exerciseIds[0];
    assert.throws(() => loadCoursePack(invalid, sequences), /exercise ownership/);
    invalid.lessons[0].exerciseIds[0] = coursePack.lessons[0].exerciseIds[0];
    invalid.exercises.push(invalid.exercises[0]);
    assert.throws(() => loadCoursePack(invalid, sequences), /duplicate/);
  } finally {
    await vite.close();
  }
});

test('new lessons require fresh unaided transfer after solution help', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { learningState } = await vite.ssrLoadModule('/src/learning/evidence.ts');
    const make = { exercise: { id: 'make' }, grade: { verdict: 'passed' }, hints: ['H4'] };
    const transfer = { exercise: { id: 'transfer' }, grade: { verdict: 'passed' }, hints: [] };
    const evidence = { learnedAt: 'time', buildPlan: { correct: true },
      prediction: { answer: '1', runs: [{ status: 'completed', stdout: '1' }] },
      submissions: [{ ...transfer, exercise: { id: 'modify' } }, { ...transfer, exercise: { id: 'build' } }, make] };
    const evaluate = (...submissions) => learningState({ ...evidence, submissions: [...evidence.submissions, ...submissions] }, 'modify', 'make', 'transfer', 'build', true);
    assert.equal(evaluate().canFinish, false);
    assert.equal(evaluate({ ...transfer, seenBefore: true }).canFinish, false);
    assert.equal(evaluate({ ...transfer, hints: ['H0'] }).canFinish, false);
    assert.equal(evaluate(transfer).independent, transfer);
  } finally {
    await vite.close();
  }
});
