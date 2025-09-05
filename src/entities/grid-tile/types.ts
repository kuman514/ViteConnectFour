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

export interface Coords {
  row: RowRange;
  col: ColRange;
}

export interface HistoryNode {
  player: GridTileStatus;
  coords: Coords;
}

export interface WinnerInfo {
  winner: GridTileStatus;
  range: Coords[];
}
