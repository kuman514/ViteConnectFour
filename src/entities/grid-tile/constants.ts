import { GridTileStatus, type Cols, type Rows } from './types';

export const ROWS: Rows = 6;
export const COLS: Cols = 7;

export const MIN_ROW = 0;
export const MAX_ROW = ROWS - 1;

export const MIN_COL = 0;
export const MAX_COL = COLS - 1;

export const CIRCLE_COLOR = {
  [GridTileStatus.EMPTY]: '#EEEEEE',
  [GridTileStatus.P1]: 'oklch(63.7% 0.237 25.331)',
  [GridTileStatus.P2]: 'oklch(90.5% 0.182 98.111)',
} as const;
