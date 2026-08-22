// BlitzSchach clock logic
// Each player starts with 30 seconds per move. Every 2 pieces lost = -1 second.
// The clock never drops below 15 seconds — the hard floor.

export const BLITZ_START_SECONDS = 30;
export const BLITZ_FLOOR_SECONDS = 15;

export function getBlitzTimeLimit(capturedCount) {
  return Math.max(BLITZ_FLOOR_SECONDS, BLITZ_START_SECONDS - Math.floor(capturedCount / 2));
}