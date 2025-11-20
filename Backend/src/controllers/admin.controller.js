import Product from '../models/product.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import Category from '../models/category.js';


    export const getStats = async (req, res) => {
    const [products, categories, users, orders] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    ]);


    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);

    const revenue = await Order.aggregate([
    { $match: { createdAt: { $gte: last30 }, status: { $in: ['PAGADO', 'EN_REPARTO', 'ENTREGADO'] } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    res.json({
    counts: { products, categories, users, orders },
    revenueLast30Days: revenue[0]?.total || 0,
    });
};


    export const listOrders = async (req, res) => {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('items.product', 'name price');

    res.json(orders);
};


export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const ALLOWED = ['CREADO', 'PAGADO', 'EN_REPARTO', 'ENTREGADO', 'CANCELADO'];
    if (!ALLOWED.includes(status)) {
    return res.status(400).json({ message: 'Estado no permitido' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    .populate('user', 'name email')
    .populate('items.product', 'name');

    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
};


    export const listUsers = async (req, res) => {
    const users = await User.find().select('name email role createdAt');
    res.json(users);
};


export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // 'user' | 'admin'
    if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('name email role');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
};


export const toggleProductActive = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).select('name isActive');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    product.isActive = !product.isActive;
    await product.save();

    res.json({ id: product._id, name: product.name, isActive: product.isActive });
};
