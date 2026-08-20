import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errorCode);
  }

  // Fallback for unhandled/internal errors
  console.error('[Unhandled Error]:', err);
  return sendError(res, 'Internal Server Error', 500, 'INTERNAL_SERVER_ERROR');
};
