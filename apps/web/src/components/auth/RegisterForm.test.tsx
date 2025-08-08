import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from './RegisterForm';
import * as authService from '../../services/authService';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the authService
jest.mock('../../services/authService');
const mockRegisterUser = jest.spyOn(authService, 'registerUser');

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegisterUser.mockClear();
    mockedUsedNavigate.mockClear();
  });

  test('renders registration form with all fields', () => {
    render(<Router><RegisterForm /></Router>);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(<Router><RegisterForm /></Router>);
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockRegisterUser).not.toHaveBeenCalled();
  });

  test('handles successful registration', async () => {
    mockRegisterUser.mockResolvedValueOnce({});

    render(<Router><RegisterForm /></Router>);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
    expect(mockRegisterUser).toHaveBeenCalledWith('test@example.com', 'password123');
    await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalledWith('/login'), { timeout: 3000 });
  });

  test('handles registration error from API', async () => {
    const errorMessage = 'Email already registered.';
    mockRegisterUser.mockRejectedValueOnce({ response: { data: { detail: errorMessage } } });

    render(<Router><RegisterForm /></Router>);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(mockRegisterUser).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
