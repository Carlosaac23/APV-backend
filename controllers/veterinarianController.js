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
    const error = new Error('Token no válido');
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
