import express from 'express';
import { addPatient, getPatients } from '../controllers/patientControllers.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(checkAuth, addPatient).get(getPatients);

export default router;
