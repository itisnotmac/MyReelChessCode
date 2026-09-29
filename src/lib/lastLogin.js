const LAST_LOGIN_KEY = 'reelchess_last_login';
const PENDING_LOGIN_METHOD_KEY = 'reelchess_pending_login_method';
const LOGIN_METHODS = new Set(['google', 'apple', 'email']);

export function readLastLogin() {
  try {
    const raw = globalThis.localStorage.getItem(LAST_LOGIN_KEY);
    if (!raw) return null;

    const record = JSON.parse(raw);
    if (
      !record ||
      typeof record.username !== 'string' ||
      !LOGIN_METHODS.has(record.method)
    ) {
      return null;
    }

    return {
      username: record.username,
      avatar: typeof record.avatar === 'string' ? record.avatar : '',
      method: record.method,
    };
  } catch {
    return null;
  }
}

export function saveLastLogin({ username, avatar = '', method } = {}) {
  if (typeof username !== 'string' || !LOGIN_METHODS.has(method)) return false;

  try {
    globalThis.localStorage.setItem(
      LAST_LOGIN_KEY,
      JSON.stringify({ username, avatar: typeof avatar === 'string' ? avatar : '', method })
    );
    return true;
  } catch {
    return false;
  }
}

export function rememberSuccessfulLogin(user, method, email) {
  if (!user || !LOGIN_METHODS.has(method)) return false;

  const username = method === 'email'
    ? (email || user.email || user.username)
    : (user.username || user.full_name || user.name || user.email);
  const avatar = user.avatar_url || user.avatar || '';
  return saveLastLogin({ username, avatar, method });
}

export function clearLastLogin() {
  try {
    globalThis.localStorage.removeItem(LAST_LOGIN_KEY);
  } catch {
    // Storage may be unavailable or blocked by the browser.
  }
  clearPendingLoginMethod();
}

export function setPendingLoginMethod(method) {
  if (!LOGIN_METHODS.has(method)) return false;

  try {
    globalThis.sessionStorage.setItem(PENDING_LOGIN_METHOD_KEY, method);
    return true;
  } catch {
    return false;
  }
}

export function takePendingLoginMethod() {
  try {
    const method = globalThis.sessionStorage.getItem(PENDING_LOGIN_METHOD_KEY);
    globalThis.sessionStorage.removeItem(PENDING_LOGIN_METHOD_KEY);
    return LOGIN_METHODS.has(method) ? method : null;
  } catch {
    return null;
  }
}

export function clearPendingLoginMethod() {
  try {
    globalThis.sessionStorage.removeItem(PENDING_LOGIN_METHOD_KEY);
  } catch {
    // Storage may be unavailable or blocked by the browser.
  }
}
