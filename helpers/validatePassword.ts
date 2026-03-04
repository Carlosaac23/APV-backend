import bcrypt from 'bcrypt';

export async function validateHashedPassword(
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
}
