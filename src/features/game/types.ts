import type {
  ColRange,
  GridTileStatus,
  RowRange,
} from '^/entities/grid-tile/types';

export interface Coords {
  row: RowRange;
  col: ColRange;
}

export interface HistoryNode {
  player: GridTileStatus;
  coords: Coords;
}

export interface GameStoreState {
  tiles: GridTileStatus[][];
  currentPlayer: GridTileStatus;
  winner: GridTileStatus;
  history: HistoryNode[];
}

export interface GameStoreAction {
  deployToCol: (col: ColRange) => void;
  undo: () => void;
  reset: () => void;
}

export type GameStore = GameStoreState & GameStoreAction;

export interface WinnerInfo {
  winner: GridTileStatus;
  range: Coords[];
}
