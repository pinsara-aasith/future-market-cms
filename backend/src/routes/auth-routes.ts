// src/routes/auth-routes.ts
import { Router } from 'express';
import { register, login, logout, refreshToken, getCurrentUser } from '../controllers/auth-controller';
import { authenticate } from '../middleware/auth-middleware';
import { authValidations } from '../validators/validation-schemas';
import { validate } from '../validators/validation-utils';

const router = Router();

// Public auth routes
router.post('/register', validate(authValidations.register), register);
router.post('/login', validate(authValidations.login), login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

// Protected auth routes
router.get('/me', authenticate, getCurrentUser);

export default router;