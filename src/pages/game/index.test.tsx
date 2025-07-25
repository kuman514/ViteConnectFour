import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

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
  type ColRange,
  type RowRange,
} from '^/entities/grid-tile/types';
import { useGameStore } from '^/features/game/store';

import GamePage from '.';

describe('Game page', () => {
  beforeEach(() => {
    cleanup();
    useGameStore.getState().reset();
  });

  it('should start from player 1', async () => {
    render(<GamePage />);

    // prettier-ignore
    expect((await screen.findByLabelText('current-turn')).textContent).toStrictEqual('Player 1\'s turn...');
  });

  it('should deploy from very ground', async () => {
    render(<GamePage />);

    const randomlySelectedCol = Math.floor(Math.random() * COLS) as ColRange;
    const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(
      (
        await screen.findByLabelText(
          `grid-circle-${MAX_ROW}-${randomlySelectedCol}`
        )
      ).style.backgroundColor
    ).toStrictEqual('oklch(0.637 0.237 25.331)');

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(
      (
        await screen.findByLabelText(
          `grid-circle-${MAX_ROW - 1}-${randomlySelectedCol}`
        )
      ).style.backgroundColor
    ).toStrictEqual('oklch(0.905 0.182 98.111)');

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(
      (
        await screen.findByLabelText(
          `grid-circle-${MAX_ROW - 2}-${randomlySelectedCol}`
        )
      ).style.backgroundColor
    ).toStrictEqual('oklch(0.637 0.237 25.331)');

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(
      (
        await screen.findByLabelText(
          `grid-circle-${MAX_ROW - 3}-${randomlySelectedCol}`
        )
      ).style.backgroundColor
    ).toStrictEqual('oklch(0.905 0.182 98.111)');
  });

  it('should not deploy anymore if full of column', async () => {
    render(<GamePage />);

    const randomlySelectedCol = Math.floor(Math.random() * COLS) as ColRange;
    const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;

    for (let i = 0; i <= MAX_ROW; i++) {
      fireEvent.click(
        await screen.findByLabelText(
          `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
        )
      );
      expect(useGameStore.getState().currentPlayer).toStrictEqual(
        [GridTileStatus.P1, GridTileStatus.P2][(i + 1) % 2]
      );
    }

    const playerBeforeDeploy = useGameStore.getState().currentPlayer;

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      playerBeforeDeploy
    );

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      playerBeforeDeploy
    );

    fireEvent.click(
      await screen.findByLabelText(
        `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
      )
    );
    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      playerBeforeDeploy
    );
  });

  it('should undo based on history on click undo button', async () => {
    render(<GamePage />);

    for (let i = 0; i <= MAX_ROW; i++) {
      const randomlySelectedCol = Math.floor(Math.random() * COLS) as ColRange;
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(
          `grid-tile-${randomlySelectedRow}-${randomlySelectedCol}`
        )
      );
    }

    expect(useGameStore.getState().currentPlayer).toStrictEqual(
      GridTileStatus.P1
    );
    expect(useGameStore.getState().history.length).toStrictEqual(ROWS);

    for (let i = 0; i <= MAX_ROW; i++) {
      const history = useGameStore.getState().history;
      const { player, coords } = history[history.length - 1];
      expect(
        (
          await screen.findByLabelText(
            `grid-circle-${coords.row}-${coords.col}`
          )
        ).style.backgroundColor
      ).toStrictEqual(
        [null, 'oklch(0.637 0.237 25.331)', 'oklch(0.905 0.182 98.111)'][player]
      );
      fireEvent.click(await screen.findByLabelText('undo'));
      expect(
        (
          await screen.findByLabelText(
            `grid-circle-${coords.row}-${coords.col}`
          )
        ).style.backgroundColor
      ).toStrictEqual('rgb(238, 238, 238)');
    }
    expect(
      ((await screen.findByLabelText('undo')) as HTMLButtonElement).disabled
    ).toStrictEqual(true);
  });

  it('should have player 1 winning in vertical', async () => {
    render(<GamePage />);

    const sequence: ColRange[] = [3, 2, 3, 2, 3, 2, 3];
    for (const col of sequence) {
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(`grid-tile-${randomlySelectedRow}-${col}`)
      );
    }

    expect((await screen.findByLabelText('result')).textContent).toStrictEqual(
      'Player 1 wins!'
    );
  });

  it('should have player 2 winning in horizontal', async () => {
    render(<GamePage />);

    const sequence: ColRange[] = [0, 1, 1, 2, 2, 3, 3, 4];
    for (const col of sequence) {
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(`grid-tile-${randomlySelectedRow}-${col}`)
      );
    }

    expect((await screen.findByLabelText('result')).textContent).toStrictEqual(
      'Player 2 wins!'
    );
  });

  it('should have player 2 winning in vertical', async () => {
    render(<GamePage />);

    const sequence: ColRange[] = [
      1, 4, 6, 0, 3, 6, 3, 3, 3, 4, 2, 3, 1, 2, 6, 4, 4, 3, 6, 1, 1, 2,
    ];
    for (const col of sequence) {
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(`grid-tile-${randomlySelectedRow}-${col}`)
      );
    }

    expect((await screen.findByLabelText('result')).textContent).toStrictEqual(
      'Player 2 wins!'
    );
  });

  it('should have player 2 winning in diagonal', async () => {
    render(<GamePage />);

    const sequence: ColRange[] = [
      0, 1, 2, 3, 4, 4, 5, 3, 3, 2, 3, 4, 5, 6, 5, 2, 6, 5, 6, 2, 6, 6,
    ];
    for (const col of sequence) {
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(`grid-tile-${randomlySelectedRow}-${col}`)
      );
    }

    expect((await screen.findByLabelText('result')).textContent).toStrictEqual(
      'Player 2 wins!'
    );
  });

  it('should have player 1 winning in reverse-diagonal', async () => {
    render(<GamePage />);

    const sequence: ColRange[] = [
      5, 1, 5, 5, 3, 4, 5, 4, 0, 4, 6, 2, 5, 3, 2, 3, 6, 6, 2, 6, 5, 6, 3, 0, 6,
      3, 0, 0, 3, 4, 4,
    ];
    for (const col of sequence) {
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(`grid-tile-${randomlySelectedRow}-${col}`)
      );
    }

    expect((await screen.findByLabelText('result')).textContent).toStrictEqual(
      'Player 1 wins!'
    );
  });

  it('should restore to initial state on click reset button', async () => {
    render(<GamePage />);

    const sequence: ColRange[] = [
      5, 1, 5, 5, 3, 4, 5, 4, 0, 4, 6, 2, 5, 3, 2, 3, 6, 6, 2, 6, 5, 6, 3, 0, 6,
      3, 0, 0, 3, 4, 4,
    ];
    for (const col of sequence) {
      const randomlySelectedRow = Math.floor(Math.random() * ROWS) as RowRange;
      fireEvent.click(
        await screen.findByLabelText(`grid-tile-${randomlySelectedRow}-${col}`)
      );
    }

    fireEvent.click(await screen.findByLabelText('reset'));

    for (let i = MIN_ROW; i <= MAX_ROW; i++) {
      for (let j = MIN_COL; j <= MAX_COL; j++) {
        expect(
          (await screen.findByLabelText(`grid-circle-${i}-${j}`)).style
            .backgroundColor
        ).toStrictEqual('rgb(238, 238, 238)');
      }
    }

    // prettier-ignore
    expect((await screen.findByLabelText('current-turn')).textContent).toStrictEqual('Player 1\'s turn...');
    expect(useGameStore.getState().history.length).toStrictEqual(0);
  });
});
