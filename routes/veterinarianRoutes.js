import e from 'express';
const router = e.Router();
import { register } from '../controllers/veterinarianController.js';

router.post('/', register);

export default router;
