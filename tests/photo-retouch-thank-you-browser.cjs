const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'Landingpage-Photo-Retouch');
const standalone = process.argv.includes('--standalone');
const origin = 'https://retouch.test';
const landing = origin + '/nesso-retouch/';
const thanks = origin + '/nesso-retouch-thank-you/';
const endpoint = origin + '/wp-json/nesso-lms/v1/photo-retouch-trial';
const wrapper = fs.readFileSync(path.join(root, 'block-html-photo-retouch-wp.html'), 'utf8').replaceAll('https://nesso.vn', origin);
// WordPress renders the same landing page (and wrapper) at the thank-you route.
const wrapperPage = '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">' + wrapper;
// The source repo has no WordPress release layer; append it like the builder does.
const releaseScript = '<script>' + fs.readFileSync(path.join(root, 'WP/photo-retouch-thank-you.js'), 'utf8') + '</script>';
const childHtml = standalone
  ? fs.readFileSync(path.join(root, 'nesso-photo-retouch-standalone.html'), 'utf8')
  : fs.readFileSync(path.join(source, 'index.html'), 'utf8').replace(/<\/body>/i, releaseScript + '</body>');
const screenshotDir = path.join(process.env.LOCALAPPDATA, 'NessoPhotoRetouchBuild', 'qa');
fs.mkdirSync(screenshotDir, { recursive: true });

