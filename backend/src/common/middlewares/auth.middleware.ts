import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  // Placeholder: Extract JWT token from headers and verify
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized access', 401, 'UNAUTHORIZED'));
  }

  // Placeholder logic for attached user
  req.user = { id: 'placeholder-user-id', role: 'PATIENT' };
  next();
};
