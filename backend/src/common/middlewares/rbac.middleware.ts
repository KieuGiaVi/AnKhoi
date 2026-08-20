import { Request, Response, NextFunction } from 'express';
import { Role } from '../types';
import { AppError } from '../errors/AppError';

export const rbac = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      return next(new AppError('Unauthorized: Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Insufficient permissions', 403, 'FORBIDDEN'));
    }

    next();
  };
};
