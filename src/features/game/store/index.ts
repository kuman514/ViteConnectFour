import { create } from 'zustand';

import { MAX_ROW } from '^/entities/grid-tile/constants';
import { GridTileStatus, type Rows } from '^/entities/grid-tile/types';
import type { IntRange } from '^/shared/types';

import type { GameStore, HistoryNode } from '../types';
import { deepCopyTiles, getInitialTiles, getWinner } from '../util';

export const useGameStore = create<GameStore>()((set) => ({
  tiles: getInitialTiles(),
  currentPlayer: GridTileStatus.P1,
  winner: GridTileStatus.EMPTY,
  history: [],
  deployToCol: (col) => {
    set((state) => {
      if (state.tiles[0][col] !== GridTileStatus.EMPTY) {
        return state;
      }
      let row = 0 as IntRange<0, Rows>;
      while (row < MAX_ROW) {
        if (state.tiles[row + 1][col] !== GridTileStatus.EMPTY) {
          break;
        }
        row++;
      }

      const newTiles: GridTileStatus[][] = deepCopyTiles(state.tiles);
      newTiles[row][col] = state.currentPlayer;
      const newWinner = getWinner({ row, col, tiles: newTiles });

      const newHistoryNode: HistoryNode = {
        player: state.currentPlayer,
        coords: [row, col],
      };
      const newPlayer =
        state.currentPlayer === GridTileStatus.P1
          ? GridTileStatus.P2
          : GridTileStatus.P1;
      const newHistory = state.history.concat([newHistoryNode]);

      return {
        tiles: newTiles,
        currentPlayer: newPlayer,
        winner: newWinner.winner,
        history: newHistory,
      };
    });
  },
  undo: () => {
    set((state) => {
      if (state.history.length <= 0) {
        return state;
      }

      const newHistory = Array.from(state.history);
      const historyNode = newHistory.pop();
      if (!historyNode) {
        return state;
      }

      const { player, coords } = historyNode;
      const newTiles: GridTileStatus[][] = deepCopyTiles(state.tiles);
      newTiles[coords[0]][coords[1]] = GridTileStatus.EMPTY;

      return {
        tiles: newTiles,
        currentPlayer: player,
        winner: GridTileStatus.EMPTY,
        history: newHistory,
      };
    });
  },
  reset: () => {
    set(() => ({
      tiles: getInitialTiles(),
      currentPlayer: GridTileStatus.P1,
      winner: GridTileStatus.EMPTY,
      history: [],
    }));
  },
}));
