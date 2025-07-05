import { render, screen } from '@testing-library/react';

import Title from '.';

describe('Title', () => {
  it('should show the title as is', async () => {
    render(<Title>Aggie Koishi</Title>);
    expect((await screen.findByLabelText('title')).textContent).toStrictEqual(
      'Aggie Koishi'
    );
  });
});
