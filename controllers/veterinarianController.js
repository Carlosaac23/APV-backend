import Veterinarian from '../models/Veterinarian.js';

async function register(req, res) {
  // const { name, email, password } = req.body;

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

export { register, profile };
