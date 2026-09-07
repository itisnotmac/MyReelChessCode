// A legacy race could create more than one PlayerAccount for the same user.
// Always use the record most recently touched by the backend so every screen
// reads the same ELO, Tempo balance, and daily progress.
export function selectPlayerAccount(accounts = []) {
  return [...accounts].sort((a, b) => {
    const aTime = Date.parse(a?.updated_date || a?.created_date || 0) || 0;
    const bTime = Date.parse(b?.updated_date || b?.created_date || 0) || 0;
    if (bTime !== aTime) return bTime - aTime;
    return String(b?.id || '').localeCompare(String(a?.id || ''));
  })[0] || null;
}
