import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';
import { Role } from '../../src/common/types';
import { config } from '../../src/config/env';
import { OtpModel } from '../../src/modules/auth/otp.model';
import { UserModel } from '../../src/modules/users/user.model';
import { PatientProfileModel } from '../../src/modules/users/patientProfile.model';

describe('Auth & Users HTTP Integration Tests', () => {
  const samplePhone = '0987654321';
  const sampleOtp = '123456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/send-otp', () => {
    it('should send OTP and return 200 with message', async () => {
      jest.spyOn(OtpModel, 'findOne').mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(OtpModel, 'deleteMany').mockResolvedValue({} as any);
      jest.spyOn(OtpModel, 'create').mockResolvedValue({} as any);

      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ sdt: samplePhone });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sdt).toBe(samplePhone);
      expect(res.body.data.otp).toBeDefined(); // in dev/test mode
    });

    it('should return 400 VALIDATION_ERROR if phone is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/send-otp')
        .send({ sdt: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('should verify OTP, create patient user if not found, and return JWT token', async () => {
      jest.spyOn(OtpModel, 'findOne').mockResolvedValue({ sdt: samplePhone, otp: sampleOtp } as any);
      jest.spyOn(OtpModel, 'deleteMany').mockResolvedValue({} as any);
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserModel, 'create').mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        ho_ten: 'Bệnh nhân 4321',
        sdt: samplePhone,
        role: Role.PATIENT,
        is_temp: false,
      } as any);
      jest.spyOn(PatientProfileModel, 'create').mockResolvedValue({} as any);

      const res = await request(app)
        .post('/api/auth/verify-otp')
        .send({ sdt: samplePhone, otp: sampleOtp });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe(Role.PATIENT);
    });

    it('should return 400 INVALID_OTP if OTP is incorrect', async () => {
      jest.spyOn(OtpModel, 'findOne').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/verify-otp')
        .send({ sdt: samplePhone, otp: '999999' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('INVALID_OTP');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return logged-in user profile if valid JWT token provided', async () => {
      const mockUserId = '507f1f77bcf86cd799439011';
      const token = jwt.sign({ id: mockUserId, role: Role.PATIENT }, config.jwtSecret);

      jest.spyOn(UserModel, 'findById').mockResolvedValue({
        _id: mockUserId,
        ho_ten: 'Nguyễn Văn A',
        sdt: samplePhone,
        role: Role.PATIENT,
      } as any);

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ho_ten).toBe('Nguyễn Văn A');
    });
  });

  describe('POST /api/users/walk-in', () => {
    it('should allow RECEPTIONIST to create walk-in patient (is_temp: true)', async () => {
      const token = jwt.sign({ id: 'staff-1', role: Role.RECEPTIONIST }, config.jwtSecret);

      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserModel, 'create').mockResolvedValue({
        _id: '507f1f77bcf86cd799439022',
        ho_ten: 'Bệnh nhân Walkin',
        role: Role.PATIENT,
        is_temp: true,
      } as any);
      jest.spyOn(PatientProfileModel, 'create').mockResolvedValue({
        _id: 'prof-1',
        user_id: '507f1f77bcf86cd799439022',
        ma_the_bhyt: 'DN123456789',
      } as any);

      const res = await request(app)
        .post('/api/users/walk-in')
        .set('Authorization', `Bearer ${token}`)
        .send({ ho_ten: 'Bệnh nhân Walkin', ma_the_bhyt: 'DN123456789' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.is_temp).toBe(true);
    });

    it('should block PATIENT role from calling walk-in API (403 FORBIDDEN)', async () => {
      const token = jwt.sign({ id: 'patient-1', role: Role.PATIENT }, config.jwtSecret);

      const res = await request(app)
        .post('/api/users/walk-in')
        .set('Authorization', `Bearer ${token}`)
        .send({ ho_ten: 'Bệnh nhân' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });
  });
});
