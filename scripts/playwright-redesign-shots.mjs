import { chromium } from '@playwright/test';

const OUT = 'C:/Users/abdullah/relay/screenshots';
const ORG_ID = 'org_3MT7qnagkXLD7tsKo7KvJk8HYY1';
const email = 'relay-demo+clerk_test@example.com';
const password = 'RelayDemo2026!!';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.context().addCookies([
  { name: 'sidebar_state', value: 'true', domain: 'localhost', path: '/' }
]);
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 180)}`));
page.on('console', (m) => {
  const text = m.text();
  if (
    m.type() === 'error' &&
    !text.includes('ERR_NAME_NOT_RESOLVED') &&
    !text.includes('/monitoring') &&
    !text.includes('clerk-telemetry')
  ) {
    errors.push(`console: ${text.slice(0, 180)}`);
  }
});

async function shot(name, ms = 3500) {
  await page.waitForTimeout(ms);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`shot: ${name} (${page.url()})`);
}

async function setTheme(theme) {
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(10000);
  const body = await page.locator('body').innerText();
  if (body.includes('Every conversation has a next step') || page.url().includes('sign-in')) {
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
  }
}

try {
  // Sign in through Clerk test mode.
  await page.goto('http://localhost:3000/sign-in', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.locator('#identifier-field').fill(email);
  await page.locator('#password-field').fill(password);
  await page.locator('button.cl-formButtonPrimary').click();
  await page.waitForURL('**/sign-in#/factor-two', { timeout: 45000 });
  await page.locator('input').first().waitFor({ state: 'visible' });
  await page.getByRole('button', { name: /Resend/ }).click({ timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.locator('input').first().fill('424242');
  await page.waitForTimeout(5000);
  console.log('after otp:', page.url());
  console.log('body:', (await page.locator('body').innerText()).slice(0, 300));
  await page.waitForFunction(
    () => !location.pathname.startsWith('/sign-in'),
    { timeout: 45000 }
  );
  await page.waitForTimeout(10000);

  // Select the demo organization if the account lands on org-select.
  if (page.url().includes('org-select')) {
    const option = page.getByText('Example', { exact: true }).last();
    if (await option.count()) await option.click();
    await page.waitForTimeout(5000);
  }

  await setTheme('light');
  await shot('redesign-web-home-light', 5000);
  await page.goto('http://localhost:3000/conversations', {
    waitUntil: 'domcontentloaded'
  });
  await shot('redesign-web-conversations-light', 6000);
  await page.goto('http://localhost:3000/files', {
    waitUntil: 'domcontentloaded'
  });
  await shot('redesign-web-files-light', 6000);

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await setTheme('dark');
  await shot('redesign-web-home-dark', 5000);

  // Customer widget.
  await page.goto(`http://localhost:3001/?orgId=${ORG_ID}`, {
    waitUntil: 'domcontentloaded'
  });
  await shot('redesign-widget-selection', 6000);
  const nameInput = page.getByPlaceholder('Enter your name');
  if (await nameInput.count()) {
    await nameInput.fill('Design Tester');
    await page.getByPlaceholder('Enter your email').fill('design@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await shot('redesign-widget-selection', 5000);
  }
  const start = page.getByRole('button', { name: 'Start chat' });
  if (await start.count()) {
    await start.click();
    await page.waitForTimeout(4000);
    const input = page.getByPlaceholder('Type your message...');
    if (await input.count()) {
      await input.fill('What can you help with?');
      await input.press('Enter');
    }
  }
  await shot('redesign-widget-chat', 6000);

  // Embed demo with the floating launcher.
  await page.goto('http://localhost:3002/src/index.html', {
    waitUntil: 'domcontentloaded'
  });
  await shot('redesign-embed-demo', 4000);
  const launcher = page.locator('#relay-widget-button');
  if (await launcher.count()) {
    await launcher.click();
    await shot('redesign-embed-open', 6000);
  }

  console.log('\n== errors ==');
  console.log(errors.slice(0, 10).join('\n') || 'none');
} finally {
  await browser.close();
}
