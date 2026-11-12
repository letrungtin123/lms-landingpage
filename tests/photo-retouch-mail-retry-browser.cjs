const assert = require('node:assert/strict');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const php = process.env.PHP_BINARY || path.join(process.env.LOCALAPPDATA, 'NessoPhotoRetouchBuild', 'php-8.2.34', 'php.exe');
const origin = 'https://retouch.test';
const html = execFileSync(php, [path.join(__dirname, 'photo-retouch-thank-you.test.php'), '--render-admin'], { encoding: 'utf8' }).replaceAll('https://nesso.vn', origin);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    const requests = [];
    // No production mail or network traffic: verify the actual rendered admin controls only.
    await context.route('**/*', async route => {
      const request = route.request();
      if (request.url() === origin + '/wp-admin/admin-post.php' && request.method() === 'POST') {
        requests.push(new URLSearchParams(request.postData()));
        return route.fulfill({ contentType: 'text/html', body: '<p>Mock retry received</p>' });
      }
      if (request.url() === origin + '/wp-admin/post.php' && request.method() === 'GET') {
        return route.fulfill({ contentType: 'text/html', body: html });
      }
      await route.abort();
    });
    const page = await context.newPage();
    await page.goto(origin + '/wp-admin/post.php');
    const button = page.getByRole('button', { name: 'Retry email from saved request' });
    assert.equal(await button.evaluate(el => el.form.id), 'nesso-retouch-retry-mail');
    await button.click();
    await page.getByText('Mock retry received').waitFor();
    assert.equal(requests.length, 1);
    assert.equal(requests[0].get('request_id'), '123');
    assert.equal(requests[0].get('action'), 'nesso_photo_retouch_retry_mail');
    assert.equal(requests[0].get('_wpnonce'), 'mock-nesso_retouch_retry_mail_123');
    assert.equal(requests[0].has('editor_only'), false, 'Retry must not submit the surrounding WordPress post editor');
    assert.equal(requests[0].has('files[]'), false, 'Retry must not upload files again');
    await context.close();
    console.log('PASS admin retry button: correct POST, request ID, nonce and separate form; no upload or editor save');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
