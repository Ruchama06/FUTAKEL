import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import anneesRoutes from './routes/annees';
import elevesRoutes from './routes/eleves';
import classesRoutes from './routes/classes';
import caisseRoutes from './routes/caisse';
import paiementsRoutes from './routes/paiements';
import depensesRoutes from './routes/depenses';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FUTAKEL backend is alive' });
});

app.use('/api/auth', authRoutes);
app.use('/api/eleves', elevesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/caisse', caisseRoutes);
app.use('/api/paiements', paiementsRoutes);
app.use('/api/depenses', depensesRoutes);
app.use('/api/annees', anneesRoutes);

app.listen(PORT, () => {
  console.log(`FUTAKEL backend running on http://localhost:${PORT}`);
});