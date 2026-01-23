import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';

import generateToken from '@/helpers/generateToken.js';

const veterinarianSchema = new Schema({
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

veterinarianSchema.methods.verifyPassword = async function (formPassword) {
  return await bcrypt.compare(formPassword, this.password);
};

const Veterinarian = model('Veterinarian', veterinarianSchema);
export default Veterinarian;
