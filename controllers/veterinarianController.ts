import type { Veterinarian } from '../schemas/veterinarianSchema.js';
import type { Request, Response } from 'express';

import { client } from '../db/client.js';
import { forgotPasswordEmail } from '../helpers/forgotPasswordEmail.js';
import { generateHashPassword } from '../helpers/generateHash.js';
import { generateJWT } from '../helpers/generateJWT.js';
import { generateToken } from '../helpers/generateToken.js';
import { registerEmail } from '../helpers/registerEmail.js';
import { validateHashedPassword } from '../helpers/validatePassword.js';

const veterinarianClient = client.db('apv').collection('veterinarians');
export async function registerVeterinarian(req: Request, res: Response) {
  const { name, email } = req.body;
  const isEmailTaken = await veterinarianClient.findOne({ email });

  if (isEmailTaken) {
    const error = new Error(`Email "${email}" is already in use.`);
    return res.status(409).json({ msg: error.message });
  }

  try {
    const newVet: Veterinarian = {
      name: req.body.name,
      email: req.body.email,
      password: await generateHashPassword(req.body.password, 12),
      phone: req.body.phone || null,
      web: req.body.web || null,
      token: generateToken(),
      confirm: false,
    };

    await veterinarianClient.insertOne(newVet);

    registerEmail({ name, email, token: newVet.token });

    res.status(201).json({
      msg: 'Account successfully created. Please check your email to confirm your account.',
      newVet,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function confirmVeterinarianAccount(req: Request, res: Response) {
  const { token } = req.params;
  const veterinarian = await veterinarianClient.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid token.');
    return res.status(404).json({ msg: error.message });
  }

  try {
    await veterinarianClient.updateOne(
      { token },
      { $set: { token: null, confirm: true } }
    );

    res.status(200).json({ msg: 'Account successfully confirmed.' });
  } catch (error) {
    console.error(error);
  }
}

export async function authenticateVeterinarian(req: Request, res: Response) {
  const { email, password } = req.body;
  const veterinarian = await veterinarianClient.findOne({ email });

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
  if (!(await validateHashedPassword(password, veterinarian.password))) {
    const error = new Error('Invalid password.');
    return res.status(401).json({ msg: error.message });
  }

  res.json({ token: generateJWT(veterinarian._id) });
}

export function getVeterinarianProfile(req: Request, res: Response) {
  const { veterinarian } = req;
  res.json({ profile: veterinarian });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const veterinarian = await veterinarianClient.findOne({ email });

  if (!veterinarian) {
    const error = new Error('An account with that email does not exist.');
    return res.status(404).json({ msg: error.message });
  }

  const newToken = generateToken();

  try {
    await veterinarianClient.updateOne(
      { email },
      { $set: { token: newToken } }
    );

    forgotPasswordEmail({
      name: veterinarian.name,
      email,
      token: newToken,
    });

    res.status(200).json({
      msg: `An email has been sent to "${email}" with instructions to reset your password.`,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function validateResetPasswordToken(req: Request, res: Response) {
  const { token } = req.params;
  const veterinarian = await veterinarianClient.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid token.');
    return res.status(404).json({ msg: error.message });
  }

  res.status(200).json({ msg: 'Valid token and user exists.' });
}

export async function resetPassword(req: Request, res: Response) {
  const { token } = req.params;
  const { password } = req.body;
  const veterinarian = await veterinarianClient.findOne({ token });

  if (!veterinarian) {
    const error = new Error('Invalid or expired token.');
    return res.status(401).json({ msg: error.message });
  }

  try {
    await veterinarianClient.updateOne(
      { token },
      {
        $set: {
          password: await generateHashPassword(password, 12),
          token: null,
        },
      }
    );

    res.status(200).json({ msg: 'Password successfully changed.' });
  } catch (error) {
    console.error(error);
  }
}
