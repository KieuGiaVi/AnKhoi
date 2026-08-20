import { apiClient } from '../../../shared/api/client';
import type { ApiResponse } from '../../../shared/types';
import type { SendOtpDTO, SendOtpResponse, VerifyOtpDTO, StaffLoginDTO, AuthResponse, User } from '../../../shared/types/auth';

export const authApi = {
  sendOtp: async (dto: SendOtpDTO): Promise<ApiResponse<SendOtpResponse>> => {
    const res = await apiClient.post<ApiResponse<SendOtpResponse>>('/auth/send-otp', dto);
    return res.data;
  },

  verifyOtp: async (dto: VerifyOtpDTO): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/verify-otp', dto);
    return res.data;
  },

  loginStaff: async (dto: StaffLoginDTO): Promise<ApiResponse<AuthResponse>> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login-staff', dto);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
