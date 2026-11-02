import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import listRoutes from './routes/lists.js';
import itemRoutes from './routes/items.js';
import activityRoutes from './routes/activity.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin === 'http://localhost:5173') return cb(null, true);
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return cb(null, true);
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/activity', activityRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`🔥 on ${PORT}`)))
  .catch(err => {
    console.error('Mongo connect failed:', err.message);
    process.exit(1);
  });