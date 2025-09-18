import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import veterinarianRoutes from './routes/veterinarianRoutes.js';
import patientRoutes from './routes/patientRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
