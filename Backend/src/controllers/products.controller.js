import { validationResult } from 'express-validator';
import Product from '../models/product.js';
import Category from '../models/category.js';
import { badRequest, notFound, ok, created } from '../utils/http.js';

export async function listProducts(req, res) {
    const { q = '', category, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;

  const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
    Product.find(filter).populate('category', 'name').skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
    ]);
    return ok(res, { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
}

export async function getProduct(req, res) {
    const p = await Product.findById(req.params.id).populate('category', 'name');
    if (!p) return notFound(res, 'Producto no encontrado');
    return ok(res, p);
}

export async function createProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return badRequest(res, errors.array());
    const { name, description, price, imageUrl, category, stock } = req.body;

    const cat = await Category.findById(category);
    if (!cat) return badRequest(res, 'Categoría inválida');

    const p = await Product.create({ name, description, price, imageUrl, category, stock });
    return created(res, p);
}

export async function updateProduct(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return badRequest(res, errors.array());

    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return notFound(res, 'Producto no encontrado');
    return ok(res, p);
}

export async function removeProduct(req, res) {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return notFound(res, 'Producto no encontrado');
    return ok(res, true);
}

export const list = async (req, res) => {
    const { category, q, min, max } = req.query;
    const filter = {};

    if (category) filter.category = category; // id de category
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (min || max) filter.price = {
    ...(min ? { $gte: Number(min) } : {}),
    ...(max ? { $lte: Number(max) } : {})
    };

    const products = await Product.find(filter).populate('category', 'name slug');
    res.json(products);
};
