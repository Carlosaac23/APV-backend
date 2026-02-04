import { Router } from 'express';

import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
} from '../controllers/patientControllers.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').post(checkAuth, addPatient).get(checkAuth, getPatients);
router
  .route('/:patientID')
  .get(checkAuth, getPatientById)
  .put(checkAuth, updatePatientById)
  .delete(checkAuth, deletePatientById);

export default router;
