import { Schema, model } from 'mongoose';

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    symptoms: {
      type: String,
      required: true,
    },
    veterinarian: {
      type: Schema.Types.ObjectId,
      ref: 'Veterinarian',
    },
  },
  {
    timestamps: true,
  }
);

const Patient = model('Patient', patientSchema);
export default Patient;
