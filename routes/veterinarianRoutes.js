import express from 'express';
import {
  register,
  profile,
  verify,
} from '../controllers/veterinarianController.js';

const router = express.Router();

router.post('/', register);
router.get('/profile', profile);
router.get('/verify/:token', verify);

export default router;
