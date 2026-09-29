const LATENCY_PREFERENCE_KEY = 'chessPingIndicator_v2';
const LEGACY_LATENCY_PREFERENCE_KEY = 'chessPingIndicator';

export function isLatencyBadgeEnabled() {
  try {
    const savedPreference = globalThis.localStorage.getItem(LATENCY_PREFERENCE_KEY);
    if (savedPreference === 'on') return true;
    if (savedPreference === 'off') return false;

    globalThis.localStorage.removeItem(LEGACY_LATENCY_PREFERENCE_KEY);
    globalThis.localStorage.setItem(LATENCY_PREFERENCE_KEY, 'off');
    return false;
  } catch {
    return false;
  }
}

export function setLatencyBadgeEnabled(enabled) {
  try {
    globalThis.localStorage.setItem(LATENCY_PREFERENCE_KEY, enabled ? 'on' : 'off');
    return true;
  } catch {
    return false;
  }
}
