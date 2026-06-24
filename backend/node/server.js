import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectToMongoDB } from './db/mongo.js';
import queryRoutes from './routes/query.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log(process.env.MONGO_URI);
connectToMongoDB(process.env.MONGO_URI);

app.use(cors({ origin: process.env.Frontend_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/query', queryRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'Node gateway operational' });
});

app.listen(PORT, () => {
    console.log(`Express gateway running on http://localhost:${PORT}`);
});