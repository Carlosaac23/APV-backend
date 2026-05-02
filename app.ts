import cors from 'cors';
import type { CorsOptions } from 'cors';
import express from 'express';
import type { Express } from 'express';

import { connectDB } from './db/client.js';
import { connectDBMiddleware } from './middleware/connectDBMiddleware.js';
import { patientRoutes } from './routes/patientRoutes.js';
import { veterinarianRoutes } from './routes/veterinarianRoutes.js';

const app: Express = express();
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

app.use(connectDBMiddleware);
app.use(cors(corsOptions));

app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/patients', patientRoutes);

export default app;
