import Joi from 'joi';

export const createWalkInSchema = Joi.object({
  ho_ten: Joi.string().required().messages({
    'any.required': 'Họ tên là bắt buộc',
  }),
  sdt: Joi.string().pattern(/^[0-9]{10,11}$/).optional().allow('').messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ (10-11 chữ số)',
  }),
  ma_the_bhyt: Joi.string().optional().allow(''),
});

export const updateProfileSchema = Joi.object({
  chi_so_sinh_ton: Joi.object({
    mach: Joi.number().min(30).max(250).optional(),
    huyet_ap: Joi.string().pattern(/^[0-9]{2,3}\/[0-9]{2,3}$/).optional(),
    nhiet_do: Joi.number().min(30).max(45).optional(),
    chieu_cao: Joi.number().min(40).max(250).optional(),
    can_nang: Joi.number().min(1).max(300).optional(),
  }).optional(),
  ma_the_bhyt: Joi.string().optional().allow(''),
  danh_sach_di_ung: Joi.array().items(Joi.string()).optional(),
});
