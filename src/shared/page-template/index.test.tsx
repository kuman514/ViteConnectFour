import { render } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';

import PageTemplate from '.';

describe('PageTemplate', () => {
  it('should match with snapshot', () => {
    const Stub = createRoutesStub([
      {
        path: 'pages',
        Component: PageTemplate,
        children: [
          {
            path: 'koishi',
            Component: () => <div>Aggie Koishi</div>,
          },
        ],
      },
    ]);
    const { container } = render(<Stub initialEntries={['/pages/koishi']} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
