import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { base44 } from '@/api/base44Client';
import { NATIVE_OAUTH_ERROR_KEY, parseNativeOAuthCallback } from '@/lib/nativeOAuth';

export default function NativeOAuthCallback() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return undefined;

    let listener;
    let disposed = false;
    const handledUrls = new Set();

    const handleUrl = async (rawUrl) => {
      if (disposed || handledUrls.has(rawUrl)) return;
      const result = parseNativeOAuthCallback(rawUrl);
      if (!result) return;
      handledUrls.add(rawUrl);

      if (!result.accessToken) {
        sessionStorage.setItem(
          NATIVE_OAUTH_ERROR_KEY,
          result.error || 'Sign-in did not complete. Please try again.'
        );
        try { await Browser.close(); } catch { /* Browser may already be closed. */ }
        window.location.replace('/login');
        return;
      }

      base44.auth.setToken(result.accessToken);
      try { await Browser.close(); } catch { /* Browser may already be closed. */ }
      window.location.replace('/');
    };

    const registerCallback = async () => {
      listener = await App.addListener('appUrlOpen', ({ url }) => {
        void handleUrl(url);
      });

      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) await handleUrl(launchUrl.url);
    };

    void registerCallback().catch(() => {
      if (!disposed) {
        sessionStorage.setItem(
          NATIVE_OAUTH_ERROR_KEY,
          'Unable to resume sign-in. Please try again.'
        );
      }
    });

    return () => {
      disposed = true;
      void listener?.remove();
    };
  }, []);

  return null;
}
