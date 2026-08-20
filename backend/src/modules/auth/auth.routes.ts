import { Router } from 'express';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { sendOtp, verifyOtp, loginStaff, getMe } from './auth.controller';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login-staff', loginStaff);
router.get('/me', authenticate, getMe);

export const authRouter = router;
