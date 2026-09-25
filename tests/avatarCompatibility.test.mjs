import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_AVATAR, normalizeAvatarUrl } from '../src/lib/avatarCompatibility.js';

test('all nine retired photo assets fall back, including URLs with query strings', () => {
  for (const id of ['02c16919b', '326238419', '71489e4cc', 'ff6f1a039', 'ffd2fbc25', 'a9ef79a15', '8984503ad', '1d0e42eac', '849ec4fc8']) {
    const url = `https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/${id}_retired.jpg`;
    assert.equal(normalizeAvatarUrl(url), DEFAULT_AVATAR);
    assert.equal(normalizeAvatarUrl(`${url}?version=1`), DEFAULT_AVATAR);
  }
});

test('custom avatars and preset choices are preserved', () => {
  for (const value of [
    'preset:♘',
    'https://media.base44.com/images/public/69ab30c24c8c7db2b8432adf/custom_upload.png',
    'https://example.com/02c16919b_custom.jpg',
    'https://media.base44.com/images/public/another-app/02c16919b_custom.jpg',
  ]) assert.equal(normalizeAvatarUrl(value), value);
});

test('missing or malformed stored values use the default', () => {
  for (const value of [undefined, null, '', 42, {}]) {
    assert.equal(normalizeAvatarUrl(value), DEFAULT_AVATAR);
  }
});
