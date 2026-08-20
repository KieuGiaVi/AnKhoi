import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../src/common/middlewares/auth.middleware';
import { Role } from '../../src/common/types';
import { config } from '../../src/config/env';

describe('auth.middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {};
    nextFunction = jest.fn();
  });

  it('should return 401 UNAUTHORIZED if Authorization header is missing', () => {
    authenticate(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
      })
    );
  });

  it('should return 401 UNAUTHORIZED if Authorization header does not start with Bearer', () => {
    mockReq.headers = { authorization: 'Basic token123' };
    authenticate(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
      })
    );
  });

  it('should verify valid token and attach user to req.user', () => {
    const payload = { id: 'user-123', role: Role.PATIENT };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    authenticate(mockReq as Request, mockRes as Response, nextFunction);

    expect(mockReq.user).toBeDefined();
    expect(mockReq.user?.id).toBe('user-123');
    expect(mockReq.user?.role).toBe(Role.PATIENT);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should return 401 INVALID_TOKEN if token signature is invalid', () => {
    const payload = { id: 'user-123', role: Role.PATIENT };
    const token = jwt.sign(payload, 'wrong-secret-key');
    mockReq.headers = { authorization: `Bearer ${token}` };

    authenticate(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        errorCode: 'INVALID_TOKEN',
      })
    );
  });

  it('should return 401 TOKEN_EXPIRED if token has expired', () => {
    const payload = { id: 'user-123', role: Role.PATIENT };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '-1s' });
    mockReq.headers = { authorization: `Bearer ${token}` };

    authenticate(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        errorCode: 'TOKEN_EXPIRED',
      })
    );
  });
});
