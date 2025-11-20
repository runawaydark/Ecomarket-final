import Category from '../models/category.js';
import Product from '../models/product.js';

export const list = async (req, res) => {
    const { q } = req.query;
    const filter = q ? { name: { $regex: q, $options: 'i' } } : {};
    const cats = await Category.find(filter).sort({ name: 1 });
    res.json(cats);
};

export const getById = async (req, res) => {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(cat);
};

export const create = async (req, res) => {
    const { name, slug, description } = req.body;
    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) return res.status(409).json({ message: 'name o slug ya existe' });

    const cat = await Category.create({ name, slug, description });
    res.status(201).json(cat);
};

export const update = async (req, res) => {
    const { id } = req.params;
    const cat = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(cat);
};

export const remove = async (req, res) => {
    const { id } = req.params;

  // no permitir borrar si hay productos usando la categoría
    const count = await Product.countDocuments({ category: id });
    if (count > 0) {
    return res.status(400).json({ message: 'No se puede eliminar: hay productos asociados' });
    }

    const cat = await Category.findByIdAndDelete(id);
    if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ ok: true });
};
