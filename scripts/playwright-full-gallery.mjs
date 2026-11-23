import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const ORG_ID = 'org_3MT7qnagkXLD7tsKo7KvJk8HYY1';
const email = 'relay-demo+clerk_test@example.com';
const password = 'RelayDemo2026!!';
const OUT = 'C:/Users/abdullah/relay/screenshots/relay-complete-gallery.html';

const browser = await chromium.launch({ headless: true });
const shots = [];
const errors = [];

function watch(page, label) {
  page.setDefaultNavigationTimeout(90000);
  page.setDefaultTimeout(60000);
  page.on('pageerror', (e) =>
    errors.push(`${label}: pageerror ${e.message.slice(0, 160)}`)
  );
  page.on('console', (m) => {
    const text = m.text();
    if (
      m.type() === 'error' &&
      !text.includes('ERR_NAME_NOT_RESOLVED') &&
      !text.includes('/monitoring') &&
      !text.includes('clerk-telemetry') &&
      !text.includes('CONVEX')
    ) {
      errors.push(`${label}: ${text.slice(0, 160)}`);
    }
  });
}

async function capture(page, section, name, caption, wait = 3500) {
  await page.waitForTimeout(wait);
  const buffer = await page.screenshot({ type: 'png' });
  shots.push({
    section,
    name,
    caption,
    uri: `data:image/png;base64,${buffer.toString('base64')}`
  });
  console.log(`captured ${name}`);
}

async function gotoChecked(url, marker) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(7000);
  let body = await page.locator('body').innerText();
  if (!body.includes(marker)) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(10000);
    body = await page.locator('body').innerText();
  }
  console.log(`${marker} ready:`, body.includes(marker));
}

// Web app
const webContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await webContext.addCookies([
  { name: 'sidebar_state', value: 'true', domain: 'localhost', path: '/' }
]);
const page = await webContext.newPage();
watch(page, 'web');

await page.goto('http://localhost:3000/sign-in', { waitUntil: 'domcontentloaded' });
await capture(page, 'Web dashboard', '01-sign-in', 'Sign in with the Relay brand panel and Clerk authentication', 5000);

await page.locator('#identifier-field').fill(email);
await page.locator('#password-field').fill(password);
await page.locator('button.cl-formButtonPrimary').click();
await page.waitForURL('**/sign-in#/factor-two', { timeout: 45000 });
await page.locator('input').first().waitFor({ state: 'visible' });
await page.getByRole('button', { name: /Resend/ }).click({ timeout: 60000 });
await page.waitForTimeout(3000);
await page.locator('input').first().fill('424242');
await page.waitForTimeout(6000);
if (page.url().includes('sign-in')) {
  const button = page.locator('button.cl-formButtonPrimary:not([disabled])');
  if (await button.count()) await button.first().click();
}
await page.waitForFunction(() => !location.pathname.startsWith('/sign-in'), null, { timeout: 45000 });
await page.waitForTimeout(12000);
if (page.url().includes('org-select')) {
  const example = page.getByText('Example', { exact: true }).last();
  if (await example.count()) await example.click();
  await page.waitForTimeout(6000);
}

await page.evaluate(() => localStorage.setItem('theme', 'light'));
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(7000);
await capture(page, 'Web dashboard', '02-home-light', 'Workspace home in light theme', 2000);

await page.goto('http://localhost:3000/conversations', { waitUntil: 'domcontentloaded' });
await capture(page, 'Web dashboard', '03-conversations', 'Operator inbox with conversation list and status markers', 6000);

