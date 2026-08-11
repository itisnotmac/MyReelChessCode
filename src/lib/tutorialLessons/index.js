import { BASICS_LESSONS } from './basics';
import { SPECIAL_MOVES_LESSONS } from './specialMoves';
import { ENDGAME_LESSONS } from './endgame';
import { OPENING_LESSONS } from './opening';
import { TACTICS_LESSONS } from './tactics';
import { STRATEGY_LESSONS } from './strategy';
import { ADVANCED_LESSONS } from './advanced';

export const LESSONS = [
  ...BASICS_LESSONS,
  ...SPECIAL_MOVES_LESSONS,
  ...ENDGAME_LESSONS,
  ...OPENING_LESSONS,
  ...TACTICS_LESSONS,
  ...STRATEGY_LESSONS,
  ...ADVANCED_LESSONS,
];

export const CHAPTERS = [...new Set(LESSONS.map(l => l.chapter))];

export const SECTIONS = [
  {
    name: 'Beginner',
    description: 'Board rules, piece movement & special moves',
    chapters: ['The Board', 'Pieces', 'Special Moves', 'Finishers', 'Opening Principles'],
  },
  {
    name: 'Intermediate',
    description: 'Tactical patterns & positional strategy',
    chapters: ['Chess Tactics', 'Intermediate Strategy'],
  },
  {
    name: 'Advanced',
    description: 'Master-level concepts & tournament play',
    chapters: ['Advanced Concepts'],
  },
];