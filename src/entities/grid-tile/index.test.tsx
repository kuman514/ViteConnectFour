import { fireEvent, render, screen } from '@testing-library/react';

import GridTile from '.';
import { GridTileStatus } from './types';

describe('GridTile', () => {
  it('should be red when player 1 touched', () => {
    render(
      <GridTile row={0} col={0} status={GridTileStatus.P1} isDisabled={false} />
    );
    const circleColor =
      screen.getByLabelText('grid-circle-0-0').style.backgroundColor;
    expect(circleColor).toStrictEqual('rgb(255, 0, 0)');
  });

  it('should be yellow when player 2 touched', () => {
    render(
      <GridTile row={0} col={0} status={GridTileStatus.P2} isDisabled={false} />
    );
    const circleColor =
      screen.getByLabelText('grid-circle-0-0').style.backgroundColor;
    expect(circleColor).toStrictEqual('rgb(255, 255, 0)');
  });

  it('should be gray when it is vacant', () => {
    render(
      <GridTile
        row={0}
        col={0}
        status={GridTileStatus.EMPTY}
        isDisabled={false}
      />
    );
    const circleColor =
      screen.getByLabelText('grid-circle-0-0').style.backgroundColor;
    expect(circleColor).toStrictEqual('rgb(238, 238, 238)');
  });

  it('should be clickable', () => {
    const mockFn = jest.fn();
    render(
      <GridTile
        row={0}
        col={0}
        status={GridTileStatus.EMPTY}
        isDisabled={false}
        onClick={mockFn}
      />
    );
    fireEvent.click(screen.getByLabelText('grid-tile-0-0'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not be clickable when disabled', () => {
    const mockFn = jest.fn();
    render(
      <GridTile
        row={0}
        col={0}
        status={GridTileStatus.EMPTY}
        isDisabled
        onClick={mockFn}
      />
    );
    fireEvent.click(screen.getByLabelText('grid-tile-0-0'));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('should send a bubbled event from on-click button', () => {
    const mockFn = jest.fn();
    render(
      <div
        onClick={(event) => {
          if (!(event.target instanceof HTMLElement)) {
            return;
          }
          mockFn(event.target.id);
        }}
      >
        <GridTile
          row={0}
          col={0}
          status={GridTileStatus.EMPTY}
          isDisabled={false}
        />
        <GridTile
          row={0}
          col={1}
          status={GridTileStatus.EMPTY}
          isDisabled={false}
        />
      </div>
    );
    fireEvent.click(screen.getByLabelText('grid-tile-0-0'));
    expect(mockFn).toHaveBeenLastCalledWith('grid-tile-0-0');
    fireEvent.click(screen.getByLabelText('grid-tile-0-1'));
    expect(mockFn).toHaveBeenLastCalledWith('grid-tile-0-1');
  });
});
