import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { Capacitor } from '@capacitor/core';

export const { appId } = appParams;
const { token, functionsVersion, appBaseUrl } = appParams;
export const authRedirectBaseUrl = appBaseUrl || 'https://reelchess.org';

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  requiresAuth: false,
  appBaseUrl: authRedirectBaseUrl
});
// In the Android app, never send the WebView to the hosted website to log in or
// out. Stay on the bundled /login screen instead.
if (Capacitor.isNativePlatform()) {
  base44.auth.redirectToLogin = () => {
    window.location.replace('/login');
  };
  base44.auth.logout = (redirectUrl = '/login') => {
    try {
      localStorage.removeItem('base44_access_token');
      localStorage.removeItem('token');
    } catch { /* storage unavailable */ }
    window.location.replace(redirectUrl);
  };
}
