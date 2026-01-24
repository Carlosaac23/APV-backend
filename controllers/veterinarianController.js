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

export async function confirmAccount(req, res) {
  const { token } = req.params;
  const accountToBeConfirmed = await Veterinarian.findOne({ token });

  if (!accountToBeConfirmed) {
    const error = new Error('Token no válido.');
    return res.status(404).json({ msg: error.message });
  }

  try {
    accountToBeConfirmed.token = null;
    accountToBeConfirmed.confirm = true;
    await accountToBeConfirmed.save();

    res.json({ msg: 'Cuenta confirmada correctamente.' });
  } catch (error) {
    console.error(error);
  }
}

export async function authenticateVeterinarian(req, res) {
  const { email, password } = req.body;
  const userExists = await Veterinarian.findOne({ email });

  // Check if user exists
  if (!userExists) {
    const error = new Error('El usuario no existe.');
    return res.status(403).json({ msg: error.message });
  }

  // Check if user has confirmed his account
  if (!userExists.confirm) {
    const error = new Error('La cuenta no ha sido confirmada.');
    return res.status(403).json({ msg: error.message });
  }

  // Check password
  if (!(await userExists.checkPassword(password))) {
    const error = new Error('Contraseña incorrecta.');
    return res.status(403).json({ msg: error.message });
  }

  console.log('Sí existe...');
  res.json({ msg: 'Autenticando usuario...' });
}
