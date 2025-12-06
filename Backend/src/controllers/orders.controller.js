import Order from '../models/order.js';
import Cart from '../models/cart.js';
import { badRequest, ok } from '../utils/http.js';
import Product from '../models/product.js';

export async function checkout(req, res) {
    //Intentar usar carrito en Mongo
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
        // Fallback usar items enviados por el frontend
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

// Calcular total
const total = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);

// Tomar datos de envío que vengan en el body (opcionales)
const { shipping } = req.body;

const delivery = shipping
    ? {
        name: shipping.name || '',
        phone: shipping.phone || '',
        address: shipping.address || '',
        city: shipping.city || '',
        postal: shipping.postal || '',
        reference: shipping.reference || ''
    }
    : undefined;

// Crear orden con estado por defecto 'CREATED'
const order = await Order.create({
    user: req.user.id,
    items,
    total,
    delivery 
});
return ok(res, order);

}


export async function myOrders(req, res) {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return ok(res, orders);
}

export async function cancelOrder(req, res) {
    try {
    const { id } = req.params;

    if (!id) {
        return badRequest(res, 'Falta el id del pedido');
    }

    // Buscamos el pedido del usuario autenticado
    const order = await Order.findOne({ _id: id, user: req.user.id });

    if (!order) {
        return badRequest(res, 'Pedido no encontrado');
    }

    // Si ya está cancelado, devolvemos tal cual
    if (order.status === 'CANCELED') {
        return ok(res, order);
    }

    order.status = 'CANCELED';
    await order.save();

    return ok(res, order);
    } catch (err) {
    console.error('Error al cancelar pedido:', err);
    return badRequest(res, 'No se pudo cancelar el pedido');
    }
}

