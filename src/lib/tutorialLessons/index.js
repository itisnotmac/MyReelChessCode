import { BASICS_LESSONS } from './basics';
import { SPECIAL_MOVES_LESSONS } from './specialMoves';
import { ENDGAME_LESSONS } from './endgame';
import { OPENING_LESSONS } from './opening';

export const LESSONS = [
  ...BASICS_LESSONS,
  ...SPECIAL_MOVES_LESSONS,
  ...ENDGAME_LESSONS,
  ...OPENING_LESSONS,
];

export const CHAPTERS = [...new Set(LESSONS.map(l => l.chapter))];