import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ReplayPage from '.';

describe('ReplayPage', () => {
  it('should indicate that is replay page', async () => {
    render(<ReplayPage />);
    expect(await screen.findByText(/ViteConnectFour Replay/i)).not.toBeNull();
  });
});
