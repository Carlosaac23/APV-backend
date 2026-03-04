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

export const veterinarianRoutes: Router = Router();

// Public routes
veterinarianRoutes.post('/', registerVeterinarian);
veterinarianRoutes.get('/confirm/:token', confirmVeterinarianAccount);
veterinarianRoutes.post('/login', authenticateVeterinarian);
veterinarianRoutes.post('/forgot-password', forgotPassword);
veterinarianRoutes
  .route('/forgot-password/:token')
  .get(validateResetPasswordToken)
  .post(resetPassword);

// Private routes
veterinarianRoutes.get('/profile', checkAuth, getVeterinarianProfile);
