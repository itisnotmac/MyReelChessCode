// Server timestamps are UTC but arrive without a timezone marker (for example
// "2026-09-29T04:45:13.315000"). JavaScript reads that form as LOCAL time, which
// shifts every displayed clock time. Treat it as UTC unless it says otherwise.
export function parseServerDate(value) {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  const text = String(value);
  const needsZone = text.includes('T') && !/(?:[zZ]|[+-]\d{2}:?\d{2})$/.test(text);
  return new Date(needsZone ? `${text}Z` : text);
}