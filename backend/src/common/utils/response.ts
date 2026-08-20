import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    data,
    message
  };
  return res.status(statusCode).json(responsePayload);
};

export const sendError = (
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  errorCode?: string
): Response => {
  const responsePayload: ApiResponse = {
    success: false,
    message,
    ...(errorCode && { errorCode })
  };
  return res.status(statusCode).json(responsePayload);
};
