import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from './RegisterPage';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the RegisterForm component as its functionality is tested in its own unit test
jest.mock('../../components/auth/RegisterForm', () => {
  return ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-register-form">{children}</div>
  );
});

describe('RegisterPage', () => {
  test('renders RegisterPage and its form', () => {
    render(<Router><RegisterPage /></Router>);
    expect(screen.getByText(/register/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();
    expect(screen.getByText(/already have an account\? sign in/i)).toBeInTheDocument();
  });
});
