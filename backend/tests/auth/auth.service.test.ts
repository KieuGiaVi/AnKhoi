import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authService } from '../../src/modules/auth/auth.service';
import { OtpModel } from '../../src/modules/auth/otp.model';
import { usersService } from '../../src/modules/users';
import { Role } from '../../src/common/types';

describe('auth.service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOtp', () => {
    it('should generate OTP and save to database if no recent OTP exists', async () => {
      jest.spyOn(OtpModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(OtpModel, 'deleteMany').mockResolvedValue({} as any);
      jest.spyOn(OtpModel, 'create').mockResolvedValue({} as any);

      const res = await authService.sendOtp({ sdt: '0987654321' });

      expect(res.sdt).toBe('0987654321');
      expect(res.otp).toBeDefined();
      expect(OtpModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          sdt: '0987654321',
          otp: expect.any(String),
        })
      );
    });

    it('should throw 429 OTP_COOLDOWN if an OTP was generated less than 60s ago', async () => {
      const recentDate = new Date(Date.now() - 30 * 1000); // 30s ago
      jest.spyOn(OtpModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue({ createdAt: recentDate }),
      } as any);

      await expect(authService.sendOtp({ sdt: '0987654321' })).rejects.toThrow(
        expect.objectContaining({
          statusCode: 429,
          errorCode: 'OTP_COOLDOWN',
        })
      );
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP and return token for existing patient', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        ho_ten: 'Bệnh nhân Test',
        sdt: '0987654321',
        role: Role.PATIENT,
      };

      jest.spyOn(OtpModel, 'findOne').mockResolvedValue({ sdt: '0987654321', otp: '123456' } as any);
      jest.spyOn(OtpModel, 'deleteMany').mockResolvedValue({} as any);
      jest.spyOn(usersService, 'findUserByPhone').mockResolvedValue(mockUser as any);

      const result = await authService.verifyOtp({ sdt: '0987654321', otp: '123456' });

      expect(result.token).toBeDefined();
      expect(result.user.id).toBe('507f1f77bcf86cd799439011');
      expect(result.user.role).toBe(Role.PATIENT);
    });

    it('should throw 400 INVALID_OTP if OTP code is invalid or expired', async () => {
      jest.spyOn(OtpModel, 'findOne').mockResolvedValue(null);

      await expect(authService.verifyOtp({ sdt: '0987654321', otp: '999999' })).rejects.toThrow(
        expect.objectContaining({
          statusCode: 400,
          errorCode: 'INVALID_OTP',
        })
      );
    });
  });

  describe('loginStaff', () => {
    it('should authenticate staff with valid email and password', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      const mockStaff = {
        _id: '507f1f77bcf86cd799439022',
        ho_ten: 'Bác sĩ A',
        email: 'doctor@hcare.com',
        mat_khau_hash: hashedPassword,
        role: Role.DOCTOR,
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockStaff as any);

      const result = await authService.loginStaff({ email: 'doctor@hcare.com', mat_khau: 'secret123' });

      expect(result.token).toBeDefined();
      expect(result.user.role).toBe(Role.DOCTOR);
      expect(result.user.email).toBe('doctor@hcare.com');
    });

    it('should throw 401 INVALID_CREDENTIALS if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('secret123', 10);
      const mockStaff = {
        _id: '507f1f77bcf86cd799439022',
        ho_ten: 'Bác sĩ A',
        email: 'doctor@hcare.com',
        mat_khau_hash: hashedPassword,
        role: Role.DOCTOR,
      };

      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(mockStaff as any);

      await expect(authService.loginStaff({ email: 'doctor@hcare.com', mat_khau: 'wrongpass' })).rejects.toThrow(
        expect.objectContaining({
          statusCode: 401,
          errorCode: 'INVALID_CREDENTIALS',
        })
      );
    });

    it('should throw 401 INVALID_CREDENTIALS if staff user is not found', async () => {
      jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(null);

      await expect(authService.loginStaff({ email: 'unknown@hcare.com', mat_khau: 'secret123' })).rejects.toThrow(
        expect.objectContaining({
          statusCode: 401,
          errorCode: 'INVALID_CREDENTIALS',
        })
      );
    });
  });
});
