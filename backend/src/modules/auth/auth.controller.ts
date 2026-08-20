import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync';
import { sendSuccess } from '../../common/utils/response';
import { AppError } from '../../common/errors/AppError';
import { authService } from './auth.service';
import { usersService } from '../users';
import { sendOtpSchema, verifyOtpSchema, staffLoginSchema } from './auth.validation';

export const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { error, value } = sendOtpSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const result = await authService.sendOtp(value);
  return sendSuccess(res, result, result.message);
});

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { error, value } = verifyOtpSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const result = await authService.verifyOtp(value);
  return sendSuccess(res, result, 'Xác thực OTP thành công');
});

export const loginStaff = catchAsync(async (req: Request, res: Response) => {
  const { error, value } = staffLoginSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const result = await authService.loginStaff(value);
  return sendSuccess(res, result, 'Đăng nhập nhân viên thành công');
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('Unauthorized access', 401, 'UNAUTHORIZED');
  }

  const user = await usersService.findUserById(userId);
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404, 'USER_NOT_FOUND');
  }

  return sendSuccess(res, user, 'Lấy thông tin tài khoản thành công');
});
