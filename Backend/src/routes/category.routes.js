import { Router } from 'express';
import Category from '../models/category.js';
const router = Router();

// Crear
router.post('/', async (req, res) => {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
});

// Listar
router.get('/', async (_req, res) => {
    const list = await Category.find().lean();
    res.json(list);
});

export default router;
