import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/category.js';
import Product from './models/product.js';
import User from './models/user.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ecomarket';

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ DB connected');

        // Limpiar colecciones
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});

        // Crear usuarios de prueba
        console.log('📝 Creando usuarios de prueba...');
        
        // Usuario normal
        const normalUser = new User({
            name: 'Usuario Prueba',
            email: 'prueba@prueba.com',
            role: 'CUSTOMER',
            passwordHash: 'tmp'
        });
        await normalUser.setPassword('123456');
        await normalUser.save();
        console.log('✅ Usuario creado: prueba@prueba.com / 123456');

        // Usuario admin
        const adminUser = new User({
            name: 'Administrador',
            email: 'admin@ecomarket.com',
            role: 'ADMIN',
            passwordHash: 'tmp'
        });
        await adminUser.setPassword('admin123');
        await adminUser.save();
        console.log('✅ Admin creado: admin@ecomarket.com / admin123');

        // Crear categorías
        const cats = await Category.insertMany([
            { name: 'Frutas', slug: 'frutas', description: 'Frutas frescas' },
            { name: 'Verduras', slug: 'verduras', description: 'Verduras frescas' },
            { name: 'Despensa', slug: 'despensa', description: 'Productos de despensa' },
            { name: 'Ofertas', slug: 'ofertas', description: 'Ofertas y promociones' }
        ]);

        // Crear productos
        await Product.create([
            { name: 'Manzana Fuji', price: 1200, stock: 100, imageUrl: '', category: cats[0]._id },
            { name: 'Plátano', price: 800, stock: 120, imageUrl: '', category: cats[0]._id },
            { name: 'Lechuga', price: 700, stock: 60, imageUrl: '', category: cats[1]._id }
        ]);

        console.log('✅ Seed completado exitosamente');
        console.log('\n📋 Credenciales de prueba:');
        console.log('   Usuario normal: prueba@prueba.com / 123456');
        console.log('   Administrador: admin@ecomarket.com / admin123');
    } catch (e) {
        console.error('❌ Seed error:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
