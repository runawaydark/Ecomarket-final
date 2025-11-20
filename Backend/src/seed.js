import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/category.js';
import Product from './models/product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ecomarket';

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ DB connected');

        await Category.deleteMany({});
        await Product.deleteMany({});

        const cats = await Category.insertMany([
            { name: 'Frutas', slug: 'frutas', description: 'Frutas frescas' },
            { name: 'Verduras', slug: 'verduras', description: 'Verduras frescas' },
            { name: 'Despensa', slug: 'despensa', description: 'Productos de despensa' },
            { name: 'Ofertas', slug: 'ofertas', description: 'Ofertas y promociones' }
        ]);

        await Product.create([
            { name: 'Manzana Fuji', price: 1200, stock: 100, imageUrl: '', category: cats[0]._id },
            { name: 'Plátano', price: 800, stock: 120, imageUrl: '', category: cats[0]._id },
            { name: 'Lechuga', price: 700, stock: 60, imageUrl: '', category: cats[1]._id }
        ]);

        console.log('Seed OK');
    } catch (e) {
        console.error('Seed error:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
