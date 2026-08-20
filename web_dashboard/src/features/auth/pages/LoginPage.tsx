import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OtpLoginForm } from '../components/OtpLoginForm';
import { StaffLoginForm } from '../components/StaffLoginForm';
import { useAuth } from '../context/AuthContext';
import { Role } from '../../../shared/types/auth';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>('patient');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  React.useEffect(() => {
    if (user) {
      redirectUser(user.role);
    }
  }, [user]);

  const redirectUser = (role: Role) => {
    switch (role) {
      case Role.RECEPTIONIST:
        navigate('/reception');
        break;
      case Role.DOCTOR:
        navigate('/doctor');
        break;
      case Role.LAB_TECHNICIAN:
        navigate('/lab');
        break;
      case Role.PHARMACIST:
        navigate('/pharmacy');
        break;
      case Role.ADMIN:
        navigate('/admin');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const handleSuccess = () => {
    if (user) {
      redirectUser(user.role);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
        padding: '1.5rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          padding: '2.5rem 2rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Clinic Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#0f766e',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 700,
              margin: '0 auto 1rem auto',
              boxShadow: '0 4px 6px -1px rgba(15, 118, 110, 0.4)',
            }}
          >
            AK
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Phòng Khám An Khởi
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Hệ thống Quản lý Y tế & Đặt lịch Khám HCare+
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '0.5rem',
            padding: '0.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('patient');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '0.625rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'patient' ? '#ffffff' : 'transparent',
              color: activeTab === 'patient' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'patient' ? '0 1px 3px 0 rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Bệnh nhân (OTP)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '0.625rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'staff' ? '#ffffff' : 'transparent',
              color: activeTab === 'staff' ? '#0f766e' : '#64748b',
              boxShadow: activeTab === 'staff' ? '0 1px 3px 0 rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            Nhân viên
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Active Form */}
        {activeTab === 'patient' ? (
          <OtpLoginForm onError={setErrorMessage} onSuccess={handleSuccess} />
        ) : (
          <StaffLoginForm onError={setErrorMessage} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};
