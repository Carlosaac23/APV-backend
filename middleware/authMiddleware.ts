import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { client } from '../db/client.js';

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const tokenDecoded = jwt.verify(token!, process.env.JWT_SECRET!);

      if (typeof tokenDecoded === 'string') {
        return res.status(403).json({ msg: 'Invalid token.' });
      }

      req.veterinarian = await client
        .db('apv')
        .collection('veterinarians')
        .findOne(
          { _id: new ObjectId(tokenDecoded.userID) },
          { projection: { password: 0, token: 0, confirm: 0 } }
        );

      return next();
    } catch (e: unknown) {
      console.error(e);
      const error = new Error('Invalid token.');
      return res.status(403).json({ msg: error.message });
    }
  }

  if (!token) {
    const error = new Error('Token no válido o inexistente.');
    res.status(403).json({ msg: error.message });
  }

  next();
}
