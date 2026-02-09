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

export async function getPatientById(req, res) {
  const { patientID } = req.params;
  const patient = await Patient.findById(patientID);

  if (!patient) {
    return res
      .status(404)
      .json({ msg: `Paciente con ID ${patient} no encontrado.` });
  }

  if (String(patient.veterinarian._id) !== String(req.veterinarian._id)) {
    return res.json({ msg: 'Acción no válida.' });
  }

  res.json(patient);
}

export async function updatePatientById(req, res) {
  const { patientID } = req.params;
  const patient = await Patient.findById(patientID);

  if (!patient) {
    return res
      .status(404)
      .json({ msg: `Paciente con ID ${patientID} no encontrado.` });
  }

  if (String(patient.veterinarian._id) !== String(req.veterinarian._id)) {
    return res.json({ msg: 'Acción no válida' });
  }

  patient.name = req.body.name || patient.name;
  patient.owner = req.body.owner || patient.owner;
  patient.email = req.body.email || patient.email;
  patient.discharged = req.body.discharged || patient.discharged;
  patient.symptoms = req.body.symptoms || patient.symptoms;

  try {
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
  }
}

export async function deletePatientById(req, res) {
  const { patientID } = req.params;
  const patient = await Patient.findById(patientID);

  if (!patient) {
    return res
      .status(404)
      .json({ msg: `Paciente con ID ${patientID} no encontrado.` });
  }

  if (String(patient.veterinarian._id) !== String(req.veterinarian._id)) {
    return res.json({ msg: 'Acción no válida' });
  }

  try {
    await patient.deleteOne();
    res.json({ msg: `Paciente ${patient.name} eliminado.` });
  } catch (error) {
    console.error(error);
  }
}
