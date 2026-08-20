import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { authApi } from '../features/auth/api/authApi';
import { Role } from '../shared/types/auth';

vi.mock('../features/auth/api/authApi');

const TestConsumer = () => {
  const { user, isAuthenticated, loginStaff, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</div>
      <div data-testid="user-name">{user?.ho_ten || 'NO_USER'}</div>
      <button onClick={() => loginStaff({ email: 'staff@hcare.com', mat_khau: '123456' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize as logged out if localStorage token is absent', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_OUT');
    expect(screen.getByTestId('user-name').textContent).toBe('NO_USER');
  });

  it('should hydrate user info on mount if token exists in localStorage', async () => {
    localStorage.setItem('token', 'existing-token-123');
    vi.mocked(authApi.getMe).mockResolvedValue({
      success: true,
      message: 'OK',
      data: { id: 'u1', ho_ten: 'Bác sĩ A', role: Role.DOCTOR },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN');
      expect(screen.getByTestId('user-name').textContent).toBe('Bác sĩ A');
    });
  });

  it('should handle loginStaff success and update state and localStorage', async () => {
    vi.mocked(authApi.loginStaff).mockResolvedValue({
      success: true,
      message: 'Success',
      data: {
        token: 'new-token-456',
        user: { id: 'u2', ho_ten: 'Lễ tân B', role: Role.RECEPTIONIST },
      },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN');
      expect(screen.getByTestId('user-name').textContent).toBe('Lễ tân B');
      expect(localStorage.getItem('token')).toBe('new-token-456');
    });
  });

  it('should clear user state and localStorage on logout', async () => {
    localStorage.setItem('token', 'token-to-clear');
    vi.mocked(authApi.getMe).mockResolvedValue({
      success: true,
      message: 'OK',
      data: { id: 'u1', ho_ten: 'Admin', role: Role.ADMIN },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN');
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_OUT');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
