import e from 'express';
const router = e.Router();
import {
  registerVeterinarian,
  confirmAccount,
} from '../controllers/veterinarianController.js';

router.post('/', registerVeterinarian);
router.get('/confirm/:token', confirmAccount);

export default router;
