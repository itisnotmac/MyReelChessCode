/**
 * Detects whether the app is running inside the Base44-generated Android TWA
 * (Trusted Web Activity / Play Store wrapper).
 *
 * Chrome TWAs set document.referrer to "android://<package-name>" on launch.
 * We also fall back to display-mode: standalone + Android UA for edge cases
 * where the referrer is stripped (e.g. after an internal redirect).
 *
 * The result is cached for the session — the platform cannot change at runtime.
 */

let cached = null;

export function isAndroidApp() {
  if (cached !== null) return cached;
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    cached = false;
    return false;
  }
  const referrerIsAndroid = document.referrer.startsWith('android://');
  const standalone =
    window.matchMedia?.('(display-mode: standalone)')?.matches ?? false;
  const isAndroidUA = /Android/i.test(navigator.userAgent);
  cached = referrerIsAndroid || (standalone && isAndroidUA);
  return cached;
}