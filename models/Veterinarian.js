import mongoose from 'mongoose';
import generateToken from '../helpers/generateToken.js';

const veterinarianSchema = mongoose.Schema({
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

const Veterinarian = mongoose.model('Veterinarian', veterinarianSchema);
export default Veterinarian;
