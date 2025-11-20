import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB, attachMongoEvents } from './db.js';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/orders.routes.js';
import categoryRoutes from './routes/category.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();

// 🔹 CORS (para que el front en Vercel pueda llamar al backend)
app.use(cors({
    origin: [
        'http://localhost:5500', // si usas Live Server
        'https://ecomarket-five.vercel.app/'
    ],
    credentials: true
}));

// middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'ecomarket-backend', time: new Date().toISOString() });
});

// Conectar a MongoDB y arrancar servidor después
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomarket';

connectDB(MONGODB_URI)
    .then(() => {
        attachMongoEvents();

        // prefix API
        app.use('/api/auth', authRoutes);
        app.use('/api/products', productRoutes);
        app.use('/api/cart', cartRoutes);
        app.use('/api/orders', orderRoutes);
        app.use('/api/category', categoryRoutes);
        app.use('/api/admin', adminRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 API escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error conectando a MongoDB', err?.message || err);
        process.exit(1);
    });
