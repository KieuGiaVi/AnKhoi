import { Request, Response } from 'express';
import { catchAsync } from '../../common/utils/catchAsync';
import { sendSuccess } from '../../common/utils/response';
import { AppError } from '../../common/errors/AppError';
import { usersService } from './users.service';
import { createWalkInSchema, updateProfileSchema } from './users.validation';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('Unauthorized access', 401, 'UNAUTHORIZED');
  }

  const data = await usersService.getPatientProfileByUserId(userId);
  return sendSuccess(res, data, 'Lấy thông tin hồ sơ thành công');
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('Unauthorized access', 401, 'UNAUTHORIZED');
  }

  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const profile = await usersService.updatePatientProfile(userId, value);
  return sendSuccess(res, profile, 'Cập nhật hồ sơ bệnh nhân thành công');
});

export const createWalkIn = catchAsync(async (req: Request, res: Response) => {
  const { error, value } = createWalkInSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const result = await usersService.createWalkInPatient(value);
  return sendSuccess(res, result, 'Tạo hồ sơ bệnh nhân tạm (Walk-in) thành công', 201);
});
