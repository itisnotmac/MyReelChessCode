export const NATIVE_OAUTH_CALLBACK_URL = 'com.base69ab30c24c8c7db2b8432adf.app://oauth/callback';
export const NATIVE_OAUTH_ERROR_KEY = 'reelchess_native_oauth_error';

const PROVIDER_PATHS = {
  google: '',
  apple: '/apple',
};

export function buildNativeOAuthUrl(provider, appId, appBaseUrl) {
  const providerPath = PROVIDER_PATHS[provider];
  if (providerPath === undefined) {
    throw new Error('This sign-in provider is not supported.');
  }
  if (!appId || !appBaseUrl) {
    throw new Error('Social sign-in is not configured for this build.');
  }

  const baseUrl = appBaseUrl.replace(/\/+$/, '');
  const url = new URL(`${baseUrl}/api/apps/auth${providerPath}/login`);
  url.searchParams.set('app_id', appId);
  url.searchParams.set('from_url', NATIVE_OAUTH_CALLBACK_URL);
  return url.toString();
}

export function parseNativeOAuthCallback(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (
      url.protocol !== 'com.base69ab30c24c8c7db2b8432adf.app:' ||
      url.hostname !== 'oauth' ||
      url.pathname !== '/callback'
    ) {
      return null;
    }

    return {
      accessToken: url.searchParams.get('access_token'),
      error: url.searchParams.get('error'),
    };
  } catch {
    return null;
  }
}
