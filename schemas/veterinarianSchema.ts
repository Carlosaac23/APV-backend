import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { generateToken } from '../helpers/generateToken.js';

const veterinarianSchema = z.object({
  id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  phone: z.string().optional(),
  web: z.url().optional(),
  token: z.string().default(generateToken()),
  confirm: z.boolean().default(false),
});

export type Veterinarian = z.infer<typeof veterinarianSchema>;

export type VeterinarianEmail = Pick<Veterinarian, 'name' | 'email' | 'token'>;
