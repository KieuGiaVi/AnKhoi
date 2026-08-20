import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { authApi } from '../features/auth/api/authApi';
import { Role } from '../shared/types/auth';

vi.mock('../features/auth/api/authApi');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should redirect unauthenticated user to /auth', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/reception']}>
          <Routes>
            <Route path="/auth" element={<div>LoginPage</div>} />
            <Route
              path="/reception"
              element={
                <ProtectedRoute allowedRoles={[Role.RECEPTIONIST]}>
                  <div>ReceptionPage</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('LoginPage')).toBeInTheDocument();
    });
  });

  it('should show 403 Forbidden message if user role is not allowed', async () => {
    localStorage.setItem('token', 'patient-token');
    vi.mocked(authApi.getMe).mockResolvedValue({
      success: true,
      message: 'OK',
      data: { id: 'p1', ho_ten: 'Bệnh nhân C', role: Role.PATIENT },
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/reception']}>
          <Routes>
            <Route
              path="/reception"
              element={
                <ProtectedRoute allowedRoles={[Role.RECEPTIONIST, Role.ADMIN]}>
                  <div>ReceptionPage</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('403 - Không có quyền truy cập')).toBeInTheDocument();
      expect(screen.queryByText('ReceptionPage')).not.toBeInTheDocument();
    });
  });

  it('should render children if user role is allowed', async () => {
    localStorage.setItem('token', 'staff-token');
    vi.mocked(authApi.getMe).mockResolvedValue({
      success: true,
      message: 'OK',
      data: { id: 's1', ho_ten: 'Lễ tân D', role: Role.RECEPTIONIST },
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/reception']}>
          <Routes>
            <Route
              path="/reception"
              element={
                <ProtectedRoute allowedRoles={[Role.RECEPTIONIST, Role.ADMIN]}>
                  <div>ReceptionPage</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('ReceptionPage')).toBeInTheDocument();
    });
  });
});
