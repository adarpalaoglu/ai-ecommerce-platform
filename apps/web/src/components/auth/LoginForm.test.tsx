import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import * as authService from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the authService
jest.mock('../../services/authService');
const mockLoginUser = jest.spyOn(authService, 'loginUser');

// Mock Zustand store
jest.mock('../../store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('LoginForm', () => {
  const mockSetLogin = jest.fn();

  beforeEach(() => {
    mockLoginUser.mockClear();
    mockedUsedNavigate.mockClear();
    (useAuthStore as any).mockReturnValue({
      setLogin: mockSetLogin,
    });
  });

  test('renders login form with all fields', () => {
    render(<Router><LoginForm /></Router>);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'fake-jwt-token';
    mockLoginUser.mockResolvedValueOnce({ user: mockUser, access_token: mockToken });

    render(<Router><LoginForm /></Router>);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'password123'));
    await waitFor(() => expect(mockSetLogin).toHaveBeenCalledWith(mockUser, mockToken));
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/'));
  });

  test('handles login error from API', async () => {
    const errorMessage = 'Invalid credentials.';
    mockLoginUser.mockRejectedValueOnce({ response: { data: { detail: errorMessage } } });

    render(<Router><LoginForm /></Router>);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockLoginUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockSetLogin).not.toHaveBeenCalled();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
