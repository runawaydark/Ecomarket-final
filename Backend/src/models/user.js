import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' }
    },
    { timestamps: true }
);

// helper para setear password
userSchema.methods.setPassword = async function (plain) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(plain, salt);
};

// helper para verificar password
userSchema.methods.validatePassword = async function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

export default mongoose.model('User', userSchema);
