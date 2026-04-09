import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from './config/passport';

import authRoutes     from './routes/auth';
import productRoutes  from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes     from './routes/cart';
import orderRoutes    from './routes/orders';
import userRoutes     from './routes/users';
import contactRoutes  from './routes/contact';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(session({ secret: process.env.JWT_SECRET || 'ceylon_session_secret', resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 86400000 } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/contact',    contactRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'CeylonCart API is running 🥥', timestamp: new Date().toISOString() }));

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI is not defined in .env file');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 CeylonCart API running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
