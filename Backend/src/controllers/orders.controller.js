import Order from '../models/order.js';
import Cart from '../models/cart.js';
import { badRequest, ok } from '../utils/http.js';
import Product from '../models/product.js';

export async function checkout(req, res) {
    // 1) Intentar usar carrito en Mongo (si existiera)
    let cart = await Cart.findOne({ user: req.user.id, status: 'ACTIVE' })
        .populate('items.product', 'price name');

    let items = [];

    if (cart && cart.items.length > 0) {
        // Tenemos carrito en BD
        items = cart.items.map(i => {
            const unitPrice = i.unitPrice ?? i.product.price;
            return {
                product: i.product._id,
                quantity: i.quantity,
                unitPrice,
            };
        });
    } else {
        // 2) Fallback: usar items enviados por el frontend
        const bodyItems = Array.isArray(req.body.items) ? req.body.items : [];

        if (!bodyItems.length) {
            return badRequest(res, 'Carrito vacío');
        }

        // Obtenemos precios reales desde la colección Product
        const productIds = bodyItems.map(i => i.productId);
        const products = await Product.find({ _id: { $in: productIds } }).select('price');

        const productMap = new Map(
            products.map(p => [p._id.toString(), p])
        );

        items = bodyItems.map(i => {
            const p = productMap.get(String(i.productId));
            if (!p) {
                throw new Error(`Producto no encontrado: ${i.productId}`);
            }
            return {
                product: p._id,
                quantity: Number(i.quantity) || 1,
                unitPrice: p.price
            };
        });
    }

    // 3) Calcular total
    const total = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);

    // 4) Crear orden con estado por defecto 'CREATED'
    const order = await Order.create({
        user: req.user.id,
        items,
        total,
        // status: 'CREATED' y paymentRef vienen del schema por defecto
    });

    // OJO: NO tocamos el carrito aquí; se limpia cuando Webpay confirma el pago
    return ok(res, order);
}


export async function myOrders(req, res) {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return ok(res, orders);
}
