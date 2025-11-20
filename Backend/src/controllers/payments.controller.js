import Payment from '../models/payment.model.js';
import Order from '../models/order.js';


export const createPayment = async (req, res) => {
    try {
    const { orderId, method, amount } = req.body;
    if (!orderId || !method || !amount)
        return res.status(400).json({ message: 'Datos incompletos' });


    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });


    const approved = Math.random() > 0.1; // 90% de aprobación
    const status = approved ? 'APROBADO' : 'RECHAZADO';

    const payment = await Payment.create({
        user: req.user.id,
        order: orderId,
        method,
        amount,
        status
    });


        if (approved) {
        order.status = 'PAGADO';
        await order.save();
    }

    res.status(201).json({ message: 'Pago procesado', payment });
    } catch (error) {
    res.status(500).json({ message: 'Error procesando el pago', error: error.message });
    }
};


export const listPayments = async (req, res) => {
    const payments = await Payment.find()
    .populate('user', 'name email')
    .populate('order', 'total status')
    .sort({ createdAt: -1 });
    res.json(payments);
};
