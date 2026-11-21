import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadPyodide } from 'pyodide';
import { createServer } from 'vite';
import { fixtures } from './foundation-fixtures.mjs';

export async function validateContent(lessonIds = []) {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, ws: false } });
  try {
    const { course, coursePack } = await server.ssrLoadModule('/src/courses/course.ts');
    const { unknownTeachingNames } = await server.ssrLoadModule('/src/courses/teaching-quality.ts');
    const curriculum = await readFile(new URL('../../docs/Python_AI_Interview_Learning_Curriculum_v1.1.md', import.meta.url), 'utf8');
    const rows = [...curriculum.matchAll(/^\| \*\*([A-Z]\d+\.\d+)\*\* ([^|]+) \|/gm)];
    const python = await loadPyodide();

    function run(source, expression, values) {
      const globals = python.toPy({});
      try {
        for (const [key, value] of Object.entries(values ?? {})) globals.set(key, value);
        python.runPython(source, { globals, filename: 'authored.py' });
        return python.runPython(expression, { globals });
      } finally {
        globals.destroy();
      }
    }
    const output = (source) => run('from contextlib import redirect_stdout\nfrom io import StringIO\n_stream = StringIO()\nwith redirect_stdout(_stream):\n    exec(compile(_snippet, "example.py", "exec"), {})',
      '_stream.getvalue().rstrip("\\n")', { _snippet: source });
    const names = (source) => JSON.parse(run('import ast, json\n_tree = ast.parse(_snippet)',
      'json.dumps([node.id for node in ast.walk(_tree) if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store)] + [node.arg for node in ast.walk(_tree) if isinstance(node, ast.arg)] + [node.name for node in ast.walk(_tree) if isinstance(node, ast.FunctionDef)])',
      { _snippet: source }));
    const allowed = (...sources) => ['print', 'int', ...sources.flatMap(names)];
    const checkNames = (prose, symbols, label) => { if (prose) assert.deepEqual(unknownTeachingNames(prose, symbols), [], label); };
    const ordered = lessonIds.length ? lessonIds.map(id => {
      const item = course.find(({ lesson }) => lesson.id === id);
      assert(item, 'Unknown lesson: ' + id);
      return item;
    }) : course;
    if (!lessonIds.length) assert.deepEqual(Object.keys(fixtures).sort(), course.map(({ lesson }) => lesson.id).sort());
    let previousIndex = -1;
    return ordered.map(({ lesson, sequence, prediction, ...tasks }) => {
      const { id, title, version } = lesson;
      const pilot = !!sequence.legacy;
      const index = rows.findIndex((row) => row[1] === id && row[2].trim() === title);
      assert(index >= 0, id + ' authoritative curriculum entry');
      if (!lessonIds.length && previousIndex >= 0) assert(index > previousIndex, id + ' curriculum order');
      previousIndex = index;
      assert(lesson.objectives.every(text => text.trim()) && lesson.objectives.length && lesson.estimatedMinutes > 0, id + ' objectives and duration');
      const manifest = fixtures[id];
      assert(manifest, id + ' missing fixtures');
      const worked = lesson.teachingBlocks.filter(({ type }) => type === 'worked-example');
      assert(worked.length && new Set(lesson.teachingBlocks.map(block => block.id)).size === lesson.teachingBlocks.length);
      assert.deepEqual(Object.keys(manifest.outputs).sort(), worked.map(block => block.id).sort(), id + ' example fixtures');
      const introduced = new Set(allowed());
      for (const block of lesson.teachingBlocks) {
        if (block.type === 'worked-example') {
          assert.equal(block.language, prediction.execution.language, block.id);
          assert.equal(output(block.code), manifest.outputs[block.id], block.id);
          for (const name of names(block.code)) introduced.add(name);
          checkNames(block.explanation, introduced, block.id);
        } else if (block.type === 'paragraph') checkNames(block.content, introduced, block.id);
      }
      const coaching = sequence.predictionCoaching;
      assert.equal(output(prediction.starterCode), String(prediction.grading.publicCases[0].expected), id + ' prediction');
      assert.equal(output(coaching.followUp.code), String(coaching.followUp.expected), id + ' follow-up');
      for (const prose of [coaching.explanation, coaching.hypothesis?.possibleReasoning, coaching.hypothesis?.actualReasoning]) {
        checkNames(prose, allowed(prediction.starterCode), id + ' prediction wording');
      }
      for (const prose of [coaching.followUp.hint, coaching.followUp.explanation]) {
        checkNames(prose, allowed(coaching.followUp.code), id + ' follow-up wording');
      }
      checkNames(coaching.modifyFeedback, allowed(tasks.modification.starterCode), id + ' Modify feedback');
      checkNames(sequence.buildPlan.prompt, allowed(tasks.build.starterCode), id + ' Build plan');
      checkNames(sequence.buildPlan.syntax, allowed(tasks.build.starterCode), id + ' Build syntax');
      const checks = [sequence.trace, sequence.transferTrace].filter(Boolean);
      assert.deepEqual(Object.keys(manifest.traces ?? {}).sort(), checks.map(check => check.id).sort(), id + ' trace fixtures');
      for (const check of checks) {
        for (const prose of [check.prompt, check.help.concept, check.help.guidance, ...check.help.worked, check.mistake?.message]) {
          if (prose) checkNames(prose, allowed(check.source), check.id + ' trace wording');
        }
        const lines = check.source.split('\n');
        for (const { label, expected } of check.rows) {
          const line = Number(/^Line (\d+)$/.exec(label)?.[1]);
          assert(line > 0 && line <= lines.length, check.id + ' trace line');
          const actual = run(lines.slice(0, line).join('\n'),
            `__import__('json').dumps(${manifest.traces[check.id]})`);
          assert.deepEqual(JSON.parse(actual), expected, check.id + ' ' + label);
        }
      }
      const results = [];
      for (const [role, key] of [['modification', 'modify'], ['build', 'build'], ['make', 'make'], ['transfer', 'transfer']]) {
        const exercise = tasks[role];
        const { reference, wrong, misses } = manifest.exercises[key];
        const { entryPoint } = exercise.execution;
        const cases = exercise.grading.publicCases;
        const execute = (source, input) => run(source,
          `__import__('json').dumps(${entryPoint}(*__import__('json').loads(_args)), allow_nan=False)`,
          { _args: JSON.stringify(input) });
        if (!pilot && role === 'build') {
          const example = sequence.buildPlan.example;
          assert(example && cases.some(test => JSON.stringify(test.input) === JSON.stringify(example.input) &&
            test.expected === example.expected), exercise.id + ' planning example matches a public case');
          assert.equal(execute(reference, example.input), JSON.stringify(example.expected), exercise.id + ' planning example result');
        }
        const starterEmpty = role === 'make' || role === 'transfer';
        if (starterEmpty) {
          assert.match(exercise.starterCode, /^(?:\s*#[^\n]*\n?)*\s*$/, exercise.id + ' blank starter');
          assert.throws(() => execute(exercise.starterCode, cases[0].input), /NameError/);
        } else {
          assert.match(exercise.starterCode, /^def /, exercise.id + ' scaffold');
          assert(cases.some(({ input, expected }) => execute(exercise.starterCode, input) !== JSON.stringify(expected)), exercise.id + ' starter already passes');
        }
        assert(cases.some(({ id }) => id === misses), exercise.id + ' missing discriminating case');
        for (const { id, input, expected } of cases) {
          assert.equal(execute(reference, input), JSON.stringify(expected), exercise.id + ' reference · ' + id);
          const alternative = manifest.alternatives?.[key];
          if (alternative) assert.equal(execute(alternative, input), JSON.stringify(expected), exercise.id + ' alternative · ' + id);
          const negative = execute(wrong, input);
          if (id === misses) assert.notEqual(negative, JSON.stringify(expected), exercise.id + ' wrong solution survived');
        }
        const levels = exercise.hints.map(({ level }) => level);
        assert.deepEqual(levels, [...new Set(levels)].sort(), exercise.id + ' hint order');
        for (const hint of exercise.hints) {
          if (hint.solutionCode) {
            assert.equal(hint.level, 'H4', exercise.id + ' revealed code level');
            for (const { input, expected } of cases) assert.equal(execute(hint.solutionCode, input), JSON.stringify(expected));
          }
          checkNames(hint.text, allowed(exercise.starterCode, reference), exercise.id + ' hint wording');
        }
        checkNames(exercise.prompt, allowed(exercise.starterCode, reference), exercise.id + ' task wording');
        if (!pilot && role === 'make') {
          assert(exercise.hints.at(-1)?.solutionCode && levels[0] === 'H0', exercise.id + ' worked explanation');
          assert(cases.length >= 6, exercise.id + ' assessment cases');
        }
        if (role === 'transfer') {
          assert.deepEqual(levels, ['H0', 'H1', 'H4'], exercise.id + ' final MAKE assistance');
          assert.notEqual(entryPoint, tasks.make.execution.entryPoint, exercise.id + ' distinct signature');
        }
        results.push(`  ${key}: ${cases.length} cases, starter fails, reference passes, wrong solution fails ${misses}${levels.length ? '; hints ' + levels.join('/') : ''}`);
      }
      return [`${id} ${title} · lesson v${version}, pack v${coursePack.version}`,
        `  Curriculum v1.1 §5 · ${lesson.prerequisites.join(', ') || 'entry lesson'}`,
        `  ${worked.length} worked example(s), prediction, follow-up and ${checks.length} trace grid(s) executed; tagged symbols checked`, ...results,
        '  Editorial review still needed for clarity, scaffold distance, hint disclosure and novelty.'].join('\n');
    });
  } finally {
    await server.close();
  }
}
