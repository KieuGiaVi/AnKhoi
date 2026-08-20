import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, VerifyOtpDTO, StaffLoginDTO } from '../../../shared/types/auth';
import { authApi } from '../api/authApi';

/**
 * SECURITY NOTE:
 * JWT tokens are persisted in localStorage for rapid development within the scope
 * of this graduation project (HCare+). Storing tokens in localStorage leaves them
 * vulnerable to Cross-Site Scripting (XSS) attacks. In a production environment,
 * authentication tokens should be handled via httpOnly, Secure, SameSite cookies.
 */

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithOtp: (dto: VerifyOtpDTO) => Promise<void>;
  loginStaff: (dto: StaffLoginDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authApi.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (_err) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const loginWithOtp = async (dto: VerifyOtpDTO): Promise<void> => {
    const res = await authApi.verifyOtp(dto);
    if (res.success && res.data) {
      handleAuthSuccess(res.data.token, res.data.user);
    } else {
      throw new Error(res.message || 'Xác thực OTP thất bại');
    }
  };

  const loginStaff = async (dto: StaffLoginDTO): Promise<void> => {
    const res = await authApi.loginStaff(dto);
    if (res.success && res.data) {
      handleAuthSuccess(res.data.token, res.data.user);
    } else {
      throw new Error(res.message || 'Đăng nhập nhân viên thất bại');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        loginWithOtp,
        loginStaff,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
