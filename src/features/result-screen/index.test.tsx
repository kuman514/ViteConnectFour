import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GridTileStatus } from '^/entities/grid-tile/types';

import ResultScreen from '.';

describe('ResultScreen', () => {
  it('should not show up when winner is not determined', () => {
    const { container } = render(
      <ResultScreen winner={GridTileStatus.EMPTY} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should show up when winner is determined 1', () => {
    const { container } = render(<ResultScreen winner={GridTileStatus.P1} />);
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild?.firstChild?.textContent).toStrictEqual(
      'Player 1 wins!'
    );
  });

  it('should show up when winner is determined 2', () => {
    const { container } = render(<ResultScreen winner={GridTileStatus.P2} />);
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild?.firstChild?.textContent).toStrictEqual(
      'Player 2 wins!'
    );
  });
});
