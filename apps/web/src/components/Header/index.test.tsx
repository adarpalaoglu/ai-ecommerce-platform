
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './index';

test('renders header with title', () => {
  render(<Header />);
  const titleElement = screen.getByText(/E-Commerce/i);
  expect(titleElement).toBeInTheDocument();
});
