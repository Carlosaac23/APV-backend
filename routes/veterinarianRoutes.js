import express from 'express';
import {
  register,
  profile,
  verify,
  authenticate,
} from '../controllers/veterinarianController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', register);
router.get('/verify/:token', verify);
router.post('/login', authenticate);

router.get('/profile', checkAuth, profile);

export default router;
