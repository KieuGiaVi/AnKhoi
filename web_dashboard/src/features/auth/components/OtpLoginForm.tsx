import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

interface OtpLoginFormProps {
  onError: (msg: string) => void;
  onSuccess: () => void;
}

export const OtpLoginForm: React.FC<OtpLoginFormProps> = ({ onError, onSuccess }) => {
  const { loginWithOtp } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [sdt, setSdt] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [otp, setOtp] = useState('');
  const [returnedOtp, setReturnedOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sdt || sdt.length < 10) {
      onError('Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)');
      return;
    }

    setLoading(true);
    onError('');

    try {
      const res = await authApi.sendOtp({ sdt });
      if (res.success) {
        setStep(2);
        setCooldown(60);
        // Only set returnedOtp if backend explicitly returned it in API response
        if (res.data?.otp) {
          setReturnedOtp(res.data.otp);
        } else {
          setReturnedOtp(null);
        }
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Không thể gửi mã OTP';
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      onError('Mã OTP phải gồm đúng 6 chữ số');
      return;
    }

    setLoading(true);
    onError('');

    try {
      await loginWithOtp({ sdt, otp, ho_ten: hoTen || undefined });
      onSuccess();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Xác thực OTP thất bại';
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {step === 1 ? (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
              Số điện thoại Bệnh nhân
            </label>
            <input
              type="tel"
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
              placeholder="Nhập số điện thoại (ví dụ: 0987654321)"
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
              Họ và tên (Tùy chọn cho lần đăng ký đầu tiên)
            </label>
            <input
              type="text"
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="Nhập họ và tên"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Đang gửi mã...' : 'Nhận mã OTP qua SMS'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Mã xác thực OTP (6 chữ số)
              </label>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Đổi SĐT ({sdt})
              </button>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              maxLength={6}
              placeholder="------"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '1.25rem',
                letterSpacing: '0.25rem',
                textAlign: 'center',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* OTP Helper Badge: Renders ONLY if returnedOtp was explicitly provided in backend API response */}
          {returnedOtp && (
            <div
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '0.375rem',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                fontSize: '0.875rem',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Demo OTP: <strong>{returnedOtp}</strong></span>
              <button
                type="button"
                onClick={() => setOtp(returnedOtp)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Tự điền
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.5rem',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Đang xác thực...' : 'Xác thực & Đăng nhập'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={handleSendOtp}
              style={{
                background: 'none',
                border: 'none',
                color: cooldown > 0 ? '#9ca3af' : '#0284c7',
                fontSize: '0.875rem',
                cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi lại mã OTP'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
