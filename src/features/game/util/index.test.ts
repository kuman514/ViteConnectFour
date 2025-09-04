import { describe, expect, it, vi } from 'vitest';

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
  saveAsReplay,
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

  it('should determine winner and range based on deployed row-col in tiles', () => {
    const tiles = convertStringToTilesForTest(`
      0020022
      0012221
      0012221
      1021121
      1221111
      2222111
    `);

    expect(getWinner({ row: 2, col: 2, tiles })).toStrictEqual({
      winner: GridTileStatus.P1,
      range: [
        {
          row: 2,
          col: 2,
        },
        {
          row: 3,
          col: 3,
        },
        {
          row: 4,
          col: 4,
        },
        {
          row: 5,
          col: 5,
        },
      ],
    });

    expect(getWinner({ row: 3, col: 2, tiles })).toStrictEqual({
      winner: GridTileStatus.P2,
      range: [
        {
          row: 3,
          col: 2,
        },
        {
          row: 4,
          col: 1,
        },
        {
          row: 5,
          col: 0,
        },
        {
          row: 2,
          col: 3,
        },
        {
          row: 1,
          col: 4,
        },
        {
          row: 0,
          col: 5,
        },
      ],
    });

    expect(getWinner({ row: 0, col: 2, tiles })).toStrictEqual({
      winner: GridTileStatus.P2,
      range: [
        {
          row: 0,
          col: 2,
        },
        {
          row: 1,
          col: 3,
        },
        {
          row: 2,
          col: 4,
        },
        {
          row: 3,
          col: 5,
        },
      ],
    });

    expect(getWinner({ row: 3, col: 0, tiles })).toStrictEqual({
      winner: GridTileStatus.EMPTY,
      range: [],
    });

    expect(getWinner({ row: 4, col: 5, tiles })).toStrictEqual({
      winner: GridTileStatus.P1,
      range: [
        { row: 4, col: 5 },
        { row: 4, col: 4 },
        { row: 4, col: 3 },
        { row: 4, col: 6 },
      ],
    });

    expect(getWinner({ row: 5, col: 6, tiles })).toStrictEqual({
      winner: GridTileStatus.P1,
      range: [
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
      ],
    });

    expect(getWinner({ row: 2, col: 1, tiles })).toStrictEqual({
      winner: GridTileStatus.EMPTY,
      range: [],
    });

    expect(getWinner({ row: 0, col: 6, tiles })).toStrictEqual({
      winner: GridTileStatus.EMPTY,
      range: [],
    });
  });

  it('should invoke download when saving history to replay file', () => {
    const onClickMockFn = vi.fn();
    const createObjectURLMockFn = vi.fn().mockReturnValue('blob:mock-url');
    global.URL.createObjectURL = createObjectURLMockFn;

    const anchorMock = {
      click: onClickMockFn,
      set href(val: string) {
        this._href = val;
      },
      set download(val: string) {
        this._download = val;
      },
    } as unknown as HTMLAnchorElement;

    const createElementMock = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchorMock);

    saveAsReplay([
      {
        player: GridTileStatus.EMPTY,
        coords: { row: 5, col: 1 },
      },
      {
        player: GridTileStatus.EMPTY,
        coords: { row: 4, col: 1 },
      },
      {
        player: GridTileStatus.EMPTY,
        coords: { row: 4, col: 6 },
      },
    ]);

    expect(createElementMock).toHaveBeenCalledWith('a');
    expect(createObjectURLMockFn).toHaveBeenCalled();
    expect(anchorMock._href).toBe('blob:mock-url');
    expect(anchorMock._download).toBe('replay.json');
    expect(onClickMockFn).toHaveBeenCalled();

    createElementMock.mockRestore();
  });
});
