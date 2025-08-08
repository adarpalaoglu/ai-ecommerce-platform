import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from './LoginPage';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the LoginForm component as its functionality is tested in its own unit test
jest.mock('../../components/auth/LoginForm', () => {
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-login-form">{children}</div>
  );
});

describe('LoginPage', () => {
  test('renders LoginPage and its form', () => {
    render(<Router><LoginPage /></Router>);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-login-form')).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
  });
});
