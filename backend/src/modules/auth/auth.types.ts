import { Role } from '../../common/types';

export interface SendOtpDTO {
  sdt: string;
}

export interface VerifyOtpDTO {
  sdt: string;
  otp: string;
  ho_ten?: string;
}

export interface StaffLoginDTO {
  email: string;
  mat_khau: string;
}

export interface AuthTokenPayload {
  id: string;
  role: Role;
  ho_ten: string;
  sdt?: string;
  email?: string;
}

export interface AuthTokenResponse {
  token: string;
  user: {
    id: string;
    ho_ten: string;
    role: Role;
    sdt?: string;
    email?: string;
  };
}
