import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const host = process.env.ENNTOR_TEST_ORIGIN ?? 'http://127.0.0.1:5176';
const lesson = host + '/#/climb/F01.01';
const report = lesson + '/results';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
  await page.route('https://**', route => route.abort());
  page.setDefaultTimeout(12000);
  const button = (name, scope = page) => scope.getByRole('button', { name, exact: true });
  const section = name => page.getByRole('region', { name });
  const verify = async (scope, label, source) => {
    await scope.getByRole('textbox', { name: label }).fill(source);
    await button('Check solution', scope).press('Enter');
    await scope.getByText('All public cases passed.', { exact: true }).waitFor();
  };
  const evidence = () => page.evaluate(() => Object.keys(localStorage)
    .filter(key => key.startsWith('enntor.evidence.v1.')).map(key => JSON.parse(localStorage.getItem(key))));
  await page.goto(report);
  await page.getByText('Finish the lesson to create a learning report.').waitFor();
  await page.getByRole('link', { name: 'Return to the lesson' }).press('Enter');
  await button('Continue to Predict').press('Enter');
  await page.getByLabel('Your prediction', { exact: true }).fill('30');
  await button('Commit prediction & run').press('Enter');
  await page.getByLabel('Yes, I added first').check();
  await page.getByLabel('Follow-up prediction').fill('13');
  await button('Check prediction').press('Enter');
  await verify(section(/^Modify/), 'Modify Python code',
    'def total(base, extra):\n    return (base + extra) * 3');
  await page.getByLabel(/from each row/).check();
  assert.equal(await section(/^Build · Build/).count(), 0);
  await page.getByLabel(/from the two-row total/).check();
  await verify(section(/^Build · Build/), 'Build Python code',
    'def available(capacity, reserved):\n    return capacity * 2 - reserved');
  const make = section(/^Make · Write a theatre/);
  assert.match(await make.getByRole('textbox').innerText(), /^# /);
  await button('Save for later').press('Enter');
  await page.getByRole('link', { name: /Open pilot lesson/ }).press('Enter');
  await make.getByRole('textbox').fill('def receipt(tickets, price):\n    return tickets * (price + 4)');
  await button('Check solution', make).press('Enter');
  await make.getByText(/Some public cases failed/).waitFor();
  assert.equal(await button('Finish lesson').count(), 0);
  await verify(make, 'Make Python code', 'def receipt(tickets, price):\n    return tickets * price + 4');
  assert.equal(await button('Save for later').count(), 0);
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    window.restoreStorage = () => { Storage.prototype.setItem = set; };
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith('enntor.evidence.v1.') && JSON.parse(value).completion) {
        throw new DOMException('Full', 'QuotaExceededError');
      }
      return set.call(this, key, value);
    };
  });
  await button('Finish lesson').press('Enter');
  await page.getByRole('alert').waitFor();
  assert.equal(page.url(), lesson);
  assert.equal((await evidence())[0].completion, undefined);
  await page.evaluate(() => window.restoreStorage());
  await button('Finish lesson').press('Enter');
  await page.waitForURL(report);
  await page.getByText('Lesson completed and saved on this browser.').waitFor();
  await page.getByText(/confirmed adding first/).waitFor();
  await page.getByText(/one plan subtracted/).waitFor();
  const [saved] = await evidence();
  for (const [label, value] of [
    ['Nah, piece of cake! (+1)', 1], ['Just a little droplet (+0.5)', 0.5],
    ['Crunched my brain a little (0)', 0], ['Almost gave me a nosebleed (-0.5)', -0.5],
    ['O_O (-1)', -1], ['Skip for now', null],
  ]) {
    await page.getByLabel(label, { exact: true }).check();
    const records = await evidence();
    assert.equal(records.length, 1);
    assert.equal(records[0].completion.sweat, value);
    assert.equal(records[0].completion.at, saved.completion.at);
  }
  await page.reload();
  assert(await page.getByLabel('Skip for now', { exact: true }).isChecked());
  await page.getByRole('link', { name: 'Revisit the lesson' }).press('Enter');
  await page.getByRole('link', { name: 'View learning report' }).press('Enter');
  await page.waitForURL(report);
  assert.equal((await evidence()).length, 1);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const legacy = { ...saved, lesson: { ...saved.lesson, version: '1.2.0' } };
  delete legacy.completion.buildId;
  delete legacy.buildPlan;
  delete legacy.buildChecks;
  await page.evaluate(session => localStorage.setItem('enntor.evidence.v1.' + session.id, JSON.stringify(session)), legacy);
  await page.reload();
  await page.getByText('Build was introduced after this session.').waitFor();
  assert.equal((await evidence())[0].completion.at, saved.completion.at);
  console.log('Stage 3 results and evidence checks passed');
} finally {
  await browser.close();
}
