import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { Role } from '../shared/types/auth';

const DashboardHome = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>HCare+ Web Dashboard</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Hệ thống Quản lý Phòng khám An Khởi</p>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Xin chào, <strong>{user.ho_ten}</strong> ({user.role})</span>
            <button
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0f766e',
              color: '#fff',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Đăng nhập
          </Link>
        )}
      </div>

      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <Link to="/auth">Trang Auth</Link>
        <Link to="/reception">Phân hệ Lễ tân</Link>
        <Link to="/doctor">Phân hệ Bác sĩ</Link>
        <Link to="/lab">Phân hệ KTV CLS</Link>
        <Link to="/pharmacy">Phân hệ Dược sĩ</Link>
        <Link to="/admin">Phân hệ Admin</Link>
      </nav>
    </div>
  );
};

const FeaturePlaceholder = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h2>{title} Module</h2>
    <p>Sẽ code ở bước sau.</p>
    <Link to="/">Quay lại Trang chủ</Link>
  </div>
);

export const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route
            path="/reception"
            element={
              <ProtectedRoute allowedRoles={[Role.RECEPTIONIST, Role.ADMIN]}>
                <FeaturePlaceholder title="Lễ tân" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={[Role.DOCTOR, Role.ADMIN]}>
                <FeaturePlaceholder title="Bác sĩ" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab"
            element={
              <ProtectedRoute allowedRoles={[Role.LAB_TECHNICIAN, Role.ADMIN]}>
                <FeaturePlaceholder title="Kỹ thuật viên CLS" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={[Role.PHARMACIST, Role.ADMIN]}>
                <FeaturePlaceholder title="Dược sĩ" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                <FeaturePlaceholder title="Quản trị hệ thống" />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<FeaturePlaceholder title="404 Not Found" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
