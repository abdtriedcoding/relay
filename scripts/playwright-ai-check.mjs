import { chromium } from '@playwright/test';

const ORG_ID = 'org_3MT7qnagkXLD7tsKo7KvJk8HYY1';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 300)}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 300)}`);
});

try {
  await page.goto(`http://localhost:3001/?orgId=${ORG_ID}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByPlaceholder('Enter your name').waitFor({ state: 'visible', timeout: 30000 });
  await page.getByPlaceholder('Enter your name').fill('AI Check Visitor');
  await page.getByPlaceholder('Enter your email').fill('ai-check@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(5000);
  const start = page.getByRole('button', { name: 'Start chat' });
  if (await start.count()) {
    await start.click();
    await page.waitForTimeout(4000);
  }
  console.log('inputs:', await page.locator('input, textarea').evaluateAll((els) => els.map((e) => ({ tag: e.tagName, placeholder: e.placeholder, type: e.type }))));
  console.log('buttons:', await page.locator('button').allInnerTexts());

  const prompt = 'Hello, what can you help me with?';
  const textarea = page.locator('textarea').first();
  const textInput = page.locator('input[type=text]').last();
  if (await textarea.count()) {
    await textarea.fill(prompt);
    await textarea.press('Enter');
  } else if (await textInput.count()) {
    await textInput.fill(prompt);
    await textInput.press('Enter');
  }
  console.log('sent prompt:', prompt);

  await page.waitForTimeout(30000);
  console.log('body:', (await page.locator('body').innerText()).slice(0, 2000));
  console.log('errors:', errors.slice(0, 8));
  await page.screenshot({ path: 'C:/Users/abdullah/relay/screenshots/relay-ai-check.png', fullPage: true });
} finally {
  await browser.close();
}
