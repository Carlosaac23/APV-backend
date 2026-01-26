import e from 'express';
const router = e.Router();
import {
  registerVeterinarian,
  confirmVeterinarianAccount,
  authenticateVeterinarian,
  forgotPassword,
  resetPasswordToken,
  resetPassword,
  getVeterinarianProfile,
} from '../controllers/veterinarianController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

// Public routes
router.post('/', registerVeterinarian);
router.get('/confirm/:token', confirmVeterinarianAccount);
router.post('/login', authenticateVeterinarian);
router.post('/forgot-password', forgotPassword);
router
  .route('/forgot-password/:token')
  .get(resetPasswordToken)
  .post(resetPassword);

// Private routes
router.get('/profile', checkAuth, getVeterinarianProfile);

export default router;
