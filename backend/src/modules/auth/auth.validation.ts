import Joi from 'joi';

export const sendOtpSchema = Joi.object({
  sdt: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ (10-11 chữ số)',
    'any.required': 'Số điện thoại là bắt buộc',
  }),
});

export const verifyOtpSchema = Joi.object({
  sdt: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ (10-11 chữ số)',
    'any.required': 'Số điện thoại là bắt buộc',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'Mã OTP phải đúng 6 chữ số',
    'any.required': 'Mã OTP là bắt buộc',
  }),
  ho_ten: Joi.string().optional().allow(''),
});

export const staffLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
  mat_khau: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải tối thiểu 6 ký tự',
    'any.required': 'Mật khẩu là bắt buộc',
  }),
});
