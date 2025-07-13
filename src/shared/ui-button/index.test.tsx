import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import UIButton from '.';

describe('UIButton', () => {
  it('should show the label as is', async () => {
    render(
      <UIButton
        ariaLabel="test-button"
        onClick={() => {
          throw new Error('Function not implemented.');
        }}
      >
        Aggie Koishi
      </UIButton>
    );
    expect(
      (await screen.findByLabelText('test-button')).textContent
    ).toStrictEqual('Aggie Koishi');
  });

  it('should be clickable', async () => {
    const mockFn = vi.fn();
    render(
      <UIButton ariaLabel="test-button" onClick={mockFn}>
        Aggie Koishi
      </UIButton>
    );
    fireEvent.click(await screen.findByLabelText('test-button'));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not be clickable when disabled', async () => {
    const mockFn = vi.fn();
    render(
      <UIButton isDisabled ariaLabel="test-button" onClick={mockFn}>
        Aggie Koishi
      </UIButton>
    );
    fireEvent.click(await screen.findByLabelText('test-button'));
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
