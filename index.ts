import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import connectDB from './config/db.js';
import veterinarianRoutes from './routes/veterinarianRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

const { FRONTEND_URL } = process.env;
const allowedDomains = [FRONTEND_URL];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
