import { Router, Request, Response } from 'express';
import { sendSuccess } from '../common/utils/response';

const router = Router();

// Health-check endpoint
router.get('/health', (_req: Request, res: Response) => {
  return sendSuccess(res, { status: 'UP', timestamp: new Date().toISOString() }, 'Backend API health check successful');
});

export default router;
