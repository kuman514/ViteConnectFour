import { describe, expect, it } from 'vitest';

import {
  MAX_COL,
  MAX_ROW,
  MIN_COL,
  MIN_ROW,
} from '^/entities/grid-tile/constants';
import { GridTileStatus } from '^/entities/grid-tile/types';

import {
  convertStringToTilesForTest,
  deepCopyTiles,
  getInitialTiles,
  getWinner,
} from '.';

describe('Game utils', () => {
  it('should have all values to be empty when getting initial tiles', () => {
    const tiles = getInitialTiles();
    const isValid = tiles.every((tileRow) =>
      tileRow.every((tile) => tile === GridTileStatus.EMPTY)
    );
    expect(isValid).toStrictEqual(true);
  });

  it('should have all values identical to original when deep-copying tiles', () => {
    const possibleStatus = [
      GridTileStatus.EMPTY,
      GridTileStatus.P1,
      GridTileStatus.P2,
    ];
    const tiles = getInitialTiles();
    for (let i = MIN_ROW; i <= MAX_ROW; i++) {
      for (let j = MIN_COL; j <= MAX_COL; j++) {
        tiles[i][j] =
          possibleStatus[Math.floor(Math.random() * possibleStatus.length)];
      }
    }

    const copiedTiles = deepCopyTiles(tiles);
    const isValid = copiedTiles.every((tileRow, i) =>
      tileRow.every((tile, j) => tile === tiles[i][j])
    );
    expect(isValid).toStrictEqual(true);
  });

  it('should determine winner based on deployed row-col in tiles', () => {
    const tiles = convertStringToTilesForTest(`
      0020022
      0012221
      0012221
      1021121
      1221111
      2222111
    `);

    expect(getWinner({ row: 2, col: 2, tiles }).winner).toStrictEqual(
      GridTileStatus.P1
    );

    expect(getWinner({ row: 3, col: 2, tiles }).winner).toStrictEqual(
      GridTileStatus.P2
    );

    expect(getWinner({ row: 0, col: 2, tiles }).winner).toStrictEqual(
      GridTileStatus.P2
    );

    expect(getWinner({ row: 3, col: 0, tiles }).winner).toStrictEqual(
      GridTileStatus.EMPTY
    );

    expect(getWinner({ row: 5, col: 6, tiles }).winner).toStrictEqual(
      GridTileStatus.P1
    );

    expect(getWinner({ row: 2, col: 1, tiles }).winner).toStrictEqual(
      GridTileStatus.EMPTY
    );

    expect(getWinner({ row: 0, col: 6, tiles }).winner).toStrictEqual(
      GridTileStatus.EMPTY
    );
  });
});
