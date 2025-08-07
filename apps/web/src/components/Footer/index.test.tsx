
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './index';

test('renders footer with copyright', () => {
  render(<Footer />);
  const copyrightElement = screen.getByText(/© 2025 E-Commerce/i);
  expect(copyrightElement).toBeInTheDocument();
});
