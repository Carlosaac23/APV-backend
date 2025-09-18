import Patient from '../models/Patient.js';

async function addPatient(req, res) {
  const patient = new Patient(req.body);
  patient.veterinarian = req.veterinarian._id;

  try {
    const savedPatient = await patient.save();
    res.json(savedPatient);
  } catch (error) {
    console.error(error);
  }
}

function getPatients(req, res) {}

export { addPatient, getPatients };
