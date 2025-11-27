import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    items: [orderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ['CREATED', 'PAID', 'CANCELED'],
        default: 'CREATED'
    },
    paymentRef: { type: String, default: '' },


    delivery: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        postal: { type: String, default: '' },
        reference: { type: String, default: '' }
    }
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
