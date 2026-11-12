const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'Landingpage-Photo-Retouch');
const standalone = process.argv.includes('--standalone');
const motion = process.argv.includes('--motion');
const origin = 'https://retouch.test';
const endpoint = '/wp-json/nesso-lms/v1/photo-retouch-trial';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
const file = name => ({ name, mimeType: 'application/octet-stream', buffer: Buffer.from('Local mocked upload fixture') });

async function run(browser, width, height) {
  const touch = width <= 1024;
  const context = await browser.newContext({
    viewport: { width, height }, hasTouch: touch, isMobile: touch,
    reducedMotion: motion ? 'no-preference' : 'reduce'
  });
  const errors = [];
  const requests = [];
  let responseStatus = 200;
  // Every URL is intercepted. No production upload, email, or analytics request can leave this test.
  await context.route('**/*', async route => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.origin === origin && url.pathname === endpoint && req.method() === 'POST') {
      const data = await new Request(req.url(), {
        method: 'POST', headers: { 'content-type': req.headers()['content-type'] }, body: req.postDataBuffer()
      }).formData();
      requests.push(data);
      return route.fulfill({ status: responseStatus, contentType: 'application/json', body: JSON.stringify(
        responseStatus === 200 ? { ok: true, message: 'Mocked success' } : { message: 'Mocked mail failure' }
      ) });
    }
    if (req.method() !== 'GET') return route.abort();
    if (url.origin === origin && url.pathname === '/parent') {
      return route.fulfill({ contentType: 'text/html', body: '<style>body{margin:0}iframe{width:100%;height:100vh;border:0;display:block}</style><script>window.events=[];addEventListener("message",e=>{if(e.origin===location.origin)events.push(e.data)})</script><iframe src="/index.html"></iframe>' });
    }
    if (url.hostname === 'cdnjs.cloudflare.com') {
      const name = url.pathname.endsWith('/ScrollTrigger.min.js') ? 'ScrollTrigger-3.12.5.min.js' : 'gsap-3.12.5.min.js';
      return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(path.join(process.env.LOCALAPPDATA, 'NessoPhotoRetouchBuild', name)) });
    }
    if (url.origin !== origin) return route.abort();
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const target = standalone && relative === 'index.html'
      ? path.join(root, 'nesso-photo-retouch-standalone.html') : path.resolve(source, relative);
    if ((!target.startsWith(source + path.sep) && target !== path.join(root, 'nesso-photo-retouch-standalone.html')) || !fs.existsSync(target)) {
      return route.fulfill({ status: 404, body: 'Not found' });
    }
    if (/\.(mp4|webm)$/i.test(target)) return route.abort();
    return route.fulfill({ contentType: mime[path.extname(target)] || 'application/octet-stream', body: fs.readFileSync(target) });
  });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(err.message));
  await page.goto(origin + '/parent');
  const frame = page.frameLocator('iframe');
  if (touch) {
    await frame.locator('#pricing').evaluate(el => new Promise(resolve => {
      if (el.style.contentVisibility === 'auto') return resolve();
      const observer = new MutationObserver(() => {
        if (el.style.contentVisibility === 'auto') { observer.disconnect(); resolve(); }
      });
      observer.observe(el, { attributes: true });
    }));
  }
  const dialog = frame.locator('#trialModalDialog');
  const visible = async selector => frame.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
  const fillContact = async () => {
    await frame.locator('#trialName').fill('Local QA');
    await frame.locator('#trialEmail').fill('qa@example.test');
    await frame.locator('#trialCompany').fill('QA Studio');
  };
  const submit = async () => {
    const before = requests.length;
    await Promise.all([
      page.waitForResponse(r => r.url() === origin + endpoint),
      frame.locator('#trialSubmitBtn').click()
    ]);
    await page.waitForFunction(() => window.events.some(e => e.event === 'nesso_retouch_trial_submit_started'));
    assert.equal(requests.length, before + 1);
    await frame.locator('#trialSubmitBtn').evaluate(el => new Promise(resolve => {
      if (!el.disabled) return resolve();
      const obs = new MutationObserver(() => { if (!el.disabled) { obs.disconnect(); resolve(); } });
      obs.observe(el, { attributes: true });
    }));
    return requests.at(-1);
  };
  const reset = async () => {
    await frame.locator('#trialResetBtn').click();
    assert(!(await frame.locator('#trialModalOverlay').getAttribute('class')).includes('is-open'));
    assert.equal(await frame.locator('body').evaluate(el => el.style.position), '');
  };

  // Test the changed mobile menu lock before opening the actual form.
  if (width <= 1024) {
    await frame.locator('#mobile-menu-toggle').click();
    assert.equal(await frame.locator('body').evaluate(el => el.style.position), 'fixed');
    await frame.locator('.mobile-nav-cta-pill').click();
    assert.equal(await frame.locator('body').evaluate(el => el.style.position), '');
  } else {
    await frame.locator('.btn-trial-header').click();
  }
  await visible('#trialTestForm');
  assert.deepEqual(await frame.locator('#trialTestForm [required]').evaluateAll(els => els.map(el => el.name).sort()), ['company', 'email', 'name']);
  await frame.locator('#trialSubmitBtn').click();
  assert.equal(requests.length, 0, 'Empty required fields must block requests');
  await fillContact();
  await frame.locator('#trialEmail').fill('not-an-email');
  await frame.locator('#trialSubmitBtn').click();
  assert.equal(requests.length, 0, 'Invalid email must block requests');
  await fillContact();
  await frame.locator('#trialEmail').fill('someone@Gmail.com');
  await frame.locator('#trialSubmitBtn').click();
  assert.equal(requests.length, 0, 'Personal Gmail must block requests');
  assert.equal(await frame.locator('#trialFormMessage').textContent(), 'Please use your work email. Personal Gmail addresses are not accepted.');
  await fillContact();
  await frame.locator('#trialCompany').fill('   ');
  await frame.locator('#trialSubmitBtn').click();
  assert.equal(requests.length, 0, 'Blank company must block requests');
  assert.equal(await frame.locator('#trialFormMessage').textContent(), 'Please enter your company or studio name.');
  await fillContact();
  await frame.locator('[data-tier="Premium"]').click();
  await frame.locator('#trialFileInput').setInputFiles([file('Original.CR3'), file('Studio.tif'), file('Photo.jpg'), file('Fourth.NEF')]);
  assert.equal(await frame.locator('.file-chip:visible').count(), 3);
  let data = await submit();
  assert.equal(data.get('tier'), 'Premium');
  assert.equal(data.get('name'), 'Local QA');
  assert.equal(data.get('email'), 'qa@example.test');
  assert.equal(data.get('company'), 'QA Studio');
  assert.equal(data.get('submission_mode'), 'files');
  assert.deepEqual(data.getAll('files[]').map(f => f.name), ['Original.CR3', 'Studio.tif', 'Photo.jpg']);
  await visible('#trialSuccessStage');
  assert((await dialog.getAttribute('class')).includes('is-success'));
  await reset();

  await frame.locator('.btn-trial-header').click();
  await visible('#trialTestForm');
  await fillContact();
  await frame.locator('[data-tier="Medium"]').click();
  await frame.locator('#tabShareLink').click();
  await frame.locator('#trialCloudLink').fill('https://example.test/shared-folder');
  data = await submit();
  assert.equal(data.get('tier'), 'Medium');
  assert.equal(data.get('submission_mode'), 'link');
  assert.equal(data.get('cloud_link'), 'https://example.test/shared-folder');
  assert.equal(data.getAll('files[]').length, 0);
  await reset();

  await frame.locator('.btn-trial-header').click();
  await visible('#trialTestForm');
  await fillContact();
  await frame.locator('#trialFileInput').setInputFiles(file('blocked.exe'));
  assert.equal(await frame.locator('.file-chip:visible').count(), 0);
  responseStatus = 500;
  data = await submit();
  assert.equal(data.getAll('files[]').length, 0, 'Files must be optional');
  assert.equal(data.get('tier'), 'Simple');
  assert.equal(await frame.locator('#trialFormMessage').textContent(), 'Mocked mail failure');
  assert(!(await dialog.getAttribute('class')).includes('is-success'), 'Failure must not show success');
  responseStatus = 200;
  await submit();
  await reset();

  // Verify all requested RAW extensions remain selectable and accepted by the JS handler.
  await frame.locator('.btn-trial-header').click();
  await visible('#trialTestForm');
  for (const ext of ['cr3', 'cr2', 'crw', 'nef', 'arw', 'raf', 'rw2', 'orf']) {
    assert((await frame.locator('#trialFileInput').getAttribute('accept')).includes('.' + ext));
    await frame.locator('#trialFileInput').setInputFiles(file('raw.' + ext));
    assert.equal(await frame.locator('.file-chip:visible').count(), 1);
    await frame.locator('.file-chip-remove').click();
  }
  await frame.locator('#trialModalClose').click();
  await frame.locator('#trialModalOverlay').waitFor({ state: 'hidden' });
  for (const [index, tier] of ['Simple', 'Medium', 'Premium'].entries()) {
    await frame.locator('.price-card-cta').nth(index).click();
    await visible('#trialTestForm');
    assert.equal(await frame.locator('#selectedTierInput').inputValue(), tier);
    await frame.locator('#trialModalClose').click();
    await frame.locator('#trialModalOverlay').waitFor({ state: 'hidden' });
  }
  await frame.locator('#d4-cta a[href="#trial"]').click();
  await visible('#trialTestForm');
  await fillContact();
  data = await submit();
  assert.equal(data.get('tier'), 'Premium');
  await reset();
  assert.deepEqual(errors, [], 'Unexpected browser JavaScript errors');
  await context.close();
  console.log(`PASS ${standalone ? 'standalone' : 'source'} ${width}x${height} touch=${touch} motion=${motion}: modal/menu, required fields, 3 files + original names, RAW types, tier, cloud link, optional files, failure/retry/success, pricing/footer CTA; ${requests.length} mocked POSTs`);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const [w, h] of [[1440, 1000], [390, 844], [820, 1180]]) await run(browser, w, h);
  } finally {
    await browser.close();
  }
})().catch(err => { console.error(err); process.exitCode = 1; });
