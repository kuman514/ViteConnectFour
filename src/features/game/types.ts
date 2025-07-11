import type { Cols, GridTileStatus, Rows } from '^/entities/grid-tile/types';
import type { IntRange } from '^/shared/types';

export interface HistoryNode {
  player: GridTileStatus;
  coords: [IntRange<0, Rows>, IntRange<0, Cols>];
}

export interface GameStoreState {
  tiles: GridTileStatus[][];
  currentPlayer: GridTileStatus;
  history: HistoryNode[];
}

export interface GameStoreAction {
  deployToCol: (col: IntRange<0, Cols>) => void;
  undo: () => void;
  reset: () => void;
}

export type GameStore = GameStoreState & GameStoreAction;
