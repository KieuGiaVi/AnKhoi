import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { Role } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #cbd5e1',
            borderTopColor: '#0f766e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Đang tải thông tin hệ thống...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff1f2',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#991b1b', margin: '0 0 0.5rem 0' }}>403 - Không có quyền truy cập</h2>
        <p style={{ color: '#7f1d1d', margin: '0 0 1.5rem 0' }}>
          Tài khoản của bạn ({user.ho_ten} - Role: {user.role}) không có quyền sử dụng phân hệ này.
        </p>
        <a
          href="/auth"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#991b1b',
            color: '#ffffff',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Đổi tài khoản đăng nhập
        </a>
      </div>
    );
  }

  return <>{children}</>;
};
