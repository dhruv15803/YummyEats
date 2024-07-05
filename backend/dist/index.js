import express from 'express';
import 'dotenv/config';
const app = express();
const port = process.env.PORT;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDb } from './db/db.js';
import authRoutes from './routes/auth.route.js';
import adminRoutes from './routes/admin.route.js';
import restaurantRoutes from './routes/restaurant.route.js';
import orderRoutes from './routes/order.route.js';
connectToDb();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use('/api/order/webhook', express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/order', orderRoutes);
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});
