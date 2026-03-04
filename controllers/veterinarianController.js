import { forgotPasswordEmail } from '../helpers/forgotPasswordEmail.js';
import { generateId } from '../helpers/generateId.js';
import { generateJWT } from '../helpers/generateJWT.js';
import { registerEmail } from '../helpers/registerEmail.js';
import Veterinarian from '../models/Veterinarian.js';

function toPublicVeterinarian(veterinarianDoc) {
  return {
    id: veterinarianDoc._id,
    name: veterinarianDoc.name,
    email: veterinarianDoc.email,
    phone: veterinarianDoc.phone,
    web: veterinarianDoc.web,
    confirm: veterinarianDoc.confirm,
    createdAt: veterinarianDoc.createdAt,
    updatedAt: veterinarianDoc.updatedAt,
  };
}

export async function registerVeterinarian(req, res) {
  const { name, email } = req.body;
  const isEmailTaken = await Veterinarian.findOne({ email });

  if (isEmailTaken) {
    const error = new Error(`Email "${email}" is already in use.`);
    return res.status(409).json({ msg: error.message });
  }

  try {
    const veterinarian = new Veterinarian(req.body);
    const savedVeterinarian = await veterinarian.save();

    registerEmail({ name, email, token: savedVeterinarian.token });

    res.status(201).json({
      msg: 'Account successfully created. Please check your email to confirm your account.',
      veterinarian: toPublicVeterinarian(savedVeterinarian),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function confirmVeterinarianAccount(req, res) {
  const { token } = req.params;
  const veterinarian = await Veterinarian.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid token.');
    return res.status(401).json({ msg: error.message });
  }

  try {
    veterinarian.token = null;
    veterinarian.confirm = true;
    await veterinarian.save();

    res.status(200).json({ msg: 'Account successfully confirmed.' });
  } catch (error) {
    console.error(error);
  }
}

export async function authenticateVeterinarian(req, res) {
  const { email, password } = req.body;
  const veterinarian = await Veterinarian.findOne({ email });

  // Check if user exists
  if (!veterinarian) {
    const error = new Error('The user does not exist.');
    return res.status(404).json({ msg: error.message });
  }

  // Check if user has confirmed his account
  if (!veterinarian.confirm) {
    const error = new Error('The account has not been confirmed.');
    return res.status(401).json({ msg: error.message });
  }

  // Check password
  if (!(await veterinarian.checkPassword(password))) {
    const error = new Error('Invalid password.');
    return res.status(401).json({ msg: error.message });
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

  if (!veterinarian) {
    const error = new Error('The user does not exist.');
    return res.status(404).json({ msg: error.message });
  }

  try {
    veterinarian.token = generateId();
    await veterinarian.save();

    forgotPasswordEmail({
      name: veterinarian.name,
      email,
      token: veterinarian.token,
    });

    res.status(200).json({
      msg: `An email has been sent to "${email}" with instructions to reset your password.`,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function validateResetPasswordToken(req, res) {
  const { token } = req.params;
  const veterinarian = await Veterinarian.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid token.');
    return res.status(401).json({ msg: error.message });
  }

  res.status(200).json({ msg: 'Valid token and user exists.' });
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;
  const veterinarian = await Veterinarian.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid or expired token.');
    return res.status(401).json({ msg: error.message });
  }

  try {
    console.log(veterinarian);
    veterinarian.password = password;
    veterinarian.token = null;
    await veterinarian.save();

    res.status(200).json({ msg: 'Password successfully changed.' });
  } catch (error) {
    console.error(error);
  }
}
