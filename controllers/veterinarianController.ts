import type { Request, Response } from 'express';
import Veterinarian from '../models/Veterinarian.ts';
import generateJWT from '../helpers/generateJWT.ts';
import generateToken from '../helpers/generateToken.ts';
import emailRegister from '../helpers/emailRegister.ts';
import emailForgotPassword from '../helpers/emailForgotPassword.ts';

async function register(req: Request, res: Response) {
  const { name, email } = req.body;

  // Prevenir usuarios duplicados
  const userExist = await Veterinarian.findOne({ email });
  if (userExist) {
    const error = new Error(`El correo ${email} ya está en uso.`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    const veterinarian = new Veterinarian(req.body);
    const savedVeterinarian = await veterinarian.save();

    emailRegister({
      name,
      email,
      token: savedVeterinarian.token,
    });

    res.json(savedVeterinarian);
  } catch (error) {
    console.error(error);
  }
}

function profile(req: Request, res: Response) {
  const { veterinarian } = req;
  res.json(veterinarian);
}

async function verify(req: Request, res: Response) {
  const { token } = req.params;

  const verifyUser = await Veterinarian.findOne({ token });
  if (!verifyUser) {
    const error = new Error('Token no válido.');
    return res.status(404).json({ msg: error.message });
  }

  try {
    verifyUser.token = String(null);
    verifyUser.verify = true;
    await verifyUser.save();

    res.json({ msg: 'Usuario confirmado correctamente.' });
  } catch (error) {
    console.error(error);
  }
}

async function authenticate(req: Request, res: Response) {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const user = await Veterinarian.findOne({ email });
  if (!user) {
    const error = new Error('El usuario no existe.');
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar si el usuario está verificado
  if (!user.verify) {
    const error = new Error('La cuenta no está verificada.');
    return res.status(403).json({ msg: error.message });
  }

  // Revisar el password
  if (!(await user.verifyPassword(password))) {
    const error = new Error('La contraseña es incorrecta.');
    return res.status(403).json({ msg: error.message });
  }

  // Autenticar
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateJWT(user.id),
  });
}

async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  const veterinarianExist = await Veterinarian.findOne({ email });
  if (!veterinarianExist) {
    const error = new Error('El usuario no existe.');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarianExist.token = generateToken();
    await veterinarianExist.save();

    emailForgotPassword({
      name: veterinarianExist.name,
      email,
      token: veterinarianExist.token,
    });

    res.json({
      msg: `Hemos enviado un email a ${email} con las instrucciones.`,
    });
  } catch (error) {
    console.error(error);
  }
}

async function verifyToken(req: Request, res: Response) {
  const { token } = req.params;

  const validToken = await Veterinarian.findOne({ token });
  if (!validToken) {
    const error = new Error('Token no válido.');
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: 'Token válido' });
}

async function newPassword(req: Request, res: Response) {
  const { token } = req.params;
  const { password } = req.body;

  const veterinarian = await Veterinarian.findOne({ token });
  if (!veterinarian) {
    const error = new Error('Hubo un error.');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarian.token = String(null);
    veterinarian.password = password;
    await veterinarian.save();
    res.json({ msg: 'Contraseña guardada correctamente.' });
  } catch (error) {
    console.error(error);
  }
}

async function updateProfile(req: Request, res: Response) {
  const veterinarian = await Veterinarian.findById(req.params.id);
  if (!veterinarian) {
    const error = new Error('Hubo un error');
    return res.status(400).json({ msg: error.message });
  }
  const { email } = req.body;
  if (veterinarian.email !== req.body.email) {
    const emailExist = await Veterinarian.findOne({ email });
    if (emailExist) {
      const error = new Error('Ese email ya está en uso');
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinarian.name = req.body.name;
    veterinarian.email = req.body.email;
    veterinarian.web = req.body.web;
    veterinarian.phone = req.body.phone;

    const updatedVeterinarian = await veterinarian.save();
    res.json(updatedVeterinarian);
  } catch (error) {
    console.error(error);
  }
}

async function updatePassword(req: Request, res: Response) {
  // Leer datos
  const { id } = req.veterinarian;
  const { actual_password, new_password } = req.body;

  // Comprobar que el veterinario existe
  const veterinarian = await Veterinarian.findById(id);
  if (!veterinarian) {
    const error = new Error('Hubo un error');
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar su contraseña
  if (await veterinarian.verifyPassword(actual_password)) {
    // Almacenar nueva contraseña
    veterinarian.password = new_password;
    await veterinarian.save();
    res.json({ msg: 'Contraseña actualizada correctamente.' });
  } else {
    const error = new Error('La contraseña actual es incorrecta.');
    return res.status(400).json({ msg: error.message });
  }
}

export {
  register,
  profile,
  verify,
  authenticate,
  forgotPassword,
  verifyToken,
  newPassword,
  updateProfile,
  updatePassword,
};
