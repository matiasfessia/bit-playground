import React from 'react';
import { render } from '@testing-library/react';
import { BasicOverflowTip } from './overflow-tip.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicOverflowTip />);
  const rendered = getByText('hello world!');
  expect(rendered).toBeTruthy();
});
