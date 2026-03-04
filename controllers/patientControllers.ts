import type { Patient } from '../schemas/patientSchema.js';
import type { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { client } from '../db/client.js';

const patientClient = client.db('apv').collection('patients');

export async function addPatient(req: Request, res: Response) {
  const veterinarianRef = req.veterinarian?._id;

  try {
    const newPatient: Patient = {
      name: req.body.name,
      owner: req.body.owner,
      email: req.body.email,
      discharged: req.body.discharged || new Date(),
      symptoms: req.body.symptoms,
      veterinarian: veterinarianRef!,
    };

    await patientClient.insertOne(newPatient);
    res.json(newPatient);
  } catch (error) {
    console.error(error);
  }
}

export async function getPatients(req: Request, res: Response) {
  const patients = await patientClient
    .find({ veterinarian: req.veterinarian?._id })
    .toArray();

  res.json(patients);
}

export async function getPatientById(req: Request, res: Response) {
  const { patientID } = req.params;
  const patient = await patientClient.findOne({
    _id: new ObjectId(patientID as string),
  });

  if (!patient) {
    return res
      .status(404)
      .json({ msg: `Patient with ID ${patientID} not found.` });
  }

  const { veterinarian: patientVeterinarian, ...safePatient } = patient;

  if (String(patientVeterinarian) !== String(req.veterinarian?._id)) {
    return res.json({ msg: 'Not valid action.' });
  }

  res.json(safePatient);
}

export async function updatePatientById(req: Request, res: Response) {
  const { patientID } = req.params;
  const patient = await patientClient.findOne({
    _id: new ObjectId(patientID as string),
  });

  if (!patient) {
    return res
      .status(404)
      .json({ msg: `Patient with ID ${patientID} not found.` });
  }

  const { veterinarian: patientVeterinarian, _id, ...safePatient } = patient;

  if (String(patientVeterinarian) !== String(req.veterinarian?._id)) {
    return res.json({ msg: 'Not valid action.' });
  }

  try {
    const newPatientValues = {
      name: req.body.name || safePatient.name,
      owner: req.body.owner || safePatient.owner,
      email: req.body.email || safePatient.email,
      discharged: req.body.discharged || safePatient.discharged,
      symptoms: req.body.symptoms || safePatient.symptoms,
    };

    await patientClient.updateOne(
      { _id: new ObjectId(patientID as string) },
      { $set: newPatientValues }
    );

    res.json(newPatientValues);
  } catch (error) {
    console.error(error);
  }
}

export async function deletePatientById(req: Request, res: Response) {
  const { patientID } = req.params;
  const patient = await patientClient.findOne({
    _id: new ObjectId(patientID as string),
  });

  if (!patient) {
    return res
      .status(404)
      .json({ msg: `Patient with ID ${patientID} not found.` });
  }

  const { veterinarian: patientVeterinarian, ..._safePatient } = patient;

  if (String(patientVeterinarian) !== String(req.veterinarian?._id)) {
    return res.json({ msg: 'Not valid action.' });
  }

  try {
    await patientClient.deleteOne({ _id: new ObjectId(patientID as string) });
    res.json({ msg: `Patient ${patient.name} deleted.` });
  } catch (error) {
    console.error(error);
  }
}
