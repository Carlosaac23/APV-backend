import express from 'express';
import {
  register,
  profile,
  verify,
  authenticate,
  forgotPassword,
  verifyToken,
  newPassword,
  updateProfile,
} from '../controllers/veterinarianController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Área pública
router.post('/', register);
router.get('/verify/:token', verify);
router.post('/login', authenticate);
router.post('/forgot-password', forgotPassword);
router.route('/forgot-password/:token').get(verifyToken).post(newPassword);

// Área privada
router.get('/profile', checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);

export default router;
