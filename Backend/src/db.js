// src/db.js
import mongoose from 'mongoose';

export async function connectDB(uri) {
    try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado:', mongoose.connection.host);
    } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
    }
}

export function attachMongoEvents() {
    mongoose.connection.on('connected', () => console.log('🟢 connected'));
    mongoose.connection.on('error', (e) => console.log('🔴 error', e));
    mongoose.connection.on('disconnected', () => console.log('🟡 disconnected'));
}
