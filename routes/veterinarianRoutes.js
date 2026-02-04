import { Router } from 'express';

import {
  registerVeterinarian,
  confirmVeterinarianAccount,
  authenticateVeterinarian,
  forgotPassword,
  validateResetPasswordToken,
  resetPassword,
  getVeterinarianProfile,
} from '../controllers/veterinarianController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/', registerVeterinarian);
router.get('/confirm/:token', confirmVeterinarianAccount);
router.post('/login', authenticateVeterinarian);
router.post('/forgot-password', forgotPassword);
router
  .route('/forgot-password/:token')
  .get(validateResetPasswordToken)
  .post(resetPassword);

// Private routes
router.get('/profile', checkAuth, getVeterinarianProfile);

export default router;