async function run(browser, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const errors = [];
  const events = [];
  const posts = [];
  let mode = 'http-error';
  let receipt = false;
  let rendered = 0;
  const thanksRequests = [];
  let releaseSuccess;
  let requestStarted;
  const requestGate = new Promise(resolve => { requestStarted = resolve; });
  const responseGate = new Promise(resolve => { releaseSuccess = resolve; });
  await context.exposeBinding('qaEvent', (_, name) => { events.push(name); });
  await context.addInitScript(() => { window.gtag = (_, name) => window.qaEvent(name); });

  // Intercept ALL traffic: no production mail, upload, or analytics is sent.
  await context.route('**/*', async route => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.href === endpoint && req.method() === 'POST') {
      const data = await new Request(req.url(), {
        method: 'POST', headers: { 'content-type': req.headers()['content-type'] }, body: req.postDataBuffer()
      }).formData();
      posts.push(data);
      if (mode !== 'success') {
        return route.fulfill({ status: mode === 'http-error' ? 500 : 200, contentType: 'application/json', body: JSON.stringify({ ok: false, message: 'Mocked mail failure', thank_you_url: thanks }) });
      }
      requestStarted();
      await responseGate;
      receipt = true;
      return route.fulfill({
        status: 200, contentType: 'application/json',
        headers: { 'Set-Cookie': 'nesso_retouch_receipt=mock-receipt; Path=/nesso-retouch-thank-you/; Secure; HttpOnly; SameSite=Lax' },
        body: JSON.stringify({ ok: true, thank_you_url: thanks })
      });
    }
    if (req.method() !== 'GET') return route.abort();
    if (url.href === thanks) {
      const cookie = (await req.headerValue('cookie')) || '';
      thanksRequests.push({ receipt, cookie });
      if (!receipt || !cookie.includes('nesso_retouch_receipt=mock-receipt')) {
        // The real pre-render HTTP redirect is covered by the PHP test.
        return route.fulfill({ status: 403, body: 'Receipt already consumed', headers: { 'Cache-Control': 'no-store' } });
      }
      receipt = false;
      rendered += 1;
      return route.fulfill({
        contentType: 'text/html', body: wrapperPage,
        headers: { 'Cache-Control': 'no-store', 'Set-Cookie': 'nesso_retouch_receipt=; Path=/nesso-retouch-thank-you/; Max-Age=0; Secure; HttpOnly; SameSite=Lax' }
      });
    }
    if (url.href === landing) {
      return route.fulfill({ contentType: 'text/html', body: wrapperPage });
    }
    if (url.origin === origin && url.pathname.endsWith('/nesso-photo-retouch-standalone.html')) {
      return route.fulfill({ contentType: 'text/html', body: childHtml });
    }
    if (url.hostname === 'cdnjs.cloudflare.com') {
      const name = url.pathname.endsWith('/ScrollTrigger.min.js') ? 'ScrollTrigger-3.12.5.min.js' : 'gsap-3.12.5.min.js';
      return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(path.join(process.env.LOCALAPPDATA, 'NessoPhotoRetouchBuild', name)) });
    }
    if (url.origin !== origin) return route.abort();
    const relative = decodeURIComponent(url.pathname.replace(/^\/wp-content\/uploads\/2026\/10\//, '').replace(/^\//, ''));
    const target = path.resolve(source, relative === 'logo.png' ? 'assets/images/logo.png' : relative);
    if (!target.startsWith(source + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      return route.fulfill({ status: 404, body: 'Not found' });
    }
    if (/\.(mp4|webm)$/i.test(target)) return route.abort();
    const mime = { '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
    return route.fulfill({ contentType: mime[path.extname(target)] || 'application/octet-stream', body: fs.readFileSync(target) });
  });

  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(landing);
  const frame = page.frameLocator('iframe');
  await frame.locator('.btn-trial-header').click();
  await frame.locator('#trialName').fill('Local QA');
  await frame.locator('#trialEmail').fill('qa@example.test');
  await frame.locator('#trialCompany').fill('QA Studio');
  for (const failure of ['http-error', 'payload-error']) {
    mode = failure;
    await Promise.all([
      page.waitForResponse(response => response.url() === endpoint),
      frame.locator('#trialSubmitBtn').click()
    ]);
    try { await frame.locator('#trialFormMessage').filter({ hasText: 'Mocked mail failure' }).waitFor({ timeout: 8000 }); }
    catch (error) {
      console.error({ failure, posts: posts.length, errors, events, message: await frame.locator('#trialFormMessage').textContent(), urls: page.frames().map(f => f.url()) });
      throw error;
    }
    assert.equal(page.url(), landing);
    assert.equal(rendered, 0);
    assert(!events.includes('nesso_retouch_trial_submit_success'));
  }
  mode = 'success';
  await frame.locator('#trialTestForm').evaluate(form => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await requestGate;
  assert.equal(posts.length, 3, 'Pending duplicate submit must be ignored');
  releaseSuccess();
  await frame.locator('#trialSuccessStage').waitFor({ state: 'visible' });
  await frame.locator('#trialTestForm').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  try { await page.waitForURL(thanks, { timeout: 10000 }); }
  catch (error) {
    console.error({ url: page.url(), events, errors, thanksRequests, cookies: await context.cookies() });
    throw error;
  }
  // The outer page moved to the thank-you URL; its iframe opened the #thank-you view.
  const thanksFrame = page.frameLocator('iframe');
  await thanksFrame.getByRole('heading', { name: 'Test Images Received' }).waitFor();
  assert.equal(posts.length, 3, 'Completed duplicate submit must be ignored');
  assert.equal(events.filter(name => name === 'nesso_retouch_trial_submit_success').length, 1, 'Thank-you view must not resend the success event');
  assert.equal(rendered, 1);
  assert.equal(page.frames().length, 2, 'Thank-you must navigate the outer page and reload the iframe');
  assert.equal(new URL(page.frames()[1].url()).hash, '#thank-you');
  assert.equal(posts.at(-1).get('name'), 'Local QA');
  assert.equal(posts.at(-1).get('email'), 'qa@example.test');
  const layout = await thanksFrame.locator('#trialSuccessStage').evaluate(stage => {
    const r = stage.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      bounds: { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
    };
  });
  assert.equal(layout.overflow, false);
  assert(layout.bounds.left >= 0 && layout.bounds.right <= width && layout.bounds.top >= 0 && layout.bounds.bottom <= height, 'Thank-you view must fit viewport');
  await page.screenshot({ path: path.join(screenshotDir, `thank-you-${width}.png`) });
  await thanksFrame.locator('#trialResetBtn').click();
  await page.waitForURL(landing);
  assert(!(await thanksFrame.locator('#trialModalOverlay').getAttribute('class')).includes('is-open'));
  assert.equal(new URL(page.frames()[1].url()).hash, '', 'Closing must drop the iframe view hash');
  await page.goto(thanks);
  await page.getByText('Receipt already consumed').waitFor();
  assert.equal(rendered, 1, 'Revisit must not create a second conversion page view');
  assert.deepEqual(errors, []);
  await context.close();
  console.log(`PASS ${standalone ? 'standalone' : 'source'} ${width}x${height}: real wrapper/form, failure/no redirect, duplicate guard, one outer redirect + success event, receipt cookie, iframe #thank-you view, close returns URL to landing, revisit guard`);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await run(browser, 1440, 1000);
    await run(browser, 390, 844);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