const firstConversation = page.locator('a[href^="/conversations/"]').first();
if (await firstConversation.count()) {
  const href = await firstConversation.getAttribute('href');
  if (href) {
    await page.goto(`http://localhost:3000${href}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(9000);
  }
  console.log('detail url:', page.url());
  const operatorInput = page.getByPlaceholder('Type your response as an operator...');
  if (await operatorInput.count()) {
    await operatorInput.fill('Thanks for reaching out. I can help with that.');
    await operatorInput.press('Enter');
    await page.waitForTimeout(7000);
  }
  await capture(page, 'Web dashboard', '04-conversation-detail', 'Conversation thread with an operator reply and AI assist controls', 3000);
}

await gotoChecked('http://localhost:3000/files', 'Knowledge Base');
await capture(page, 'Web dashboard', '05-files', 'Knowledge base with document management', 6000);
const addFile = page.getByRole('button', { name: 'Add File' });
if (await addFile.count()) {
  await addFile.click();
  await capture(page, 'Web dashboard', '05b-files-upload-dialog', 'Knowledge base upload dialog', 2500);
  const closeDialog = page.getByRole('button', { name: 'Close' });
  if (await closeDialog.count()) await closeDialog.click();
}

await gotoChecked('http://localhost:3000/customization', 'Widget Customization');
await capture(page, 'Web dashboard', '06-customization', 'Widget customization form', 6000);

await page.goto('http://localhost:3000/integrations', { waitUntil: 'domcontentloaded' });
await capture(page, 'Web dashboard', '07-integrations', 'Setup and integrations with organization ID', 6000);
await page.waitForTimeout(2000);
let integrationTile = page.locator('button:has(img[alt="HTML"])');
if (!(await integrationTile.count())) {
  integrationTile = page.locator('button:has(img)').first();
}
console.log('integration tiles:', await page.locator('button:has(img)').count());
if (await integrationTile.count()) {
  await integrationTile.click();
  await capture(page, 'Web dashboard', '08-embed-dialog', 'Embed snippet dialog', 2500);
  const close = page.getByRole('button', { name: 'Close' });
  if (await close.count()) await close.click();
}

await gotoChecked('http://localhost:3000/plugins/vapi', 'VAPI Plugin');
await capture(page, 'Web dashboard', '09-voice-assistant', 'Voice assistant plugin setup', 6000);

await page.goto('http://localhost:3000/billing', { waitUntil: 'domcontentloaded' });
await capture(page, 'Web dashboard', '10-billing', 'Plans and billing', 6000);

await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.setItem('theme', 'dark'));
await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);
await capture(page, 'Web dashboard', '11-home-dark', 'Workspace home in dark theme', 2000);

// Widget app, fresh context so the visitor starts unauthenticated
const widgetContext = await browser.newContext({ viewport: { width: 1000, height: 760 } });
const widget = await widgetContext.newPage();
watch(widget, 'widget');
await widget.goto(`http://localhost:3001/?orgId=${ORG_ID}`, { waitUntil: 'domcontentloaded' });
await capture(widget, 'Chat widget', '12-widget-auth', 'Visitor details step', 7000);

await widget.getByPlaceholder('Enter your name').fill('Gallery Visitor');
await widget.getByPlaceholder('Enter your email').fill('gallery@example.com');
await widget.getByRole('button', { name: 'Continue' }).click();
await capture(widget, 'Chat widget', '13-widget-selection', 'Contact options after sign in', 6000);

const startChat = widget.getByRole('button', { name: 'Start chat' });
if (await startChat.count()) {
  await startChat.click();
  await widget.waitForTimeout(5000);
  const input = widget.getByPlaceholder('Type your message...');
  if (await input.count()) {
    await input.fill('Do you have a trial plan?');
    await input.press('Enter');
    await widget.waitForTimeout(9000);
    await input.fill('How do I install the widget?');
    await input.press('Enter');
    await widget.waitForTimeout(9000);
  }
  await capture(widget, 'Chat widget', '14-widget-chat', 'Two message AI exchange with the visitor bubble and assistant replies', 3000);
}

const backButton = widget.locator('header button').first();
if (await backButton.count()) await backButton.click();
await widget.waitForTimeout(3000);
const footerButtons = widget.locator('footer button');
if (await footerButtons.count()) {
  await footerButtons.nth(1).click();
  await capture(widget, 'Chat widget', '15-widget-inbox', 'Visitor inbox screen', 4000);
}

const errorContext = await browser.newContext({ viewport: { width: 1000, height: 760 } });
const errorPage = await errorContext.newPage();
await errorPage.goto('http://localhost:3001/?orgId=org_invalid', { waitUntil: 'domcontentloaded' });
await capture(errorPage, 'Chat widget', '16-widget-error', 'Error state for an invalid organization', 7000);

// Embed app
const embedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const embed = await embedContext.newPage();
watch(embed, 'embed');
await embed.goto('http://localhost:3002/src/index.html', { waitUntil: 'domcontentloaded' });
await capture(embed, 'Embed loader', '17-embed-demo', 'Embed demo page with the new launcher', 4000);
await embed.locator('#orgId').fill(ORG_ID);
const initialize = embed.getByRole('button', { name: 'Initialize Widget' });
if (await initialize.count()) await initialize.click();
await embed.waitForTimeout(3000);
const launcher = embed.locator('#relay-widget-button');
if (await launcher.count()) {
  await launcher.click();
  await capture(embed, 'Embed loader', '18-embed-open', 'Floating launcher with the widget open in an iframe', 7000);
}

await browser.close();

const sections = [...new Set(shots.map((s) => s.section))];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relay - complete interface gallery</title>
<style>
  :root { --ink:#0e2229; --paper:#f3f5f2; --signal:#ffc94a; --muted:#56696e; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink); font-family:'Segoe UI',Arial,sans-serif; }
  header { background:var(--ink); color:#f3f5f2; padding:40px 6vw 36px; border-bottom:4px solid var(--signal); }
  header h1 { margin:0; font-family:'Trebuchet MS',sans-serif; font-size:clamp(2rem,4vw,3.25rem); letter-spacing:-0.04em; }
  header p { margin:12px 0 0; max-width:46ch; color:#c3d3cd; line-height:1.6; }
  main { max-width:1160px; margin:0 auto; padding:0 6vw 80px; }
  section { margin-top:56px; }
  section h2 { font-family:'Trebuchet MS',sans-serif; font-size:1.6rem; letter-spacing:-0.03em; border-bottom:1px solid #ccd7d1; padding-bottom:12px; }
  figure { margin:32px 0 0; background:#fbfcfa; border:1px solid #ccd7d1; border-top:3px solid var(--signal); }
  figure img { display:block; width:100%; height:auto; }
  figcaption { padding:14px 18px; font-size:0.9rem; color:var(--muted); }
  .tag { display:inline-block; background:var(--signal); color:var(--ink); padding:2px 8px; font-size:0.75rem; font-weight:700; margin-right:10px; }
  footer { padding:24px 6vw 40px; color:var(--muted); font-size:0.85rem; }
</style>
</head>
<body>
<header>
  <h1>Relay interface gallery</h1>
  <p>Every screen captured from the running monorepo: the web dashboard, the customer chat widget, and the embeddable loader. Images are embedded in this file.</p>
</header>
<main>
${sections
  .map(
    (section) => `<section>
  <h2>${section}</h2>
  ${shots
    .filter((s) => s.section === section)
    .map(
      (s) => `<figure>
    <img src="${s.uri}" alt="${s.caption}">
    <figcaption><span class="tag">${s.name}</span>${s.caption}</figcaption>
  </figure>`
    )
    .join('\n')}
</section>`
  )
  .join('\n')}
</main>
<footer>${shots.length} screenshots. Captured with Playwright on ${new Date().toISOString().slice(0, 10)}.</footer>
</body>
</html>`;

writeFileSync(OUT, html);
console.log(`\nwrote ${OUT}`);
console.log(`screenshots: ${shots.length}`);
console.log(`errors: ${errors.slice(0, 5).join(' | ') || 'none'}`);
