import Veterinarian from '../models/Veterinarian.js';

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
  res.json({
    msg: 'Mostrando perfil...',
  });
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

export { register, profile, verify };
