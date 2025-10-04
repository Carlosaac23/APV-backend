import { Model } from 'mongoose';

export interface IVeterinarian {
  name: string;
  password: string;
  email: string;
  phone?: string | null;
  web?: string | null;
  token: string;
  verify: boolean;
}

export interface IVeterinarianMethods {
  verifyPassword(password: string): Promise<boolean>;
}

export type VeterinarianModel = Model<
  IVeterinarian,
  Record<string, never>,
  IVeterinarianMethods
>;
