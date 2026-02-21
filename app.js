import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.js';
import patientRoutes from './routes/patientRoutes.js';
import veterinarianRoutes from './routes/veterinarianRoutes.js';

const app = express();
app.use(express.json());
configDotenv();
connectDB();

const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
      return;
    }

    callback(new Error('No permitido por CORS'));
  },
};

app.use(cors(corsOptions));

app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(4000, error => {
  if (error) {
    console.error('Error starting the server:', error);
    throw error;
  }
  console.log(`Server working on http://localhost:${PORT}`);
});
