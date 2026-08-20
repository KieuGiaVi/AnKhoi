import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface StaffLoginFormProps {
  onError: (msg: string) => void;
  onSuccess: () => void;
}

export const StaffLoginForm: React.FC<StaffLoginFormProps> = ({ onError, onSuccess }) => {
  const { loginStaff } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      onError('Vui lòng nhập đầy đủ Email và Mật khẩu');
      return;
    }

    setLoading(true);
    onError('');

    try {
      await loginStaff({ email, mat_khau: password });
      onSuccess();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Email hoặc mật khẩu không chính xác';
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
          Email Nhân viên
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="doctor@ankhoi.vn / admin@ankhoi.vn"
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
          Mật khẩu
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              width: '100%',
              padding: '0.75rem 2.5rem 0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          borderRadius: '0.5rem',
          backgroundColor: '#0f766e',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '1rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'background-color 0.2s',
        }}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập Hệ thống'}
      </button>
    </form>
  );
};
