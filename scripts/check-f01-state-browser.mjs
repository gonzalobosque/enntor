import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const origin = process.env.ENNTOR_TEST_ORIGIN ?? 'http://127.0.0.1:5177';
const screenshots = process.env.ENNTOR_REVIEW_SCREENSHOTS;
const lessonPath = id => origin + '/#/climb/' + id;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1260, height: 900 }, colorScheme: 'light' });
  await page.route('https://**', route => route.abort());
  page.setDefaultTimeout(25000);
  const section = name => page.getByRole('region', { name });
  const action = (name, area = page) => area.getByRole('button', { name, exact: true });
  const press = (name, area) => action(name, area).press('Enter');
  const editor = area => area.getByRole('textbox', { name: /Python code/ });
  const record = id => page.evaluate(id => Object.entries(localStorage)
    .filter(([key]) => key.startsWith('enntor.evidence.v1.'))
    .map(([, text]) => JSON.parse(text)).find(item => item.lesson.id === id), id);

  async function capture(name, area) {
    if (!screenshots) return;
    await mkdir(screenshots, { recursive: true });
    await page.locator('#main').evaluate(main => main.focus({ preventScroll: true }));
    await area.screenshot({ path: join(screenshots, name + '.jpg'), type: 'jpeg', quality: 87 });
  }

  async function grade(area, source, verdict = 'All public cases passed.') {
    if (source !== undefined) await editor(area).fill(source);
    await press('Check solution', area);
    await area.getByText(verdict, { exact: true }).waitFor();
  }

  async function predict(answer, expected) {
    await press('Continue to Predict');
    await page.getByRole('textbox', { name: 'Your prediction', exact: true }).fill(answer);
    await press('Commit prediction & run');
    await section('Predict').getByText(new RegExp('Printed result\\s+' + expected)).waitFor();
  }

  async function trace(title, responses) {
    const area = section(title);
    const fields = area.locator('table input, table select');
    assert.equal(await fields.count(), responses.length);
    for (const [index, answer] of responses.entries()) {
      const field = fields.nth(index);
      if (await field.evaluate(element => element.tagName === 'SELECT')) await field.selectOption({ label: answer });
      else await field.fill(answer);
    }
    await press('Check trace', area);
    return area;
  }

  async function useWorkedSolution(area) {
    await press('Show hint', area);
    assert.equal(await action('Show full solution and explanation', area).count(), 0);
    await press('Another hint', area);
    await press('Show full solution and explanation', area);
    return area.locator('.pilot-feedback pre').innerText();
  }

  async function finish(id) {
    await press('Finish lesson');
    await page.waitForURL(lessonPath(id) + '/results');
    await page.getByText('Lesson completed and saved on this browser.').waitFor();
    return record(id);
  }

  await page.goto(lessonPath('F01.04'));
  await page.getByText('F01.04 opens after F01.03.').waitFor();

  // This profile belongs only to Playwright. Older lessons have their own end-to-end suites.
  const prior = ['1.4.0', '1.3.0', '1.3.0'].map((version, index) => ({
    schemaVersion: 1, id: 'synthetic-f01-start-' + index, pack: { id: 'python-ai-pilot', version: '1.7.0' },
    lesson: { id: 'F01.0' + (index + 1), version }, startedAt: '2026-01-01T10:00:00Z', updatedAt: '2026-01-01T10:11:00Z',
    legacyDrafts: index === 0, followUps: [], hints: [], submissions: [],
    completion: { at: '2026-01-01T10:11:00Z', sweat: null, modifyId: 'synthetic-modify', makeId: 'synthetic-make', independent: true },
  }));
  await page.evaluate(prior => prior.forEach(item =>
    localStorage.setItem('enntor.evidence.v1.' + item.id, JSON.stringify(item))), prior);

  await page.goto(lessonPath('F01.06'));
  await page.getByText('F01.06 opens after F01.05.').waitFor();
  await page.goto(lessonPath('F01.05'));
  await page.getByText('F01.05 opens after F01.04.').waitFor();
  await page.goto(lessonPath('F01.04'));
  await predict('3', '2');
  await page.getByRole('textbox', { name: 'Follow-up prediction' }).fill('1');
  await press('Check prediction');
  const binding = section('Follow the edit and the rebind');
  await binding.getByRole('combobox', { name: 'Line 4 · Object label for active (A/B)' }).waitFor();
  await trace('Follow the edit and the rebind', ['A', '2', '2', 'A', '1', '1', 'B', '2', '2']);
  await binding.getByText(/one-item list through both names/).waitFor();
  await trace('Follow the edit and the rebind', ['A', '2', '2', 'B', '2', '1', 'B', '2', '2']);
  await binding.getByText('Trace checks out.').waitFor();
  await capture('mutation-binding-trace-desktop-light', binding);
  const sharedLog = section(/Record a reading in a shared log/);
  await grade(sharedLog, undefined, 'Some public cases failed.');
  await sharedLog.getByText('Public return and input-state checks').waitFor();
  await sharedLog.getByText(/The return matches. Input 1 ended as/).waitFor();
  let mutation = await record('F01.04');
  const missedMutation = mutation.submissions.at(-1);
  assert.deepEqual(missedMutation.runs[0].value, [4, 7]);
  assert.deepEqual(missedMutation.runs[0].argumentsAfter, [[4], 7]);
  await grade(sharedLog, 'def record_reading(log, reading):\n    log += [reading]\n    return tuple(log)', 'Some public cases failed.');
  await sharedLog.getByText('Unexpected Python type in return').first().waitFor();
  assert.deepEqual((await record('F01.04')).submissions.at(-1).runs[0].invalidTypes, ['return']);
  await grade(sharedLog, 'def record_reading(log, reading):\n    log += [reading]\n    return log');
  mutation = await record('F01.04');
  assert(mutation.submissions.at(-1).corrects.includes(missedMutation.id));

  await page.getByLabel('Returning the new count makes Python replace the caller’s list.', { exact: true }).check();
  await page.getByText(/Follow the list reference/).waitFor();
  await page.getByLabel('The function and caller refer to the same list, and that list changes in place.', { exact: true }).check();
  await grade(section(/Tag a sample/), 'def tag_sample(tags, label):\n    tags.append(label + "!")\n    return len(tags)');
  const board = section(/Replace the first board reading/);
  await grade(board, 'def update_board(readings, replacement):\n    report = [readings[0]]\n    readings[0] = replacement\n    report.append(readings[-1])\n    return report');
  await press('Optional MAKE practice');
  await grade(section(/Add a stop to a shared itinerary/), 'def append_stop(stops, new_stop):\n    report = [stops[-1], len(stops) + 1]\n    stops += [new_stop]\n    return report');
  assert.equal((await finish('F01.04')).completion.independent, true);

  await page.getByRole('link', { name: 'Back to The Climb' }).press('Enter');
  await page.getByRole('link', { name: /Open F01.05/ }).press('Enter');
  await predict('3', '3');
  const copies = await trace('Which objects are shared?', ['yes', 'yes', '1', 'no', 'yes', '2', 'no', 'no', '2']);
  await copies.getByText('Trace checks out.').waitFor();
  const preview = section(/Keep preview edits away from the source/);
  await grade(preview, undefined, 'Some public cases failed.');
  await preview.getByText(/Does the caller still share a reference/).waitFor();
  await capture('shallow-copy-failure-desktop-light', preview.locator('.pilot-feedback').filter({ hasText: 'Test results' }));
  await grade(preview, 'from copy import deepcopy\n\ndef preview_row(rows, reading):\n    view = deepcopy(rows)\n    view[0].append(reading)\n    return view');
  await page.getByLabel('Return [[2], [5]]. Leave the source as [[2]].', { exact: true }).check();
  await grade(section(/Add a group to a planning preview/), 'def extend_preview(rows, marker):\n    return rows + [[marker]]');
  const route = section(/Add route markers without changing the source/);
  await grade(route, await useWorkedSolution(route));
  assert.equal(await action('Finish lesson').count(), 0);
  await press('Final MAKE exercise');
  const approval = section(/Keep a pre-approval packing snapshot/);
  await grade(approval, await useWorkedSolution(approval));
  await page.setViewportSize({ width: 390, height: 850 });
  await press('Switch to dark mode');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const copyRecord = await finish('F01.05');
  assert.equal(copyRecord.completion.independent, false);
  assert(copyRecord.hints.some(item => item.exercise.id === 'F01.05.make-transfer' && item.level === 'H4'));
  await page.getByText('Finished as practice. No new independent coding evidence.').waitFor();
  await capture('copy-assisted-report-mobile-dark', section('Activity outcomes'));
  await page.reload();
  assert.deepEqual(await record('F01.05'), copyRecord);

  await page.getByRole('link', { name: 'Back to The Climb' }).press('Enter');
  await page.getByRole('link', { name: /Open F01.06/ }).press('Enter');
  await predict('5', '5');
  const lab = await trace('Dry-run the calls and the score', ['yes', 'yes', 'unbound', 'no', 'yes', 'unbound', 'no', 'no', '8']);
  await lab.getByText('Trace checks out.').waitFor();
  assert.equal(await lab.getByRole('textbox', { name: 'Line 10 · Score' }).count(), 1);
  assert.equal(await lab.getByRole('textbox', { name: 'Line 8 · Equal first row contents?' }).inputValue(), 'yes');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await capture('laboratory-trace-mobile-dark', lab);

  const batches = section(/Keep the original batch snapshot in the report/);
  await grade(batches, 'from copy import deepcopy\n\ndef compare_batches(rows, reading):\n    before = deepcopy(rows)\n    rows[0].append(reading)\n    first = len(rows[0])\n    rows[0].append(reading + 1)\n    return [before, first + len(rows[0]) * 2]');
  await page.getByLabel('8, using rehearsal sizes 2 and 3.', { exact: true }).check();
  await grade(section(/Score a rehearsal with two events/), 'def count_updates(log, morning, evening):\n    size = len(log[0])\n    return size + 1 + 2 * (size + 2)');
  const checkpoints = section(/Report two rehearsal checkpoints/);
  const labDraft = '# Synthetic unfinished rehearsal';
  await editor(checkpoints).fill(labDraft);
  await press('Save for later');
  await page.getByRole('link', { name: /Resume F01.06/ }).press('Enter');
  await checkpoints.getByText('Previous draft restored').waitFor();
  assert.equal(await editor(checkpoints).innerText(), labDraft);
  await editor(checkpoints).press('Escape');
  await page.keyboard.press('Tab');
  assert.equal(await editor(checkpoints).evaluate(element => element === document.activeElement), false);
  await grade(checkpoints, 'from copy import deepcopy\n\ndef simulate_rounds(rounds, extra, reset):\n    working = deepcopy(rounds)\n    working[0].append(extra)\n    before = deepcopy(working)\n    working[0] = [reset]\n    return [before, working]');
  await press('Optional MAKE practice');
  await grade(section(/Publish checkpoints of a live adjustment/), 'def publish_rounds(rounds, increase, extra):\n    rounds[0][0] += increase + increase\n    before = [list(rounds[0])] + rounds[1:]\n    rounds[0][0] += extra\n    return [before, rounds[0][0]]');
  const state = await finish('F01.06');
  assert.equal(state.completion.independent, true);
  assert.equal(state.traceHelp?.length ?? 0, 0);
  assert.equal(state.traces[0].correct, true);
  assert.deepEqual(state.completion.traceIds, [state.traces[0].id]);
  await page.getByText('Dry-run the calls and the score: passed on the first check.').waitFor();
  for (const item of prior) assert.deepEqual(await record(item.lesson.id), item);
  console.log('F01.04–F01.06 Chromium passed: prerequisites, trace/rebind, structured failures and correction, all 12 coding tasks, assisted and independent reports, draft/resume, keyboard and mobile dark.');
} finally {
  await browser.close();
}
