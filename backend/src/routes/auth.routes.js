import { Router } from 'express';
import {
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerificationEmailHandler,
  verifyEmail,
} from '../controllers/auth.controller.js';
import authenticate from '../middlewares/authenticate.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  loginValidationRules,
  registerValidationRules,
  resendVerificationValidationRules,
  verifyEmailValidationRules,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.get('/verify-email', verifyEmailValidationRules, validate, verifyEmail);
router.post(
  '/resend-verification-email',
  resendVerificationValidationRules,
  validate,
  resendVerificationEmailHandler
);

export default router;
