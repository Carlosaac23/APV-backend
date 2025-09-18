import jwt from 'jsonwebtoken';

export default function generateJWT(id) {
  const { JWT_SECRET } = process.env;
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30 days',
  });
}
