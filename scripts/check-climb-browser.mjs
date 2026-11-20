import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const origin = process.env.ENNTOR_TEST_ORIGIN ?? 'http://127.0.0.1:5176';
const screenshots = process.env.ENNTOR_REVIEW_SCREENSHOTS;
const at = (lesson = '', report = false) => origin + '/#/climb' + (lesson ? '/' + lesson : '') + (report ? '/results' : '');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  await page.route('https://**', route => route.abort());
  page.setDefaultTimeout(20000);
  const section = name => page.getByRole('region', { name });
  const button = (name, scope = page) => scope.getByRole('button', { name, exact: true });
  const press = (name, scope) => button(name, scope).press('Enter');
  const link = name => page.getByRole('link', { name });
  const learnerRecords = () => page.evaluate(() => Object.entries(localStorage)
    .filter(([key]) => key.startsWith('enntor.evidence.v1.')).map(([, json]) => JSON.parse(json)));
  const recordFor = async id => (await learnerRecords()).find(record => record.lesson.id === id);

  async function capture(name, target) {
    if (!screenshots) return;
    await mkdir(screenshots, { recursive: true });
    // Playwright can encode JPEG or PNG. JPEG keeps these review files small.
    await target.screenshot({ path: join(screenshots, name + '.jpg'), type: 'jpeg', quality: 86 });
  }

  async function grade(area, source, passes = true) {
    const editor = area.getByRole('textbox', { name: /Python code/ });
    await editor.fill(source);
    await press('Check solution', area);
    await area.getByText(passes ? 'All public cases passed.' : /Some public cases failed/).waitFor();
  }

  async function predict(answer, output) {
    await press('Continue to Predict');
    await page.getByRole('textbox', { name: 'Your prediction', exact: true }).fill(answer);
    await press('Commit prediction & run');
    await page.getByText(new RegExp('Printed result\\s+' + output)).waitFor();
  }

  async function followUp(answer) {
    await page.getByRole('textbox', { name: 'Follow-up prediction' }).fill(answer);
    await press('Check prediction');
  }

  async function checkTrace(name, answers) {
    const area = section(name);
    await area.waitFor();
    const fields = area.getByRole('textbox');
    assert.equal(await fields.count(), answers.length);
    for (let i = 0; i < answers.length; i++) await fields.nth(i).fill(answers[i]);
    await press('Check trace', area);
    return area;
  }

  await page.goto(at('F01.02'));
  await page.getByText('F01.02 opens after F01.01.').waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Learn', exact: true }).count(), 0);
  await page.goto(at('F01.03', true));
  await page.getByText('F01.03 opens after F01.02.').waitFor();
  await page.goto(at('F01.99'));
  await page.getByText('This lesson is unavailable in the current course pack.').waitFor();

  // Start the mini-unit beyond the pilot with an actual v1.2-shaped completion.
  // The existing pilot browser suite independently creates a real completion.
  const pilot = {
    schemaVersion: 1, id: 'synthetic-legacy-pilot', pack: { id: 'python-ai-pilot', version: '1.3.0' },
    lesson: { id: 'F01.01', version: '1.2.0' }, legacyDrafts: true,
    startedAt: '2026-01-01T09:00:00Z', updatedAt: '2026-01-01T09:15:00Z',
    followUps: [], hints: [], submissions: [],
    completion: { at: '2026-01-01T09:15:00Z', sweat: null, modifyId: 'm1', makeId: 'm2', independent: true },
  };
  await page.evaluate(session => localStorage.setItem('enntor.evidence.v1.' + session.id, JSON.stringify(session)), pilot);
  await page.goto(at());
  await link(/Open F01.02/).waitFor();
  await page.getByText(/Locked · finish F01.02 first/).waitFor();
  await capture('climb-progression', page);
  await link('View report for F01.01').press('Enter');
  await page.getByText('Build was introduced after this session.').waitFor();
  await page.getByText('Lesson edition 1.2.0').waitFor();
  await link('Back to The Climb').press('Enter');
  await link(/Open F01.02/).press('Enter');
  await page.getByRole('heading', { level: 1, name: 'Variables and reassignment' }).waitFor();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  assert.equal(await page.getByRole('link', { name: 'The Climb', exact: true }).getAttribute('aria-current'), 'location');

  await predict('0', '3');
  await page.getByLabel('Yes, I changed both names').check();
  await capture('reassignment-investigate', section('Investigate'));
  await followUp('5');
  const stateTrace = await checkTrace('Trace both bindings', ['12', 'unbound', '12', '12', '7', '7', '9', '9']);
  await stateTrace.getByText(/move both names together/).waitFor();
  assert.equal(await section(/^Modify/).count(), 0);
  await capture('reassignment-trace', stateTrace);
  await page.reload();
  await stateTrace.getByText(/move both names together/).waitFor();
  await checkTrace('Trace both bindings', ['12', 'unbound', '12', '12', '7', '12', '9', '12']);
  const modify = section(/^Modify/);
  const draft = 'def starting_reading(reading, correction):\n    recorded = reading\n    reading += correction\n    return recorded';
  await modify.getByRole('textbox', { name: /Python code/ }).fill(draft);
  await press('Save for later');
  await link(/Resume F01.02/).press('Enter');
  assert.equal(await modify.getByRole('textbox', { name: /Python code/ }).innerText(), draft);
  await grade(modify, draft);
  await page.getByLabel('The earlier checkpoint, 8.').check();
  assert.equal(await section(/^Build ·/).count(), 0);
  await page.getByLabel('The updated reading, 5.').check();
  await grade(section(/^Build ·/), 'def checkpoint_difference(start, change):\n    checkpoint = start\n    start += change\n    return 2 * start - checkpoint');
  const make = section(/Reconcile two battery readings/);
  assert.match(await make.getByRole('textbox', { name: /Python code/ }).innerText(), /^# /);
  assert.equal(await button('Show full solution and explanation', make).count(), 0);
  await press('Show hint', make);
  await press('Another hint', make);
  await press('Show full solution and explanation', make);
  await make.getByText(/The test leaves 7 units/).waitFor();
  await grade(make, 'def battery_after(start, used, restored):\n    first = start - used\n    return first + (first + restored)');
  assert.equal(await button('Finish lesson').count(), 0);
  await press('Try a fresh Make problem');
  await grade(section(/Score a calibration run/), 'def calibration_score(initial, first_offset, second_offset):\n    checkpoint = initial + first_offset\n    final = checkpoint + second_offset\n    return checkpoint * 2 - final');
  await press('Finish lesson');
  await page.waitForURL(at('F01.02', true));
  await page.getByText('Fresh Make problem passed.').waitFor();
  await page.getByText('Original Make passed with help (H0, H1, H4).').waitFor();
  await page.getByText('Independent coding evidence on the transfer problem.').waitFor();
  const completed = await recordFor('F01.02');
  assert(completed.completion.independent);
  assert(completed.submissions.some(item => item.hints.includes('H4')));
  assert.equal(completed.pack.version, '1.5.0');
  assert.equal(completed.traces[0].pattern, 'snapshot-followed-rebinding');
  assert.deepEqual(completed.completion.traceIds, [completed.traces[1].id]);
  await capture('reassignment-report', section('Activity outcomes'));

  await link('Back to The Climb').press('Enter');
  await link(/Open F01.03/).press('Enter');
  await page.setViewportSize({ width: 390, height: 840 });
  if (await page.locator('html').getAttribute('data-theme') !== 'dark') await press('Switch to dark mode');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await predict('2', '1');
  await page.getByLabel('Yes, I treated equal contents as the same object').check();
  await followUp('0');
  const referenceTrace = await checkTrace('Trace references and contents', ['A', 'yes', 'yes', 'B', 'yes', 'yes', 'A', 'yes', 'yes']);
  await referenceTrace.getByText(/equal entry as the same object/).waitFor();
  assert.equal(await section(/^Modify/).count(), 0);
  await checkTrace('Trace references and contents', ['A', 'yes', 'yes', 'B', 'no', 'yes', 'A', 'yes', 'yes']);
  await grade(section(/^Modify/), 'def matching_readings(left, right):\n    return int([left] == [right])');
  await page.getByLabel('0, because the slot contains a distinct list.').check();
  await grade(section(/^Build ·/), 'def shared_slot(reading, slot):\n    original = [reading]\n    entries = [original, [reading]]\n    return int(entries[slot] is original)');
  const rack = section(/Classify a rack slot/);
  const rackEditor = rack.getByRole('textbox', { name: /Python code/ });
  await rackEditor.press('Escape');
  await page.keyboard.press('Tab');
  assert.equal(await rackEditor.evaluate(node => node === document.activeElement), false);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (screenshots) {
    await page.setViewportSize({ width: 390, height: 1050 });
    await rack.scrollIntoViewIfNeeded();
    await capture('identity-make-dark-mobile', page);
    await page.setViewportSize({ width: 390, height: 840 });
  }
  await press('Show hint', rack);
  await press('Another hint', rack);
  await press('Show full solution and explanation', rack);
  await grade(rack, 'def rack_badge(primary, spare, slot):\n    return 2 if slot in (0, 1) else int(primary == spare)');
  await press('Try a fresh Make problem');
  const handoff = section('Trace the handoff');
  await handoff.waitFor();
  assert.equal(await section(/Count duplicates across two handoffs/).count(), 0);
  await checkTrace('Trace the handoff', ['no', 'yes', 'yes', 'yes', 'no', 'no']);
  await capture('identity-transfer-trace', handoff);
  await grade(section(/Count duplicates across two handoffs/), 'def duplicate_flag(level, first, second, restore):\n    return int(first == level) + int(restore == 0 and second == level)');
  await press('Finish lesson');
  await page.waitForURL(at('F01.03', true));
  await page.getByText('Independent coding evidence on the transfer problem.').waitFor();
  await page.getByText('Trace references and contents: passed after feedback.').waitFor();
  await page.getByText('Trace the handoff: passed on the first check.').waitFor();
  const identity = await recordFor('F01.03');
  assert.equal(identity.completion.traceIds.length, 2);
  assert.equal(identity.traces[0].pattern, 'equal-implies-identical');
  await page.getByLabel('Just a little droplet (+0.5)', { exact: true }).check();
  await page.reload();
  await page.getByLabel('Just a little droplet (+0.5)', { exact: true }).waitFor();
  assert(await page.getByLabel('Just a little droplet (+0.5)', { exact: true }).isChecked());
  assert.deepEqual(await recordFor('F01.01'), pilot);
  await link('Back to The Climb').press('Enter');
  await link('View report for F01.02').press('Enter');
  await page.getByText('Fresh Make problem passed.').waitFor();
  assert.deepEqual(await recordFor('F01.02'), completed);
  // Restore a synthetic repeat right before Make. The previous session above
  // really attempted and completed the only transfer, with separately saved evidence.
  const repeat = { ...completed, id: 'synthetic-repeat', startedAt: '2099-01-01T00:00:00Z',
    completion: undefined, transferOpenedAt: undefined, hints: [],
    traces: completed.traces.filter(item => item.correct).map(item => ({ ...item, id: 'repeat-trace', seenBefore: true })),
    submissions: completed.submissions.filter(item => /\.(modify|build)$/.test(item.exercise.id)),
  };
  await page.evaluate(item => localStorage.setItem('enntor.evidence.v1.' + item.id, JSON.stringify(item)), repeat);
  await page.goto(at('F01.02'));
  await page.reload();
  await press('Show hint', make);
  await press('Another hint', make);
  await press('Show full solution and explanation', make);
  await grade(make, 'def battery_after(start, used, restored):\n    first = start - used\n    return first + (first + restored)');
  await press('Practise the transfer again');
  await page.getByText(/finish this session as practice/).waitFor();
  assert.equal(await button('Finish lesson').count(), 0);
  await grade(section(/Score a calibration run/), 'def calibration_score(initial, first_offset, second_offset):\n    checkpoint = initial + first_offset\n    return checkpoint - second_offset');
  await press('Finish lesson');
  await page.getByText('Finished as practice. No new independent coding evidence.').waitFor();
  const records = await learnerRecords();
  assert.equal(records.find(item => item.id === repeat.id).completion.independent, false);
  assert.deepEqual(records.find(item => item.id === completed.id), completed);
  console.log('Climb prerequisites, two new lessons, graded traces, alternative code, fresh and repeated transfer, archives, drafts, keyboard and reports passed.');
} finally {
  await browser.close();
}
