import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearLastLogin,
  readLastLogin,
  saveLastLogin,
  setPendingLoginMethod,
  takePendingLoginMethod,
} from '../src/lib/lastLogin.js';

function installStorage(name) {
  const values = new Map();
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  });
  return values;
}

test('last-login storage persists only the username, avatar, and allowed method', () => {
  const local = installStorage('localStorage');
  assert.equal(saveLastLogin({ username: 'Knight', avatar: 'preset:♘', method: 'google' }), true);
  assert.deepEqual(readLastLogin(), { username: 'Knight', avatar: 'preset:♘', method: 'google' });
  assert.deepEqual(Object.keys(JSON.parse(local.get('reelchess_last_login'))).sort(), ['avatar', 'method', 'username']);
  assert.equal(saveLastLogin({ username: 'Knight', method: 'unsupported' }), false);
});

test('last-login storage ignores invalid records and tolerates blocked storage', () => {
  const local = installStorage('localStorage');
  local.set('reelchess_last_login', JSON.stringify({ username: 'Knight', avatar: '', method: 'password' }));
  assert.equal(readLastLogin(), null);

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('storage blocked'); },
  });
  assert.equal(readLastLogin(), null);
  assert.equal(saveLastLogin({ username: 'Knight', method: 'email' }), false);
  assert.doesNotThrow(clearLastLogin);
});

test('pending login method is one-time session state and explicit clear removes saved login', () => {
  const local = installStorage('localStorage');
  const session = installStorage('sessionStorage');
  saveLastLogin({ username: 'Knight', method: 'email' });
  assert.equal(setPendingLoginMethod('apple'), true);
  assert.equal(takePendingLoginMethod(), 'apple');
  assert.equal(takePendingLoginMethod(), null);
  clearLastLogin();
  assert.equal(local.has('reelchess_last_login'), false);
  assert.equal(session.has('reelchess_pending_login_method'), false);
});
