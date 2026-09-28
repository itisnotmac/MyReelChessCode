import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildNativeOAuthUrl,
  NATIVE_OAUTH_CALLBACK_URL,
  parseNativeOAuthCallback,
} from '../src/lib/nativeOAuth.js';

test('native provider login URLs use each Base44 provider endpoint and app callback', () => {
  const expectedPaths = {
    google: '/api/apps/auth/login',
    apple: '/api/apps/auth/apple/login',
  };

  for (const [provider, pathname] of Object.entries(expectedPaths)) {
    const url = new URL(buildNativeOAuthUrl(provider, 'app-123', 'https://reelchess.org/'));
    assert.equal(url.origin, 'https://reelchess.org');
    assert.equal(url.pathname, pathname);
    assert.equal(url.searchParams.get('app_id'), 'app-123');
    assert.equal(url.searchParams.get('from_url'), NATIVE_OAUTH_CALLBACK_URL);
  }
});

test('native provider login URLs reject unsupported providers and missing build config', () => {
  assert.throws(() => buildNativeOAuthUrl('microsoft', 'app-123', 'https://reelchess.org'));
  assert.throws(() => buildNativeOAuthUrl('google', '', 'https://reelchess.org'));
});

test('native callback parser accepts only the registered app callback and extracts its token', () => {
  assert.deepEqual(
    parseNativeOAuthCallback(`${NATIVE_OAUTH_CALLBACK_URL}?access_token=secret-token`),
    { accessToken: 'secret-token', error: null }
  );
  assert.equal(parseNativeOAuthCallback('https://reelchess.org/?access_token=secret-token'), null);
  assert.equal(parseNativeOAuthCallback('com.base69ab30c24c8c7db2b8432adf.app://oauth/other?access_token=x'), null);
});
