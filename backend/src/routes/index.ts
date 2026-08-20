import { Router, Request, Response } from 'express';
import { sendSuccess } from '../common/utils/response';
import { authRouter } from '../modules/auth';
import { usersRouter } from '../modules/users';

const router = Router();

// Health-check endpoint
router.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, { status: 'UP', timestamp: new Date().toISOString() }, 'Backend API health check successful');
});

// Domain Routers
router.use('/auth', authRouter);
router.use('/users', usersRouter);

export default router;
