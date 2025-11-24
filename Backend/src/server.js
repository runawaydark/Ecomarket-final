import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { connectDB, attachMongoEvents } from './db.js';

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";



dotenv.config();
const app = express();




//  CORS (para que el front en Vercel pueda llamar al backend)
app.use(cors({
    origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5500/Frontend/index.html"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200
    
}));

// Habilitar preflight
app.options("*", cors());


// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);

app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'ecomarket-backend', time: new Date().toISOString() });
});

// Conectar a MongoDB y arrancar servidor después
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomarket';

connectDB(MONGODB_URI)
    .then(() => {
        attachMongoEvents();

        // prefijo API
        app.use("/api/auth", authRoutes);
        app.use("/api/products", productsRoutes);
        app.use("/api/cart", cartRoutes);
        app.use("/api/orders", ordersRoutes);
        app.use("/api/categories", categoryRoutes);
        app.use("/api/admin", adminRoutes);
        app.use("/api/payments", paymentsRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 API escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error conectando a MongoDB', err?.message || err);
        process.exit(1);
    });
