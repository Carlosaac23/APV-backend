import { Router } from 'express';

import { addPatient, getPatient } from '../controllers/patientControllers.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(checkAuth, addPatient).get(getPatient);

export default router;
