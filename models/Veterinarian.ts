import {
  IVeterinarian,
  IVeterinarianMethods,
  VeterinarianModel,
} from '../types/veterinarian.js';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import generateToken from '../helpers/generateToken.ts';

const veterinarianSchema = new Schema<
  IVeterinarian,
  IVeterinarianMethods,
  VeterinarianModel
>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generateToken(),
  },
  verify: {
    type: Boolean,
    default: false,
  },
});

veterinarianSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

veterinarianSchema.methods.verifyPassword = async function (
  formPassword: string
) {
  return await bcrypt.compare(formPassword, this.password);
};

const Veterinarian = model<IVeterinarian, VeterinarianModel>(
  'Veterinarian',
  veterinarianSchema
);
export default Veterinarian;
