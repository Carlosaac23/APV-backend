import { ObjectId } from 'mongodb';
import { z } from 'zod';

const patientSchema = z.object({
  id: z.instanceof(ObjectId).optional(),
  name: z.string(),
  owner: z.string(),
  email: z.email(),
  discharged: z.date(),
  symptoms: z.string(),
  veterinarian: z.instanceof(ObjectId),
});

export type Patient = z.infer<typeof patientSchema>;
