import jwt from 'jsonwebtoken';

export function generateJWT(userID) {
  return jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}
