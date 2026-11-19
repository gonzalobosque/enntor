import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const host = process.env.ENNTOR_TEST_ORIGIN ?? 'http://127.0.0.1:5176';
const url = host + '/#/gym';
const browser = await chromium.launch();
const correct = 'def cargo_weight(gross, pallets):\n    return gross - pallets * 4';
const incorrect = 'def cargo_weight(gross, pallets):\n    return (gross - pallets) * 4';

async function open() {
  const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
  await page.route('https://**', route => route.abort());
  page.setDefaultTimeout(15000);
  await page.goto(url);
  return page;
}

function button(page, name) {
  return page.getByRole('button', { name, exact: true });
}

async function submit(page, source, feedback) {
  await page.getByRole('textbox', { name: 'Practice Python code' }).fill(source);
  await button(page, 'Check solution').press('Enter');
  await page.getByText(feedback).first().waitFor();
}

try {
  const page = await open();
  await page.getByText(/isn’t enough saved practice/).waitFor();
  const initial = await page.getByRole('textbox', { name: 'Practice Python code' }).innerText();
  assert.match(initial, /^# Write the full function/);

  await page.evaluate(() => {
    for (const [day, reasoning] of [[1, 'rejected'], [2, undefined]]) {
      const id = 'synthetic-' + day;
      const at = '2026-01-0' + day + 'T00:00:00.000Z';
      localStorage.setItem('enntor.evidence.v1.' + id, JSON.stringify({
        schemaVersion: 1, id, lesson: { id: 'F01.01', version: '1.2.0' },
        pack: { id: 'python-ai-pilot', version: '1.2.0' }, startedAt: at, updatedAt: at,
        hints: [], followUps: [], submissions: [],
        prediction: { id: 'prediction-' + day, answer: '30', committedAt: at,
          runs: [{ status: 'completed', stdout: '22' }], hypothesis: 'addition-first', reasoning },
      }));
    }
  });
  await page.reload();
  await page.getByText(/at least two recent misses/).waitFor();
  await page.getByText('Why this workout?', { exact: true }).press('Enter');
  assert.equal(await page.getByText(/predicted 30, Python printed 22/).count(), 2);
  assert.equal(await page.getByText(/confirmed adding first/).count(), 0);

  await submit(page, incorrect, /Some public cases failed/);
  await page.getByText('Result saved in this browser.', { exact: false }).waitFor();
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    window.restoreStorage = () => { Storage.prototype.setItem = set; };
    Storage.prototype.setItem = function(key, value) {
      if (key.startsWith('enntor.gym.v1.') && JSON.parse(value).submission?.finishedAt) {
        throw new DOMException('Full', 'QuotaExceededError');
      }
      return set.call(this, key, value);
    };
  });
  await submit(page, correct, 'All public cases passed.');
  await page.getByRole('alert').getByText(/could not be saved/).waitFor();
  assert.equal(await page.getByText('Result saved in this browser.', { exact: false }).count(), 0);
  await page.evaluate(() => window.restoreStorage());
  await button(page, 'Retry saving').press('Enter');
  await page.getByText(/You passed this workout independently/).waitFor();
  await page.reload();
  await page.getByText(/You passed this workout independently/).waitFor();
  await page.getByText('Workout history (2)', { exact: true }).waitFor();
  assert.match(await page.getByRole('textbox', { name: 'Practice Python code' }).innerText(), /return gross - pallets/);
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) {
      await button(page, 'Switch to ' + theme + ' mode').press('Enter');
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  const editor = page.getByRole('textbox', { name: 'Practice Python code' });
  await editor.press('Escape');
  await page.keyboard.press('Tab');
  assert.equal(await editor.evaluate(node => node === document.activeElement), false);

  const assisted = await open();
  await button(assisted, 'Show hint').press('Enter');
  await submit(assisted, correct, 'All public cases passed.');
  await assisted.getByText(/You passed this workout with help/).waitFor();
  await assisted.reload();
  await assisted.getByText(/Passed with conceptual hints/).first().waitFor();
  await assisted.getByText(/What does the scale reading include/).waitFor();
  const records = await assisted.evaluate(() => Object.entries(localStorage)
    .filter(([key]) => key.startsWith('enntor.gym.v1.')).map(([, value]) => JSON.parse(value)));
  const attempt = records.find(record => record.kind === 'attempt');
  assert.equal(attempt.independent, false);
  assert.deepEqual(attempt.submission.hints, ['H0']);
  assert.equal(attempt.recommendation.reason, 'insufficient');
  console.log('Gym recommendation, execution, persistence, save recovery, and keyboard checks passed');
} finally {
  await browser.close();
}
