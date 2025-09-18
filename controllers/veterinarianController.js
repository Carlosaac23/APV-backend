import Veterinarian from '../models/Veterinarian.js';
import generateJWT from '../helpers/generateJWT.js';
import generateToken from '../helpers/generateToken.js';

async function register(req, res) {
  const { email } = req.body;

  // Prevenir usuarios duplicados
  const userExist = await Veterinarian.findOne({ email });
  if (userExist) {
    const error = new Error('Usuario ya registrado');
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

function profile(req, res) {
  const { veterinarian } = req;
  res.json({ veterinarian });
}

async function verify(req, res) {
  const { token } = req.params;

  const verifyUser = await Veterinarian.findOne({ token });
  if (!verifyUser) {
    const error = new Error('Token no válido');
    return res.status(404).json({ msg: error.message });
  }

  try {
    verifyUser.token = null;
    verifyUser.verify = true;
    await verifyUser.save();

    res.json({ msg: 'Usuario Confirmado Correctamente' });
  } catch (error) {
    console.error(error);
  }
}

async function authenticate(req, res) {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const user = await Veterinarian.findOne({ email });
  if (!user) {
    const error = new Error('El usuario no existe');
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar si el usuario está verificado
  if (!user.verify) {
    const error = new Error('La cuenta no está verificada');
    return res.status(403).json({ msg: error.message });
  }

  // Revisar el password
  if (!(await user.verifyPassword(password))) {
    const error = new Error('La contraseña es incorrecta');
    return res.status(403).json({ msg: error.message });
  }

  // Autenticar
  res.json({ token: generateJWT(user.id) });
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  const veterinarianExist = await Veterinarian.findOne({ email });
  if (!veterinarianExist) {
    const error = new Error('El usuario no existe');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarianExist.token = generateToken();
    await veterinarianExist.save();
    res.json({
      msg: `Hemos enviado un email a ${email} con las instrucciones`,
    });
  } catch (error) {
    console.error(error);
  }
}

async function verifyToken(req, res) {
  const { token } = req.params;

  const validToken = await Veterinarian.findOne({ token });
  if (!validToken) {
    const error = new Error('Token no válido');
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: 'Token válido' });
}

async function newPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const veterinarian = await Veterinarian.findOne({ token });
  if (!veterinarian) {
    const error = new Error('Hubo un error');
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinarian.token = null;
    veterinarian.password = password;
    await veterinarian.save();
    res.json({ msg: 'Contraseña Guardada Correctamente' });
  } catch (error) {
    console.error(error);
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
};
