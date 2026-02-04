import { Router } from 'express';

import { addPatient, getPatients } from '../controllers/patientControllers.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(checkAuth, addPatient).get(checkAuth, getPatients);

export default router;
