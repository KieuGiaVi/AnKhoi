import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { ProtectedRoute } from '../shared/components/ProtectedRoute';
import { DashboardLayout } from '../shared/layout/DashboardLayout';
import { Role } from '../shared/types/auth';

// Placeholder for features not yet implemented
const FeaturePlaceholder = ({ title }: { title: string }) => (
  <div className="space-y-2">
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 text-sm">Phân hệ đang được phát triển. Sẽ code ở bước tiếp theo.</p>
  </div>
);

// Home redirect: send user to their default area based on role
const HomeRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const roleRoutes: Record<Role, string> = {
    [Role.RECEPTIONIST]: '/reception',
    [Role.DOCTOR]: '/doctor',
    [Role.LAB_TECHNICIAN]: '/lab',
    [Role.PHARMACIST]: '/pharmacy',
    [Role.ADMIN]: '/admin',
    [Role.PATIENT]: '/auth',
  };

  return <Navigate to={roleRoutes[user.role] ?? '/auth'} replace />;
};

export const AppRouter = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route — no sidebar */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth" element={<LoginPage />} />

          {/* Protected routes — wrapped in DashboardLayout (sidebar + header) */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
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
          </Route>

          {/* 404 */}
          <Route path="*" element={<FeaturePlaceholder title="404 — Không tìm thấy trang" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
