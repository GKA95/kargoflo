import { Router } from 'express';
import { authController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { ensureDatabaseConnected } from '../db/connection';

const router = Router();

// Guard database connectivity for auth operations
router.use(ensureDatabaseConnected);

// Public Authentication Endpoints
router.post('/register', authController.registerCustomer);
router.post('/register-rider', authController.registerRider);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);

// Password & Verification Endpoints
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

// Administrative Bootstrap Endpoint (Protected by token or zero-admin condition)
router.post('/bootstrap-admin', authController.bootstrapAdmin);

// Protected Session Endpoints (Require active session)
router.get('/me', requireAuth, authController.getMe);
router.post('/logout', requireAuth, authController.logout);
router.post('/change-password', requireAuth, authController.changePassword);

export default router;
