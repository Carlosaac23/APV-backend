import jwt from 'jsonwebtoken';

import Veterinarian from '../models/Veterinarian.js';

export async function checkAuth(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      req.veterinarian = await Veterinarian.findById(
        tokenDecoded.userID
      ).select('-password -token -confirm');
      return next();
    } catch (e) {
      console.error(e);
      const error = new Error('Token no válido.');
      return res.status(403).json({ msg: error.message });
    }
  }

  if (!token) {
    const error = new Error('Token no válido o inexistente.');
    res.status(403).json({ msg: error.message });
  }

  next();
}
