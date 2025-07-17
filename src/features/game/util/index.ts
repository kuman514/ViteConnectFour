import {
  COLS,
  MAX_COL,
  MAX_ROW,
  MIN_COL,
  MIN_ROW,
  ROWS,
} from '^/entities/grid-tile/constants';
import {
  GridTileStatus,
  type Cols,
  type Rows,
} from '^/entities/grid-tile/types';
import type { IntRange } from '^/shared/types';

import { MINIMUM_WINNING_LENGTH } from '../constants';
import type { GameStoreState, WinnerInfo } from '../types';

export function getInitialTiles() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => GridTileStatus.EMPTY)
  );
}

export function deepCopyTiles(
  tiles: GameStoreState['tiles']
): GameStoreState['tiles'] {
  return JSON.parse(JSON.stringify(tiles));
}

export function getWinner({
  row,
  col,
  tiles,
}: {
  row: IntRange<0, Rows>;
  col: IntRange<0, Cols>;
  tiles: GameStoreState['tiles'];
}): WinnerInfo {
  const possibleWinner = tiles[row][col];

  if (possibleWinner === GridTileStatus.EMPTY) {
    return {
      winner: possibleWinner,
      range: [],
    };
  }

  const directions = [
    { rowDir: 0, colDir: 1 },
    { rowDir: 1, colDir: 0 },
    { rowDir: 1, colDir: 1 },
    { rowDir: -1, colDir: 1 },
  ];

  const resultsByDirection = directions
    .map((dir) => {
      const series = [
        {
          row: row as IntRange<0, Rows>,
          col: col as IntRange<0, Cols>,
        },
      ];

      for (let inc = -1; inc <= 1; inc += 2) {
        let range = 1;
        while (true) {
          const r = row + inc * range * dir.rowDir;
          const c = col + inc * range * dir.colDir;

          if (
            r < MIN_ROW ||
            r > MAX_ROW ||
            c < MIN_COL ||
            c > MAX_COL ||
            tiles[r][c] !== possibleWinner
          ) {
            break;
          }

          series.push({
            row: r as IntRange<0, Rows>,
            col: c as IntRange<0, Cols>,
          });

          range++;
        }
      }

      return series;
    })
    .filter((found) => found.length >= MINIMUM_WINNING_LENGTH);

  if (resultsByDirection.length === 0) {
    return {
      winner: GridTileStatus.EMPTY,
      range: [],
    };
  }

  return {
    winner: possibleWinner,
    range: resultsByDirection[0],
  };
}

export function convertStringToTilesForTest(
  stringTiles: string
): GameStoreState['tiles'] {
  const possibleStatus = [
    GridTileStatus.EMPTY,
    GridTileStatus.P1,
    GridTileStatus.P2,
  ];
  return stringTiles
    .trim()
    .split('\n')
    .map((rawValue) =>
      Array.from(rawValue.trim()).map(
        (rawNumber) => possibleStatus[parseInt(rawNumber)]
      )
    );
}
