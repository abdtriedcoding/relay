import { chromium } from '@playwright/test';

const ORG_ID = 'org_3MT7qnagkXLD7tsKo7KvJk8HYY1';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
page.on('console', (m) => {
  if (m.type() === 'error' && !m.text().includes('ERR_NAME_NOT_RESOLVED') && !m.text().includes('ERR_INTERNET_DISCONNECTED')) {
    errors.push(`console: ${m.text().slice(0, 200)}`);
  }
});

async function signIn() {
  await page.goto('http://localhost:3000/sign-in', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('#identifier-field').fill('relay-demo+clerk_test@example.com');
  await page.locator('#password-field').fill('RelayDemo2026!!');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForURL('**/sign-in#/factor-two', { timeout: 45000 });
  await page.locator('input').first().waitFor({ state: 'visible' });
  await page.getByRole('button', { name: /Resend/ }).click({ timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.locator('input').first().fill('424242');
  await page.waitForURL('http://localhost:3000/', { timeout: 45000 });
  await page.waitForTimeout(12000);
}

async function selectOrg() {
  const trigger = page.locator('.cl-organizationSwitcherTrigger');
  if (await trigger.count()) {
    await trigger.click();
    await page.waitForTimeout(1500);
    const example = page.getByText('Example', { exact: true }).last();
    if (await example.count()) await example.click();
    await page.waitForTimeout(6000);
  }
}

async function check(label, url, shot) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(12000);
  const body = (await page.locator('body').innerText()).slice(0, 500);
  console.log(`\n== ${label} ==`);
  console.log('url:', page.url());
  console.log('body:', body);
  await page.screenshot({ path: `C:/Users/abdullah/AppData/Local/Temp/opencode/${shot}.png`, fullPage: true });
  return body;
}

try {
  await signIn();
  await selectOrg();
  console.log('signed in:', page.url());

  const dashboard = await check('dashboard', 'http://localhost:3000/', 'relay-dashboard');
  const files = await check('files', 'http://localhost:3000/files', 'relay-files');
  const conversations = await check('conversations', 'http://localhost:3000/conversations', 'relay-conversations');
  await check('customization', 'http://localhost:3000/customization', 'relay-customization');
  const widget = await check('widget', `http://localhost:3001/?orgId=${ORG_ID}`, 'relay-widget');

  console.log('\n== summary ==');
  console.log('dashboard ok:', dashboard.includes('Welcome to Relay'));
  console.log('files ok:', files.includes('Knowledge Base'));
  console.log('conversations ok:', !conversations.includes('Application error'));
  console.log('widget ok:', !widget.includes('No organization ID found'));
  console.log('errors:', errors.slice(0, 8));
} finally {
  await browser.close();
}
