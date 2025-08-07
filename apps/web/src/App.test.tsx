import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders header', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const header = screen.getByRole('banner');
  const headerElement = within(header).getByText(/E-Commerce/i);
  expect(headerElement).toBeInTheDocument();
});
