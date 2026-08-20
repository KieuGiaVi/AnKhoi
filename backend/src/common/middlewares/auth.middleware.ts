import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { config } from '../../config/env';
import { Role } from '../types';

export interface JwtPayload {
  id: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: Missing or invalid authorization header', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Unauthorized: Token not provided', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Unauthorized: Token has expired', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Unauthorized: Invalid token signature', 401, 'INVALID_TOKEN'));
  }
};
