import assert from 'node:assert/strict';
import test from 'node:test';
import { isLatencyBadgeEnabled, setLatencyBadgeEnabled } from '../src/lib/latencyPreference.js';

function installStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  });
  return values;
}

test('legacy enabled preference is reset to off on first use after the default change', () => {
  const storage = installStorage({ chessPingIndicator: 'on' });

  assert.equal(isLatencyBadgeEnabled(), false);
  assert.equal(storage.get('chessPingIndicator_v2'), 'off');
  assert.equal(storage.has('chessPingIndicator'), false);
});

test('explicit setting changes persist for future app loads', () => {
  const storage = installStorage();

  assert.equal(isLatencyBadgeEnabled(), false);
  assert.equal(setLatencyBadgeEnabled(true), true);
  assert.equal(isLatencyBadgeEnabled(), true);
  assert.equal(storage.get('chessPingIndicator_v2'), 'on');
});

test('blocked local storage keeps the badge off without throwing', () => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('storage blocked'); },
  });

  assert.equal(isLatencyBadgeEnabled(), false);
  assert.equal(setLatencyBadgeEnabled(true), false);
});
