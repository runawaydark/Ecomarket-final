import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { badRequest, ok } from '../utils/http.js';

async function getOrCreateActiveCart(userId) {
    let cart = await Cart.findOne({ user: userId, status: 'ACTIVE' }).populate('items.product', 'name price imageUrl');
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    return cart;
}

export async function getMyCart(req, res) {
    const cart = await getOrCreateActiveCart(req.user.id);
    return ok(res, cart);
}

export async function addToCart(req, res) {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return badRequest(res, 'Producto no existe');

    const cart = await getOrCreateActiveCart(req.user.id);

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx >= 0) {
    cart.items[idx].quantity += Number(quantity);
    } else {
    cart.items.push({ product: product._id, quantity: Number(quantity), unitPrice: product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name price imageUrl');
    return ok(res, cart);
}   

export async function updateCartItem(req, res) {
    const { productId, quantity } = req.body;
    const cart = await getOrCreateActiveCart(req.user.id);
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx < 0) return badRequest(res, 'Item no existe en carrito');
    if (Number(quantity) <= 0) {
    cart.items.splice(idx, 1);
    } else {
    cart.items[idx].quantity = Number(quantity);
    }
    await cart.save();
    await cart.populate('items.product', 'name price imageUrl');
    return ok(res, cart);
}

export async function clearCart(req, res) {
    const cart = await getOrCreateActiveCart(req.user.id);
    cart.items = [];
    await cart.save();
    return ok(res, true);
}
