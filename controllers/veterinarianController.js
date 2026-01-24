import Veterinarian from '../models/Veterinarian.js';

export const register = async (req, res) => {
  const { email } = req.body;

  // Prevent duplicate users
  const isEmailTaken = await Veterinarian.findOne({ email });

  if (isEmailTaken) {
    const error = new Error(`El correo ${email} ya está en uso.`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Save new veterinarian
    const veterinarian = new Veterinarian(req.body);
    const savedVeterinarian = await veterinarian.save();
    res.json(savedVeterinarian);
  } catch (error) {
    console.error(error);
  }
};
