// Keep account selection deterministic if legacy concurrent requests created
// duplicate PlayerAccount rows for one user.
export function selectPlayerAccount(accounts: any[] = []) {
  return [...accounts].sort((a, b) => {
    const aTime = Date.parse(a?.updated_date || a?.created_date || 0) || 0;
    const bTime = Date.parse(b?.updated_date || b?.created_date || 0) || 0;
    if (bTime !== aTime) return bTime - aTime;
    return String(b?.id || '').localeCompare(String(a?.id || ''));
  })[0] || null;
}
