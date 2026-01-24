import e from 'express';
const router = e.Router();
import {
  registerVeterinarian,
  confirmAccount,
  authenticateVeterinarian,
} from '../controllers/veterinarianController.js';

router.post('/', registerVeterinarian);
router.get('/confirm/:token', confirmAccount);
router.post('/login', authenticateVeterinarian);

export default router;
