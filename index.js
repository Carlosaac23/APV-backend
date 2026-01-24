import dotenv from 'dotenv';
import e from 'express';

import { connectDB } from './config/db.js';
import veterinarianRoutes from './routes/veterinarianRoutes.js';

const app = e();
app.use(e.json());
dotenv.config();
connectDB();

app.use('/api/veterinarians', veterinarianRoutes);

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
