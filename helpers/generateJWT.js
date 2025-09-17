import jwt from 'jsonwebtoken';

export default function generateJWT(id) {
  const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ id }, secretKey, {
    expiresIn: '30 days',
  });
}
