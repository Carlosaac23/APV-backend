import jwt from 'jsonwebtoken';

import Veterinarian from '../models/Veterinarian.js';

export default async function checkAuth(req, res, next) {
  let { authorization: token } = req.headers;
  const { JWT_SECRET } = process.env;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.veterinarian = await Veterinarian.findById(decoded.id).select(
        '-password -token -verify'
      );

      return next();
    } catch (error) {
      const e = new Error('Token no válido: ', error);
      res.status(403).json({ msg: e.message });
      return;
    }
  }

  if (!token) {
    const error = new Error('Token no válido o inexistente');
    res.status(403).json({ msg: error.message });
  }

  next();
}
