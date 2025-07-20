import { beforeEach, describe, expect, it } from 'vitest';

import { COLS, MAX_ROW, ROWS } from '^/entities/grid-tile/constants';
import { GridTileStatus, type ColRange } from '^/entities/grid-tile/types';

import { useGameStore } from '.';

describe('Game store', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('should start from player 1', () => {
    const initialPlayer = useGameStore.getState().currentPlayer;
    expect(initialPlayer).toStrictEqual(GridTileStatus.P1);
  });

  it('should deploy from very ground', () => {
    const randomlySelectedCol = Math.floor(Math.random() * COLS) as ColRange;

    const deployToCol = useGameStore.getState().deployToCol;
    deployToCol(randomlySelectedCol);

    expect(
      useGameStore.getState().tiles[MAX_ROW][randomlySelectedCol]
    ).toStrictEqual(GridTileStatus.P1);

    deployToCol(randomlySelectedCol);

    expect(
      useGameStore.getState().tiles[MAX_ROW - 1][randomlySelectedCol]
    ).toStrictEqual(GridTileStatus.P2);

    deployToCol(randomlySelectedCol);

    expect(
      useGameStore.getState().tiles[MAX_ROW - 2][randomlySelectedCol]
    ).toStrictEqual(GridTileStatus.P1);

    deployToCol(randomlySelectedCol);

    expect(
      useGameStore.getState().tiles[MAX_ROW - 3][randomlySelectedCol]
    ).toStrictEqual(GridTileStatus.P2);
  });

  it('should not deploy anymore if full of column', () => {
    const randomlySelectedCol = Math.floor(Math.random() * COLS) as ColRange;

    const deployToCol = useGameStore.getState().deployToCol;

    for (let i = 0; i <= MAX_ROW; i++) {
      deployToCol(randomlySelectedCol);
    }

    const playerBeforeDeploy = useGameStore.getState().currentPlayer;

    deployToCol(randomlySelectedCol);
    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      playerBeforeDeploy
    );

    deployToCol(randomlySelectedCol);
    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      playerBeforeDeploy
    );

    deployToCol(randomlySelectedCol);
    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      playerBeforeDeploy
    );
  });

  it('should undo based on history', () => {
    const deployToCol = useGameStore.getState().deployToCol;
    for (let i = 0; i <= MAX_ROW; i++) {
      const randomlySelectedCol = Math.floor(Math.random() * COLS) as ColRange;
      deployToCol(randomlySelectedCol);
    }

    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      GridTileStatus.P1
    );
    expect(useGameStore.getState().history.length).toStrictEqual(ROWS);

    const undo = useGameStore.getState().undo;
    for (let i = 0; i <= MAX_ROW; i++) {
      const history = useGameStore.getState().history;
      const { player, coords } = history[history.length - 1];
      expect(
        useGameStore.getState().tiles[coords.row][coords.col]
      ).toStrictEqual(player);
      undo();
      expect(
        useGameStore.getState().tiles[coords.row][coords.col]
      ).toStrictEqual(GridTileStatus.EMPTY);
    }
    expect(useGameStore.getState().history.length).toStrictEqual(0);
  });

  it('should have player 1 winning in vertical', () => {
    const deployToCol = useGameStore.getState().deployToCol;
    const sequence: ColRange[] = [3, 2, 3, 2, 3, 2, 3];
    sequence.forEach((col) => deployToCol(col));
    const winner = useGameStore.getState().winner;
    expect(winner).toStrictEqual(GridTileStatus.P1);
  });

  it('should have player 2 winning in horizontal', () => {
    const deployToCol = useGameStore.getState().deployToCol;
    const sequence: ColRange[] = [0, 1, 1, 2, 2, 3, 3, 4];
    sequence.forEach((col) => deployToCol(col));
    const winner = useGameStore.getState().winner;
    expect(winner).toStrictEqual(GridTileStatus.P2);
  });

  it('should have player 2 winning in vertical', () => {
    const deployToCol = useGameStore.getState().deployToCol;
    const sequence: ColRange[] = [
      1, 4, 6, 0, 3, 6, 3, 3, 3, 4, 2, 3, 1, 2, 6, 4, 4, 3, 6, 1, 1, 2,
    ];
    sequence.forEach((col) => deployToCol(col));
    const winner = useGameStore.getState().winner;
    expect(winner).toStrictEqual(GridTileStatus.P2);
  });

  it('should have player 2 winning in diagonal', () => {
    const deployToCol = useGameStore.getState().deployToCol;
    const sequence: ColRange[] = [
      0, 1, 2, 3, 4, 4, 5, 3, 3, 2, 3, 4, 5, 6, 5, 2, 6, 5, 6, 2, 6, 6,
    ];
    sequence.forEach((col) => deployToCol(col));
    const winner = useGameStore.getState().winner;
    expect(winner).toStrictEqual(GridTileStatus.P2);
  });

  it('should have player 1 winning in reverse-diagonal', () => {
    const deployToCol = useGameStore.getState().deployToCol;
    const sequence: ColRange[] = [
      5, 1, 5, 5, 3, 4, 5, 4, 0, 4, 6, 2, 5, 3, 2, 3, 6, 6, 2, 6, 5, 6, 3, 0, 6,
      3, 0, 0, 3, 4, 4,
    ];
    sequence.forEach((col) => deployToCol(col));
    const winner = useGameStore.getState().winner;
    expect(winner).toStrictEqual(GridTileStatus.P1);
  });
});
