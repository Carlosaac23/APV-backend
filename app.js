import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './config/db.js';
import veterinarianRoutes from './routes/veterinarianRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use('/api/veterinarians', veterinarianRoutes);

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
  console.log(`Server working on http://localhost:${PORT}`);
});
