import type { Request, Response } from 'express';
import Patient from '../models/Patient.ts';

async function addPatient(req: Request, res: Response) {
  const patient = new Patient(req.body);
  patient.veterinarian = req.veterinarian._id;

  try {
    const savedPatient = await patient.save();
    res.json(savedPatient);
  } catch (error) {
    console.error(error);
  }
}

async function getPatients(req: Request, res: Response) {
  const patients = await Patient.find()
    .where('veterinarian')
    .equals(req.veterinarian);

  res.json(patients);
}

async function getPatient(req: Request, res: Response) {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    const error = new Error('Paciente No Encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (
    !patient.veterinarian ||
    String(patient.veterinarian._id) !== String(req.veterinarian._id)
  ) {
    return res.json({ msg: 'Acción No Válida' });
  }

  res.json(patient);
}

async function updatePatient(req: Request, res: Response) {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    const error = new Error('Paciente No Encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (
    !patient.veterinarian ||
    String(patient.veterinarian._id) !== String(req.veterinarian._id)
  ) {
    return res.json({ msg: 'Acción No Válida' });
  }

  // Actualizar paciente
  patient.name = req.body.name || patient.name;
  patient.owner = req.body.owner || patient.owner;
  patient.email = req.body.email || patient.email;
  patient.date = req.body.date || patient.date;
  patient.symptoms = req.body.symptoms || patient.symptoms;

  try {
    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
  }
}

async function deletePatient(req: Request, res: Response) {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    const error = new Error('Paciente No Encontrado');
    return res.status(404).json({ msg: error.message });
  }

  if (
    !patient.veterinarian ||
    String(patient.veterinarian._id) !== String(req.veterinarian._id)
  ) {
    return res.json({ msg: 'Acción No Válida' });
  }

  try {
    await patient.deleteOne();
    res.json({ msg: 'Paciente Eliminado' });
  } catch (error) {
    console.error(error);
  }
}

export { addPatient, getPatients, getPatient, updatePatient, deletePatient };
