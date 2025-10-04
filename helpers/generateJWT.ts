import jwt from 'jsonwebtoken';

export default function generateJWT(id: string) {
  const { JWT_SECRET } = process.env;
  return jwt.sign({ id }, JWT_SECRET as string, {
    expiresIn: '30 days',
  });
}
