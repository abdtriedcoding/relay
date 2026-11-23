import { chromium } from '@playwright/test';

const ORG_ID = 'org_3MT7qnagkXLD7tsKo7KvJk8HYY1';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));

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

try {
  await signIn();
  await page.goto('http://localhost:3000/files', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(12000);
  const buttons = await page.locator('button').evaluateAll((els) => els.map((e) => ({
    text: e.innerText,
    title: e.title,
    aria: e.getAttribute('aria-label'),
    html: e.outerHTML.slice(0, 300)
  })));
  console.log('buttons:', buttons.slice(0, 20));
  console.log('icon buttons:', await page.locator('button').evaluateAll((els) => els.slice(6, 11).map((e) => e.innerHTML.slice(0, 600))));
  console.log('file inputs:', await page.locator('input[type=file]').count());
  console.log('body:', (await page.locator('body').innerText()).slice(0, 800));
  console.log('errors:', errors.slice(0, 5));
} finally {
  await browser.close();
}
