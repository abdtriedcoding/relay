import { chromium } from '@playwright/test';

const ORG_ID = 'org_3MT7qnagkXLD7tsKo7KvJk8HYY1';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));

try {
  await page.goto(`http://localhost:3001/?orgId=${ORG_ID}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  console.log('inputs:', await page.locator('input').evaluateAll((els) => els.map((e) => ({ placeholder: e.placeholder, type: e.type }))));
  const inputs = page.locator('input');
  if (await inputs.count() >= 2) {
    await inputs.nth(0).fill('Demo Visitor');
    await inputs.nth(1).fill('demo-visitor@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(6000);
  }
  const start = page.getByRole('button', { name: 'Start chat' });
  if (await start.count()) {
    await start.click();
    await page.waitForTimeout(6000);
  }
  console.log('url:', page.url());
  console.log('body:', (await page.locator('body').innerText()).slice(0, 900));
  console.log('errors:', errors.slice(0, 5));
  await page.screenshot({ path: 'C:/Users/abdullah/AppData/Local/Temp/opencode/relay-widget-flow.png', fullPage: true });
} finally {
  await browser.close();
}
