import { Request, Response } from 'express';
import { rbac } from '../../src/common/middlewares/rbac.middleware';
import { Role } from '../../src/common/types';

describe('rbac.middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    nextFunction = jest.fn();
  });

  it('should return 401 UNAUTHORIZED if req.user is undefined', () => {
    const middleware = rbac([Role.ADMIN, Role.RECEPTIONIST]);
    middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
      })
    );
  });

  it('should return 403 FORBIDDEN if user role is not in allowed roles', () => {
    mockReq.user = { id: 'user-1', role: Role.PATIENT };
    const middleware = rbac([Role.RECEPTIONIST, Role.ADMIN]);
    middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        errorCode: 'FORBIDDEN',
      })
    );
  });

  it('should call next() if user role is allowed', () => {
    mockReq.user = { id: 'user-2', role: Role.RECEPTIONIST };
    const middleware = rbac([Role.RECEPTIONIST, Role.ADMIN]);
    middleware(mockReq as Request, mockRes as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });
});
