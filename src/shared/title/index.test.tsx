import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Title from '.';

describe('Title', () => {
  it('should show the title as is', async () => {
    render(<Title>Aggie Koishi</Title>);
    expect((await screen.findByLabelText('title')).textContent).toStrictEqual(
      'Aggie Koishi'
    );
  });
});
