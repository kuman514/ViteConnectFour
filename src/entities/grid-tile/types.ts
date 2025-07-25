import type { IntRange } from '^/shared/types';

export type Rows = 6;
export type Cols = 7;

export enum GridTileStatus {
  EMPTY = 0,
  P1 = 1,
  P2 = 2,
}

export type RowRange = IntRange<0, Rows>;
export type ColRange = IntRange<0, Cols>;
