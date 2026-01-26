import { generateId } from '../helpers/generateId.js';
import { generateJWT } from '../helpers/generateJWT.js';
import Veterinarian from '../models/Veterinarian.js';

export async function registerVeterinarian(req, res) {
  const { email } = req.body;
  const isEmailTaken = await Veterinarian.findOne({ email });

  if (isEmailTaken) {
    const error = new Error(`El correo ${email} ya está en uso.`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    const veterinarian = new Veterinarian(req.body);
    const savedVeterinarian = await veterinarian.save();
    res.json(savedVeterinarian);
  } catch (error) {
    console.error(error);
  }
}

export async function confirmVeterinarianAccount(req, res) {
  const { token } = req.params;
  const veterinarian = await Veterinarian.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Token no válido.');
    return res.status(404).json({ msg: error.message });
  }

  try {
    veterinarian.token = null;
    veterinarian.confirm = true;
    await veterinarian.save();

    res.json({ msg: 'Cuenta confirmada correctamente.' });
  } catch (error) {
    console.error(error);
  }
}

export async function authenticateVeterinarian(req, res) {
  const { email, password } = req.body;
  const veterinarian = await Veterinarian.findOne({ email });

  // Check if user exists
  if (!veterinarian) {
    const error = new Error('El usuario no existe.');
    return res.status(403).json({ msg: error.message });
  }

  // Check if user has confirmed his account
  if (!veterinarian.confirm) {
    const error = new Error('La cuenta no ha sido confirmada.');
    return res.status(403).json({ msg: error.message });
  }

  // Check password
  if (!(await veterinarian.checkPassword(password))) {
    const error = new Error('Contraseña incorrecta.');
    return res.status(403).json({ msg: error.message });
  }

  res.json({ token: generateJWT(veterinarian.id) });
}

export function getVeterinarianProfile(req, res) {
  const { veterinarian } = req;
  res.json({ profile: veterinarian });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const veterinarian = await Veterinarian.findOne({ email });
  console.log(veterinarian);

  if (!veterinarian) {
    const error = new Error('El usuario no existe.');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarian.token = generateId();
    await veterinarian.save();

    res.json({
      msg: `Hemos enviado un correo a ${email} con los siguientes pasos.`,
    });
  } catch (error) {
    console.error(error);
  }
}

export function resetPasswordToken(req, res) {}

export function resetPassword(req, res) {}
