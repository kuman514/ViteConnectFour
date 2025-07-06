import { render } from '@testing-library/react';

import PageTemplate from '.';

describe('PageTemplate', () => {
  it('should match with snapshot', () => {
    const { container } = render(
      <PageTemplate>Lorem ipsum dolor sit amet.</PageTemplate>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
