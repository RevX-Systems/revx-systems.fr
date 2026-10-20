'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const source = readFileSync(require('node:path').join(__dirname, '../contact.js'), 'utf8');

function setup({ hostname = 'www.revx-systems.fr', honey = '', valid = true } = {}) {
  let handler;
  let resolve;
  let reject;
  const request = new Promise((yes, no) => { resolve = yes; reject = no; });
  const timers = new Map();
  const calls = [];
  const redirects = [];
  const warnings = [];
  const submit = { disabled: false };
  const notice = { hidden: true, classList: { toggle() {} }, focus() {} };
  const select = { value: '' };
  const form = {
    action: 'https://formsubmit.co/ajax/test',
    querySelector: () => submit,
    reportValidity: () => valid,
    elements: { namedItem: () => ({ value: honey }) },
    addEventListener: (_, listener) => { handler = listener; }
  };
  const location = { protocol: 'https:', hostname, search: '?objet=solution', assign: url => redirects.push(url) };
  const fetch = (url, options) => {
    calls.push({ url, options });
    options.signal.addEventListener('abort', () => reject(new Error('AbortError')));
    return request;
  };
  vm.runInNewContext(source, {
    document: { getElementById: id => ({ 'revx-contact-form': form, objet: select, 'form-feedback': notice })[id] },
    window: { fetch, FormData: class {}, AbortController, location },
    fetch, FormData: class {}, AbortController, location, URLSearchParams,
    setTimeout: (fn, ms) => { timers.set(ms, fn); return ms; },
    clearTimeout: id => timers.delete(id),
    console: { warn: (...args) => warnings.push(args) }
  });
  return {
    send: () => handler({ preventDefault() {} }),
    resolve, reject, timers, calls, redirects, submit, notice, select, warnings
  };
}

function response(body, status = 200, type = 'application/json') {
  return { ok: status >= 200 && status < 300, status, headers: { get: () => type }, json: async () => body };
}

for (const success of [true, 'true']) {
  test(`redirects only after explicit success (${typeof success})`, async () => {
    const s = setup();
    const pending = s.send();
    assert.equal(s.submit.disabled, true);
    assert.equal(s.select.value, 'solution');
    assert.deepEqual(s.redirects, []);
    s.resolve(response({ success }));
    await pending;
    assert.deepEqual(s.redirects, ['merci.html']);
    assert.equal(s.timers.size, 0);
  });
}

test('slow response keeps the page open, blocks duplicate submissions and can still succeed', async () => {
  const s = setup();
  const pending = s.send();
  assert.equal(s.timers.has(5000), false);
  s.timers.get(15000)();
  assert.match(s.notice.textContent, /Patientez/);
  assert.deepEqual(s.redirects, []);
  assert.equal(s.submit.disabled, true);
  await s.send();
  assert.equal(s.calls.length, 1);
  assert.equal(s.calls[0].options.signal.aborted, false);
  s.resolve(response({ success: true }));
  await pending;
  assert.deepEqual(s.redirects, ['merci.html']);
});

test('timeout leaves delivery unconfirmed, preserves fields and sends no retry', async () => {
  const s = setup();
  const pending = s.send();
  s.timers.get(60000)();
  await pending;
  assert.equal(s.calls[0].options.signal.aborted, true);
  assert.equal(s.calls.length, 1);
  assert.deepEqual(s.redirects, []);
  assert.match(s.notice.textContent, /peut-être été transmis/);
  assert.equal(s.submit.disabled, false);
  assert.equal(s.timers.size, 0);
});

for (const status of [429, 500, 522, 524]) {
  test(`HTTP ${status} never redirects to the success page`, async () => {
    const s = setup();
    const pending = s.send();
    s.resolve(response({ success: true }, status));
    await pending;
    assert.deepEqual(s.redirects, []);
    assert.match(s.notice.textContent, /pas reçu de confirmation/);
    assert.match(s.warnings[0][1].message, new RegExp(String(status)));
    assert.equal(s.submit.disabled, false);
    assert.equal(s.timers.size, 0);
  });
}

for (const body of [{ success: false }, { success: 'false' }, { success: true, ok: false }, { success: true, error: 'rejected' }]) {
  test(`explicit refusal: ${JSON.stringify(body)}`, async () => {
    const s = setup();
    const pending = s.send();
    s.resolve(response(body));
    await pending;
    assert.deepEqual(s.redirects, []);
    assert.match(s.notice.textContent, /refusé/);
    assert.equal(s.submit.disabled, false);
    assert.equal(s.timers.size, 0);
  });
}

for (const reply of [response({}), response(null), response('<html>error</html>', 200, 'text/html'), {
  ...response({}), json: async () => { throw new SyntaxError('Invalid JSON'); }
}]) {
  test('missing or unreadable confirmation remains uncertain', async () => {
    const s = setup();
    const pending = s.send();
    s.resolve(reply);
    await pending;
    assert.deepEqual(s.redirects, []);
    assert.match(s.notice.textContent, /pas reçu de confirmation/);
    assert.equal(s.timers.size, 0);
  });
}

test('network failure reports uncertainty without an automatic retry', async () => {
  const s = setup();
  const pending = s.send();
  s.reject(new TypeError('Failed to fetch'));
  await pending;
  assert.deepEqual(s.redirects, []);
  assert.equal(s.calls.length, 1);
  assert.match(s.notice.textContent, /doublon/);
  assert.equal(s.submit.disabled, false);
});

for (const options of [{ hostname: 'localhost' }, { honey: 'bot' }, { valid: false }]) {
  test(`does not send blocked submissions: ${JSON.stringify(options)}`, async () => {
    const s = setup(options);
    await s.send();
    assert.equal(s.calls.length, 0);
    assert.equal(s.timers.size, 0);
    assert.deepEqual(s.redirects, []);
  });
}
