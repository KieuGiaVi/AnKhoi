export enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN',
  PHARMACIST = 'PHARMACIST',
  ADMIN = 'ADMIN'
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
  errorCode?: string;
}
