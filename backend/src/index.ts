import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FUTAKEL backend is alive' });
});

// Routes auth
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`FUTAKEL backend running on http://localhost:${PORT}`);
});