const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const html = readFileSync(resolve(__dirname, '../block-html-photo-retouch-wp.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const standaloneSrc = 'https://nesso.vn/wp-content/uploads/2026/10/nesso-photo-retouch-standalone.html?v=test';

function setup({ loggedIn = false, ready = true, pathname = '/nesso-retouch/' } = {}) {
  const calls = [];
  const root = { dataset: {} };
  const iframe = { contentWindow: {}, getAttribute: name => (name === 'data-src' ? standaloneSrc : null) };
  const classes = new Set(loggedIn ? ['logged-in'] : []);
  let listener;
  let pageshow;
  let timer;
  const redirects = [];
  const replacements = [];
  const historyUrls = [];
  let navigation;
  const window = {
    location: {
      origin: 'https://nesso.vn', pathname,
      assign: url => redirects.push(url),
      replace: url => replacements.push(url)
    },
    history: { replaceState(state, title, url) { historyUrls.push(url); window.location.pathname = url; } },
    addEventListener(type, handler) {
      if (type === 'message') listener = handler;
      if (type === 'pageshow') pageshow = handler;
    },
    setInterval(callback) { timer = callback; return 1; },
    clearInterval() { timer = null; },
    setTimeout(callback) { navigation = callback; return 2; }
  };
  const document = {
    getElementById: (id) => id.endsWith('-embed') ? root : iframe,
    documentElement: { classList: { add() {} } },
    body: { classList: { add: (name) => classes.add(name), contains: (name) => classes.has(name) } }
  };
  const enableTag = () => { window.gtag = (...args) => calls.push(args); };
  if (ready) enableTag();
  runInNewContext(script, { window, document, URL });
  return {
    calls, redirects, replacements, historyUrls, iframe,
    navigate: () => navigation && navigation(), enableTag, tick: () => timer && timer(),
    restore: persisted => pageshow({ persisted }),
    emit(data, overrides = {}) {
      listener({ origin: window.location.origin, source: iframe.contentWindow, data, ...overrides });
    }
  };
}

const event = (parameters = {}) => ({
  type: 'nesso-photo-retouch-analytics',
  event: 'nesso_retouch_cta_click',
  parameters
});

test('one trusted iframe click sends one event to the connected GA4 property', () => {
  const app = setup();
  app.emit(event({ cta_location: 'pricing', email: 'private@example.com', file_name: 'private.cr3' }));
  assert.equal(app.calls.length, 1);
  const [command, name, params] = app.calls[0];
  assert.equal(command, 'event');
  assert.equal(name, 'nesso_retouch_cta_click');
  assert.equal(params.send_to, 'G-Y3X71JL6VB');
  assert.equal(params.cta_location, 'pricing');
  assert.equal(params.page_location, 'https://nesso.vn/nesso-retouch/');
  assert.equal(params.email, undefined);
  assert.equal(params.file_name, undefined);
});

test('untrusted origins, windows and unknown events are ignored', () => {
  const app = setup();
  app.emit(event(), { origin: 'https://other.example' });
  app.emit(event(), { source: {} });
  app.emit({ ...event(), event: 'unknown' });
  assert.equal(app.calls.length, 0);
});

test('logged-in WordPress users stay excluded', () => {
  const app = setup({ loggedIn: true });
  app.emit(event());
  assert.equal(app.calls.length, 0);
});

test('events wait for Site Kit tag initialization without duplicates', () => {
  const app = setup({ ready: false });
  app.emit(event());
  app.tick();
  assert.equal(app.calls.length, 0);
  app.enableTag();
  app.tick();
  app.tick();
  assert.equal(app.calls.length, 1);
});

test('a missing Google tag never causes an endless retry', () => {
  const app = setup({ ready: false });
  app.emit(event());
  for (let i = 0; i < 60; i++) app.tick();
  app.enableTag();
  app.tick();
  assert.equal(app.calls.length, 0);
});

const thanks = { type: 'nesso-photo-retouch-thank-you', url: 'https://nesso.vn/nesso-retouch-thank-you/' };
const success = { ...event(), event: 'nesso_retouch_trial_submit_success' };

test('redirect only follows a trusted successful submission, even without analytics', () => {
  const app = setup({ ready: false });
  app.emit(thanks);
  app.navigate();
  assert.equal(app.redirects.length, 0);
  app.emit(success);
  app.emit(thanks);
  app.navigate();
  assert.deepEqual(app.redirects, [thanks.url]);
});

test('redirect rejects foreign origins, frames and non-approved destinations', () => {
  const app = setup();
  app.emit(success);
  app.emit(thanks, { origin: 'https://attacker.test' });
  app.emit(thanks, { source: {} });
  for (const url of ['https://attacker.test/nesso-retouch-thank-you/', '/other/', '/nesso-retouch-thank-you/?email=x', 'javascript:alert(1)']) {
    app.emit({ ...thanks, url });
  }
  app.navigate();
  assert.equal(app.redirects.length, 0);
});

const thanksPath = '/nesso-retouch-thank-you/';
const closed = { type: 'nesso-photo-retouch-thank-you-closed' };

test('the landing route loads the standalone without a view hash', () => {
  const app = setup();
  assert.equal(app.iframe.src, standaloneSrc);
});

test('the thank-you route opens the iframe thank-you view', () => {
  const app = setup({ pathname: thanksPath });
  assert.equal(app.iframe.src, standaloneSrc + '#thank-you');
});

test('closing the thank-you view returns the parent URL to the landing once', () => {
  const app = setup({ pathname: thanksPath });
  app.emit(closed, { origin: 'https://attacker.test' });
  app.emit(closed, { source: {} });
  assert.deepEqual(app.historyUrls, []);
  app.emit(closed);
  app.emit(closed);
  assert.deepEqual(app.historyUrls, ['/nesso-retouch/']);
});

test('a closed message never rewrites the landing URL', () => {
  const app = setup();
  app.emit(closed);
  assert.deepEqual(app.historyUrls, []);
});

test('a back/forward cache restore of the thank-you page returns to the landing', () => {
  const app = setup({ pathname: thanksPath });
  app.restore(false);
  assert.deepEqual(app.replacements, []);
  app.restore(true);
  assert.deepEqual(app.replacements, ['/nesso-retouch/']);
  const landing = setup();
  landing.restore(true);
  assert.deepEqual(landing.replacements, []);
});
