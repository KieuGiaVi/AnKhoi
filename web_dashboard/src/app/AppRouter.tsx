import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const DashboardHome = () => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>HCare+ Web Dashboard</h1>
    <p>Hệ thống Quản lý Phòng khám An Khởi - Trạng thái: Dựng khung hệ thống thành công.</p>
    <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      <Link to="/auth">Auth</Link>
      <Link to="/reception">Lễ tân</Link>
      <Link to="/doctor">Bác sĩ</Link>
      <Link to="/lab">KTV CLS</Link>
      <Link to="/pharmacy">Dược sĩ</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  </div>
);

const FeaturePlaceholder = ({ title }: { title: string }) => (
  <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h2>{title} Module</h2>
    <p>Sẽ code ở bước sau.</p>
    <Link to="/"> Quay lại Trang chủ</Link>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/auth" element={<FeaturePlaceholder title="Đăng nhập / Xác thực" />} />
        <Route path="/reception" element={<FeaturePlaceholder title="Lễ tân" />} />
        <Route path="/doctor" element={<FeaturePlaceholder title="Bác sĩ" />} />
        <Route path="/lab" element={<FeaturePlaceholder title="Kỹ thuật viên CLS" />} />
        <Route path="/pharmacy" element={<FeaturePlaceholder title="Dược sĩ" />} />
        <Route path="/admin" element={<FeaturePlaceholder title="Quản trị hệ thống" />} />
        <Route path="*" element={<FeaturePlaceholder title="404 Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
};
