import React from 'react';
import { render } from '@testing-library/react';
import { BasicDecimalInput } from './decimal-input.composition';

it('should render with the correct text', () => {
  const { getByLabelText } = render(<BasicDecimalInput />);
  const rendered = getByLabelText('decimal-input');
  expect(rendered).toBeTruthy();
});
