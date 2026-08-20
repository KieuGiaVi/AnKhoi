import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { rbac } from '../../common/middlewares/rbac.middleware';
import { Role } from '../../common/types';
import { getProfile, updateProfile, createWalkIn } from './users.controller';

const router = Router();

router.get('/profile', authenticate, rbac([Role.PATIENT]), getProfile);
router.put('/profile', authenticate, rbac([Role.PATIENT]), updateProfile);
router.post('/walk-in', authenticate, rbac([Role.RECEPTIONIST, Role.ADMIN]), createWalkIn);

export const usersRouter = router;
