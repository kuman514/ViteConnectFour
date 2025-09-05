import type {
  ColRange,
  Coords,
  GridTileStatus,
  HistoryNode,
} from '^/entities/grid-tile/types';

export interface GameStoreState {
  tiles: GridTileStatus[][];
  currentPlayer: GridTileStatus;
  winner: GridTileStatus;
  winnerRange: Coords[];
  history: HistoryNode[];
}

export interface GameStoreAction {
  deployToCol: (col: ColRange) => void;
  undo: () => void;
  reset: () => void;
}

export type GameStore = GameStoreState & GameStoreAction;
