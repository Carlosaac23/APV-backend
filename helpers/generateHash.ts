import bcrypt from 'bcrypt';

export async function generateHashPassword(password: string, salt: number) {
  return await bcrypt.hash(password, salt);
}
