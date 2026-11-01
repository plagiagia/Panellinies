// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright index.mjs.
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = []; page.on('pageerror', error => errors.push(error.message));
const origin = process.env.TEST_URL || 'http://127.0.0.1:5173';
try {
  await page.goto(origin); await page.locator('#concept-count').filter({ hasText: '23' }).waitFor();
  await page.locator('[data-answer="negative"]').click();
  assert.match(await page.locator('#lab-feedback').textContent(), /f′/);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${process.env.TEMP}/prototype-desktop.png`, fullPage: true });
  await page.goto(`${origin}/topics.html?subject=physics`);
  assert.equal(await page.locator('.topic-group').count(), 3);
  await page.goto(`${origin}/math-2025.html?focus=1#b1`);
  await page.locator('#b1 .exercise-tools').waitFor();
  assert.equal(await page.locator('.question:visible').count(), 1);
  assert.ok(await page.locator('#b .exam-body > p').first().isVisible());
  await page.locator('#b1 [data-action="done"]').click();
  await page.locator('#b1 [data-action="saved"]').click();
  await page.locator('#b1 .personal-note summary').click();
  await page.locator('#b1 textarea').first().fill('Remember the derivative.');
  await page.locator('#b1 .question-content p').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await page.locator('#b1 [data-color="yellow"]').click();
  assert.ok(await page.locator('#b1 mark').count());
  await page.reload(); await page.locator('#b1 mark').waitFor();
  assert.equal(await page.locator('#b1 [data-action="done"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#b1 textarea').first().inputValue(), 'Remember the derivative.');
  assert.equal(await page.locator('.discussion-form:visible').count(), 0);
  await page.screenshot({ path: `${process.env.TEMP}/prototype-exercise.png`, fullPage: true });
  await page.locator('.exercise-pager button').last().click();
  assert.equal(await page.locator('.question:visible').getAttribute('id'), 'b2');
  await page.locator('.focus-toggle').click();
  assert.ok(await page.locator('.question:visible').count() > 1);
  await page.goto(origin);
  assert.equal(await page.locator('#done-count').textContent(), '1');
  assert.equal(await page.locator('#saved-count').textContent(), '1');
  assert.equal(await page.locator('.review-link').count(), 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${process.env.TEMP}/prototype-mobile.png`, fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  for (const paper of ['math-2026', 'physics-2025', 'physics-2026']) {
    await page.goto(`${origin}/${paper}.html?focus=1#d1`);
    await page.locator('#d1 .exercise-tools').waitFor();
    assert.equal(await page.locator('.question:visible').count(), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${paper} mobile overflow`);
  }
  assert.deepEqual(errors, []);
  console.log('Browser checks passed: dashboard, grouping, focus, annotations, persistence, review, logged-out forms and mobile layout.');
} finally { await browser.close(); }
