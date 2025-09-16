import express from 'express';
import { register, profile } from '../controllers/veterinarianController.js';

const router = express.Router();

router.post('/', register);
router.get('/profile', profile);

export default router;
