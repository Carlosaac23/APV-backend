import cors from 'cors';
import type { CorsOptions } from 'cors';
import express from 'express';

import { connectDB } from './db/client.js';
import { veterinarianRoutes } from './routes/veterinarianRoutes.js';

const app = express();
app.use(express.json());
connectDB();

const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin || allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
      return;
    }

    callback(new Error('No permitido por CORS'));
  },
};

app.use(cors(corsOptions));

app.use('/api/veterinarians', veterinarianRoutes);
// app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, (error: unknown) => {
  if (error) {
    console.error('Error starting the server:', error);
    throw error;
  }
  console.log(`Server working on http://localhost:${PORT}`);
});
