import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const host = process.env.ENNTOR_TEST_ORIGIN ?? 'http://127.0.0.1:5176';
const hubUrl = host + '/#/gym';
const resultsUrl = hubUrl + '/results';
const workoutUrl = hubUrl + '/workout';
const browser = await chromium.launch();
const correct = 'def cargo_weight(gross, pallets):\n    return gross - pallets * 4';
const reversed = 'def cargo_weight(gross, pallets):\n    return pallets * 4 - gross';
const grouped = 'def cargo_weight(gross, pallets):\n    return (gross - pallets) * 4';

try {
  const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
  await page.route('https://**', route => route.abort());
  page.setDefaultTimeout(15000);
  const area = name => page.getByRole('region', { name });
  const button = (name, scope = page) => scope.getByRole('button', { name, exact: true });
  const press = (name, scope) => button(name, scope).press('Enter');
  const find = (text, scope = page) => scope.getByText(text, { exact: typeof text === 'string' }).first();
  const saved = () => page.evaluate(() => Object.entries(localStorage)
    .filter(([key]) => key.startsWith('enntor.gym.v1.')).map(([, value]) => JSON.parse(value)));
  const cargo = area(/Read a warehouse scale/);
  const transfer = area(/Count postcards/);
  const visitors = area(/Adjust a visitor forecast/);
  const warmUp = area('Warm-up');
  const current = area('Current check');
  const source = scope => scope.getByRole('textbox', { name: /Python code/ });

  async function check(scope, code, expected) {
    await source(scope).fill(code);
    await press('Check solution', scope);
    await find(expected, scope).waitFor();
  }

  await page.goto(resultsUrl);
  await find('No finished workout has been saved yet.').waitFor();
  await page.getByRole('link', { name: 'Back to The Gym', exact: true }).press('Enter');
  await find(/isn’t enough saved practice/).waitFor();

  // A 3B record remains readable and should never qualify a new session for Finish.
  await page.evaluate(() => localStorage.setItem('enntor.gym.v1.legacy-attempt', JSON.stringify({
    schemaVersion: 1, origin: 'gym', kind: 'attempt', conceptId: 'python.evaluation-order',
    exercise: { id: 'gym.F01.01.cargo', version: '1.0.0' }, independent: false,
    recommendation: { reason: 'insufficient', evidenceIds: [] },
    submission: { id: 'legacy-attempt', source: '# Older work', hints: [],
      exercise: { id: 'gym.F01.01.cargo', version: '1.0.0' }, priorPass: false,
      startedAt: '2026-01-01T09:00:00Z', finishedAt: '2026-01-01T09:00:02Z',
      grade: { verdict: 'failed', evidence: [] } },
  })));
  await page.reload();
  await press('Start workout');
  await page.waitForURL(workoutUrl);
  await find('Workout history (1)').waitFor();
  assert.equal(await button('Finish workout').count(), 0);
  assert.equal(await source(cargo).count(), 0);
  await press('Open warm-up');
  await find(/one component is absent/, warmUp).waitFor();
  await source(visitors).waitFor();
  assert.equal(await button('Run', visitors).count(), 0);
  assert.doesNotMatch(await warmUp.innerText(), /cargo_weight|4 kg|pallets|gross/);
  await check(visitors, 'def visitors(confirmed, extra):\n    return confirmed + extra * 2', 'All public cases passed.');
  await press('Complete warm-up');
  await source(cargo).waitFor();
  assert.match(await source(cargo).innerText(), /^# Write the full function/);
  assert.equal(await button('Finish workout').count(), 0);
  await page.reload();
  await press('Revisit warm-up');
  assert.match(await source(visitors).innerText(), /\(confirmed \+ extra\) \* 2/);
  await page.reload();
  await source(visitors).waitFor();
  await press('Skip warm-up');

  await check(cargo, 'def cargo_weight(gross, pallets)\n    return gross', /SyntaxError/);
  await find('Syntax error.', current).waitFor();
  await check(cargo, 'def cargo_weight(gross, pallets):\n    return gross / 0', /ZeroDivisionError/);
  await find('Runtime exception.', current).waitFor();
  await check(cargo, reversed, /Some public cases failed/);
  await find(/What should the cargo weigh when there are no pallets/, current).waitFor();
  await press('Yes, that was my reasoning', current);
  await find(/confirmed this explanation/, current).waitFor();
  await press('No, I reasoned differently', current);
  await find(/rejected this explanation/, current).waitFor();
  await check(cargo, reversed, /Some public cases failed/);
  await current.waitFor();
  assert.equal(await current.getByRole('heading', { name: 'Conceptual nudge' }).count(), 0);
  await check(cargo, correct, 'All public cases passed.');
  await find(/Passed after conceptual coaching/, current).waitFor();
  await find(/addressed an issue observed/, current).waitFor();
  await check(cargo, grouped, /Some public cases failed/);
  await find(/Does it represent kilograms or a count/, current).waitFor();

  await press('Finish workout');
  await page.waitForURL(resultsUrl);
  await find(/final evaluated check did not pass/).waitFor();
  assert.equal(await button('Finish workout').count(), 0);
  const first = (await saved()).find(record => record.kind === 'session');
  assert.equal(first.completion.outcome, 'not-passed');
  const firstTime = first.completion.at;
  for (const [label, value] of [
    ['Nah, piece of cake! (+1)', 1], ['Just a little droplet (+0.5)', 0.5],
    ['Crunched my brain a little (0)', 0], ['Almost gave me a nosebleed (-0.5)', -0.5],
    ['O_O (-1)', -1], ['Skip for now', null],
  ]) {
    await page.getByLabel(label, { exact: true }).check();
    const record = (await saved()).find(item => item.id === first.id);
    assert.equal(record.completion.sweat, value);
    assert.equal(record.completion.at, firstTime);
  }
  await page.reload();
  await find(/final evaluated check did not pass/).waitFor();
  assert.equal((await saved()).filter(({ kind, completion }) => kind === 'session' && completion).length, 1);
  await page.getByRole('link', { name: 'Back to The Gym', exact: true }).press('Enter');
  await find(/Latest finished workout: did not pass/).waitFor();

  await press('Start workout');
  await press('Skip warm-up');
  assert.match(await source(cargo).innerText(), /^# Write the full function/);
  assert.equal(await button('Finish workout').count(), 0);
  await source(cargo).fill('# remember this draft');
  await press('Save for later');
  await page.getByRole('link', { name: 'Resume workout', exact: true }).press('Enter');
  assert.equal(await source(cargo).innerText(), '# remember this draft');
  await source(cargo).press('Escape');
  await page.keyboard.press('Tab');
  assert.equal(await source(cargo).evaluate(node => node === document.activeElement), false);
  await source(cargo).fill('while True:\n    pass');
  assert.equal(await button('Run', cargo).count(), 0);
  await press('Check solution', cargo);
  await page.waitForTimeout(850);
  await press('Stop', cargo);
  await find('Execution stopped.', cargo).waitFor();
  page.once('dialog', dialog => dialog.accept());
  await press('Reset', cargo);
  await button('Revisit warm-up').waitFor();
  await source(cargo).fill('# another draft');
  page.once('dialog', dialog => dialog.accept());
  await press('Try again from scratch', cargo);
  await button('Revisit warm-up').waitFor();
  assert.match(await source(cargo).innerText(), /^# Write the full function/);

  assert.equal(await button('Show full solution and explanation', cargo).count(), 0);
  await press('Show hint', cargo);
  await press('Another hint', cargo);
  await press('Reveal implementation hint', cargo);
  await press('Show full solution and explanation', cargo);
  await find(/Three pallets weigh 12 kg/, cargo).waitFor();
  assert.match(await source(transfer).innerText(), /^# Write the full function/);
  await check(cargo, correct, 'All public cases passed.');
  await find(/Passed after seeing the full solution/, current).waitFor();
  await check(transfer, 'def postcard_total(cartons, loose):\n    return cartons * 6 + loose', 'All public cases passed.');
  await find(/Passed the transfer independently/, current).waitFor();

  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    window.restoreStorage = () => { Storage.prototype.setItem = set; };
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith('enntor.gym.v1.') && JSON.parse(value).completion) throw new DOMException('Full', 'QuotaExceededError');
      return set.call(this, key, value);
    };
  });
  await press('Finish workout');
  await page.getByRole('alert').waitFor();
  assert.equal(page.url(), workoutUrl);
  assert.equal((await saved()).filter(({ kind, completion }) => kind === 'session' && completion).length, 1);
  await page.evaluate(() => window.restoreStorage());
  await press('Retry saving');
  await page.getByRole('link', { name: 'View results', exact: true }).press('Enter');
  await page.waitForURL(resultsUrl);
  await find(/final evaluated check passed/).waitFor();
  await find('Passed the transfer independently.').waitFor();
  await find('The warehouse solution was revealed.').waitFor();
  const history = await saved();
  assert(history.some(({ submission }) => submission?.id === 'legacy-attempt'));
  assert.equal(history.filter(({ kind, completion }) => kind === 'session' && completion).length, 2);
  assert(history.some(record => record.coaching?.response?.answer === 'rejected'));
  assert(history.some(record => record.correctedAttemptIds?.length));
  await page.getByLabel('Saved workout').selectOption(first.id);
  await find(/final evaluated check did not pass/).waitFor();
  await page.getByLabel('Saved workout').selectOption(history.find(record =>
    record.kind === 'session' && record.completion?.outcome === 'passed').id);
  await find(/final evaluated check passed/).waitFor();
  // Open a new session after an older nudge, successful transfer and H4 reveal.
  await page.getByRole('link', { name: 'Back to The Gym', exact: true }).press('Enter');
  await press('Start workout');
  await press('Skip warm-up');
  await source(cargo).waitFor();
  assert.match(await source(cargo).innerText(), /^# Write the full function/);
  await button('Show hint', cargo).waitFor();
  assert.equal(await find(/Three pallets weigh 12 kg/, cargo).count(), 0);
  assert.equal(await transfer.count(), 0);
  await page.reload();
  await button('Show hint', cargo).waitFor();
  assert.equal(await transfer.count(), 0);
  await check(cargo, correct, 'All public cases passed.');
  await find(/Passed without help in this workout.*earlier practice/, current).waitFor();
  const latest = (await saved()).filter(({ kind }) => kind === 'session').sort((a, b) =>
    b.startedAt.localeCompare(a.startedAt))[0];
  const repeat = (await saved()).find(({ sessionId, kind }) => sessionId === latest.id && kind === 'attempt');
  assert.deepEqual(repeat.submission.hints, []);
  assert.deepEqual(repeat.nudgeAttemptIds, []);
  assert.equal(repeat.submission.priorPass, false);
  assert.equal(repeat.independent, false);
  assert.equal(repeat.seenInEarlierWorkout, true);
  assert.equal(await transfer.count(), 0);
  await check(cargo, reversed, /Some public cases failed/);
  await find(/What should the cargo weigh when there are no pallets/, current).waitFor();
  await press('Show hint', cargo);
  await press('Another hint', cargo);
  await press('Reveal implementation hint', cargo);
  await press('Show full solution and explanation', cargo);
  await source(transfer).waitFor();
  await find(/You have seen it before/).waitFor();
  await check(transfer, 'def postcard_total(cartons, loose):\n    return cartons * 6 + loose', 'All public cases passed.');
  await find(/Passed without help in this workout.*earlier practice/, current).waitFor();
  const repeatedTransfer = (await saved()).find(({ sessionId, activity }) => sessionId === latest.id && activity === 'transfer');
  assert.equal(repeatedTransfer.independent, false);
  assert.equal(repeatedTransfer.seenInEarlierWorkout, true);
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await press('Switch to ' + theme + ' mode');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  // Two tabs can evaluate the same unfinished workout. The stale Finish and
  // rating must preserve the first tab's saved record and both submissions.
  const context = await browser.newContext();
  await context.route('https://**', route => route.abort());
  const winner = await context.newPage();
  const stale = await context.newPage();
  const action = (tab, name) => tab.getByRole('button', { name, exact: true }).press('Enter');
  const records = () => winner.evaluate(() => Object.entries(localStorage)
    .filter(([key]) => key.startsWith('enntor.gym.v1.')).map(([, value]) => JSON.parse(value)));
  await winner.goto(hubUrl);
  await action(winner, 'Start workout');
  await action(winner, 'Skip warm-up');
  await stale.goto(workoutUrl);
  const submit = async (tab, code, verdict) => {
    const exercise = tab.getByRole('region', { name: /Read a warehouse scale/ });
    await exercise.getByRole('textbox', { name: /Python code/ }).fill(code);
    await exercise.getByRole('button', { name: 'Check solution', exact: true }).press('Enter');
    await exercise.getByText(verdict).waitFor();
  };
  await submit(winner, correct, 'All public cases passed.');
  await submit(stale, reversed, /Some public cases failed/);
  await action(winner, 'Finish workout');
  await winner.waitForURL(resultsUrl);
  await winner.getByText(/final evaluated check passed/).waitFor();
  const sessionBefore = (await records()).find(({ kind }) => kind === 'session');
  await action(stale, 'Finish workout');
  await stale.getByRole('alert').getByText(/Another tab changed this workout/).waitFor();
  assert.deepEqual((await records()).find(({ kind }) => kind === 'session'), sessionBefore);
  assert.equal((await records()).filter(({ kind }) => kind === 'attempt').length, 2);
  await stale.getByRole('link', { name: 'View results', exact: true }).press('Enter');
  await stale.waitForURL(resultsUrl);
  await action(stale, 'Dismiss');
  await winner.getByLabel('Nah, piece of cake! (+1)', { exact: true }).check();
  // An unchecked choice can be clicked even when the saved selection changes
  // back during conflict recovery.
  await stale.getByLabel('O_O (-1)', { exact: true }).click();
  await stale.getByRole('alert').getByText(/Another tab changed this workout/).waitFor();
  assert.equal(await stale.getByLabel('Nah, piece of cake! (+1)', { exact: true }).isChecked(), true);
  const savedRating = (await records()).find(({ kind }) => kind === 'session');
  assert.deepEqual(savedRating.completion, { ...sessionBefore.completion, sweat: 1 });
  await stale.getByLabel('O_O (-1)', { exact: true }).check();
  assert.deepEqual((await records()).find(({ kind }) => kind === 'session').completion,
    { ...sessionBefore.completion, sweat: -1 });
  await context.close();
  console.log('Gym warm-up, coaching, transfer, lifecycle, cross-session history, competing-tab saves, quota recovery, and responsive checks passed');
} finally {
  await browser.close();
}
