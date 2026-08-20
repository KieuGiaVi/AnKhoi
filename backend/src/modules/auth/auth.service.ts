import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OtpModel } from './otp.model';
import { usersService } from '../users';
import { SendOtpDTO, VerifyOtpDTO, StaffLoginDTO, AuthTokenResponse } from './auth.types';
import { AppError } from '../../common/errors/AppError';
import { config } from '../../config/env';
import { Role } from '../../common/types';

export class AuthService {
  async sendOtp(dto: SendOtpDTO): Promise<{ message: string; sdt: string; otp?: string }> {
    const existingOtp = await OtpModel.findOne({ sdt: dto.sdt }).sort({ createdAt: -1 });

    if (existingOtp) {
      const secondsPassed = (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
      if (secondsPassed < 60) {
        throw new AppError('Vui lòng đợi 60 giây trước khi yêu cầu gửi lại OTP', 429, 'OTP_COOLDOWN');
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OtpModel.deleteMany({ sdt: dto.sdt });
    await OtpModel.create({
      sdt: dto.sdt,
      otp: otpCode,
      expiresAt,
    });

    console.log(`[OTP Service]: Generated OTP for ${dto.sdt} -> ${otpCode}`);

    return {
      message: 'Mã OTP đã được gửi thành công',
      sdt: dto.sdt,
      ...(config.env !== 'production' && { otp: otpCode }),
    };
  }

  async verifyOtp(dto: VerifyOtpDTO): Promise<AuthTokenResponse> {
    const otpRecord = await OtpModel.findOne({ sdt: dto.sdt, otp: dto.otp });

    if (!otpRecord) {
      throw new AppError('Mã OTP không hợp lệ hoặc đã hết hạn', 400, 'INVALID_OTP');
    }

    await OtpModel.deleteMany({ sdt: dto.sdt });

    let user = await usersService.findUserByPhone(dto.sdt);

    if (!user) {
      const created = await usersService.createUserWithPatientProfile({
        ho_ten: dto.ho_ten || `Bệnh nhân ${dto.sdt.slice(-4)}`,
        sdt: dto.sdt,
        role: Role.PATIENT,
      });
      user = created.user;
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        ho_ten: user.ho_ten,
        role: user.role,
        sdt: user.sdt,
        email: user.email,
      },
    };
  }

  async loginStaff(dto: StaffLoginDTO): Promise<AuthTokenResponse> {
    const user = await usersService.findUserByEmail(dto.email, true);

    if (!user || !user.mat_khau_hash) {
      throw new AppError('Email hoặc mật khẩu không chính xác', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(dto.mat_khau, user.mat_khau_hash);
    if (!isMatch) {
      throw new AppError('Email hoặc mật khẩu không chính xác', 401, 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        ho_ten: user.ho_ten,
        role: user.role,
        sdt: user.sdt,
        email: user.email,
      },
    };
  }
}

export const authService = new AuthService();
