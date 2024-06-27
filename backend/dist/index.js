import express from 'express';
import 'dotenv/config';
const app = express();
const port = process.env.PORT;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDb } from './db/db.js';
import authRoutes from './routes/auth.route.js';
connectToDb();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
