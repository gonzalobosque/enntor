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
    const repeated = evaluate({ ...transfer, seenBefore: true });
    assert.equal(repeated.canFinish, true);
    assert.equal(repeated.independent, undefined);
    assert.equal(evaluate({ ...transfer, hints: ['H0'] }).canFinish, false);
    assert.equal(evaluate(transfer).independent, transfer);
  } finally {
    await vite.close();
  }
});

test('state and identity reasoning are checked directly and versioned independently of code verdicts', async () => {
  const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { course } = await vite.ssrLoadModule('/src/courses/course.ts');
    const { gradeTrace } = await vite.ssrLoadModule('/src/learning/trace.ts');
    const { learningState, finalizeEvidence, hasSeenExercise } = await vite.ssrLoadModule('/src/learning/evidence.ts');
    const stateCheck = course[1].sequence.trace;
    const mistake = gradeTrace(stateCheck, [['12','UNBOUND'], ['12','12'], ['7','7'], ['9','9']]);
    assert.equal(mistake.pattern, 'snapshot-followed-rebinding');
    assert.deepEqual(mistake.missed, [{ row: 2, column: 1 }, { row: 3, column: 1 }]);
    assert.equal(gradeTrace(stateCheck, [['12','unbound'], ['12','12'], ['7','12'], ['9','12']]).correct, true);

    const { trace, transferTrace } = course[2].sequence;
    const { id, version } = course[2].transfer;
    const openedOnly = [{ openedTransfer: { id, version }, submissions: [], hints: [] }];
    assert.equal(hasSeenExercise(openedOnly, { id, version }), true);
    assert.equal(hasSeenExercise(openedOnly, { id, version: '1.0.0' }), false);
    assert.equal(gradeTrace(trace, [['a','yes','yes'], ['b','yes','yes'], ['a','yes','yes']]).pattern, 'equal-implies-identical');
    const attempt = (id, hints = []) => ({ id, exercise: { id }, grade: { verdict: 'passed' }, hints });
    const direct = { id: 'direct', check: trace, ...gradeTrace(trace, trace.rows.map(row => row.expected)) };
    const handoff = { id: 'handoff', check: transferTrace, ...gradeTrace(transferTrace, transferTrace.rows.map(row => row.expected)) };
    const session = { learnedAt: 'time', prediction: { answer: '1', runs: [{ status: 'completed', stdout: '1' }] },
      buildPlan: { correct: true }, submissions: [attempt('modify'), attempt('build'), attempt('make', ['H4']), attempt('transfer')] };
    const evaluate = record => learningState(record, 'modify', 'make', 'transfer', 'build', true, { trace, transferTrace });
    const obsolete = { ...direct, check: { ...trace, version: '0.9.0' } };
    assert.equal(evaluate({ ...session, traces: [obsolete, handoff] }).canFinish, false);
    assert.equal(evaluate({ ...session, traces: [direct] }).canFinish, false);
    const completed = { ...session, traces: [direct, handoff] };
    assert.equal(evaluate(completed).canFinish, true);
    assert.deepEqual(finalizeEvidence(completed, evaluate(completed)).completion.traceIds, ['direct', 'handoff']);
  } finally {
    await vite.close();
  }
});
