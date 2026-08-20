import { Role } from '../../common/types';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export interface IVitalSigns {
  mach?: number;            // Mạch (bịp/phút)
  huyet_ap?: string;        // Huyết áp (e.g. "120/80")
  nhiet_do?: number;        // Nhiệt độ (°C)
  chieu_cao?: number;       // Chiều cao (cm)
  can_nang?: number;        // Cân nặng (kg)
}

export interface IUser {
  _id: string;
  ho_ten: string;
  email?: string;
  sdt?: string;
  mat_khau_hash?: string;
  role: Role;
  is_temp: boolean;
  chuyen_khoa?: string;
  trang_thai: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPatientProfile {
  _id: string;
  user_id: string;
  chi_so_sinh_ton?: IVitalSigns;
  ma_the_bhyt?: string;
  muc_huong?: number;       // % BHYT chi trả (mock: e.g. 80, 100)
  danh_sach_di_ung?: string[]; // Array of Ingredient _ids
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDTO {
  ho_ten: string;
  sdt?: string;
  email?: string;
  mat_khau?: string;
  role?: Role;
  is_temp?: boolean;
  chuyen_khoa?: string;
}

export interface CreateWalkInPatientDTO {
  ho_ten: string;
  sdt?: string;
  ma_the_bhyt?: string;
}

export interface UpdatePatientProfileDTO {
  chi_so_sinh_ton?: IVitalSigns;
  ma_the_bhyt?: string;
  danh_sach_di_ung?: string[];
}
