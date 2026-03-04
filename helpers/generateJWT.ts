import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export function generateJWT(userID: ObjectId) {
  return jwt.sign({ userID }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
}
