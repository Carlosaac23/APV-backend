import e from 'express';
const router = e.Router();
import {
  registerVeterinarian,
  confirmAccount,
  authenticateVeterinarian,
  forgotPassword,
  verifyToken,
  newPassword,
  accountProfile,
} from '../controllers/veterinarianController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

// Public routes
router.post('/', registerVeterinarian);
router.get('/confirm/:token', confirmAccount);
router.post('/login', authenticateVeterinarian);
router.post('/forgot-password', forgotPassword);
router.route('/forgot-password/:token').get(verifyToken).post(newPassword);

// Private routes
router.get('/profile', checkAuth, accountProfile);

export default router;
