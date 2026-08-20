export const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  RECEPTIONIST: 'RECEPTIONIST',
  LAB_TECHNICIAN: 'LAB_TECHNICIAN',
  PHARMACIST: 'PHARMACIST',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  ho_ten: string;
  role: Role;
  sdt?: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SendOtpDTO {
  sdt: string;
}

export interface SendOtpResponse {
  message: string;
  sdt: string;
  otp?: string;
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
