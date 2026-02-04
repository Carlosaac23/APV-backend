import Patient from '../models/Patient.js';

export async function addPatient(req, res) {
  const patient = new Patient(req.body);
  patient.veterinarian = req.veterinarian._id;

  try {
    const savedPatient = await patient.save();
    res.json(savedPatient);
  } catch (error) {
    console.error(error);
  }
}

export async function getPatients(req, res) {
  const patients = await Patient.find()
    .where('veterinarian')
    .equals(req.veterinarian);

  res.json(patients);
}
