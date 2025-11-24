import { Router } from "express";
import Product from "../models/product.js";

const router = Router();

// Mapa nombre de categoría → ID de Mongo (los que viste en Compass)
const CATEGORY_NAME_TO_ID = {
    frutas: "6920d5ab3805202c3b36be72",   
    verduras: "6920d5ab3805202c3b36be73", 
    despensa: "6920ff235965d54c277ed825"
};

// Convierte lo que llega del front (nombre o id) al ObjectId correcto
function resolveCategoryId(rawValue) {
    if (!rawValue) return undefined;

    const value = rawValue.toString().trim();

  // Si ya viene con formato de ObjectId (24 caracteres hex), lo usamos tal cual
    if (/^[0-9a-fA-F]{24}$/.test(value)) {
    return value;
    }

  // Si viene como "Frutas", "Verduras", etc.
    const key = value.toLowerCase();
    return CATEGORY_NAME_TO_ID[key];
}

// =======================
// GET /api/products
// =======================
router.get("/", async (req, res) => {
    try {
    const products = await Product.find();
    res.json(products);
    } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error del servidor" });
    }
});

// =======================
// GET /api/products/:id
// =======================
router.get("/:id", async (req, res) => {
    try {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
    } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error del servidor" });
    }
});

// =======================
// POST /api/products  → crear
// =======================
router.post("/", async (req, res) => {
    try {
    console.log("POST /api/products body:", req.body);

    const {
        name,
        description,
        price,
        originalPrice,
        unit,
        stock,
        maxStock,
        imageUrl,
        rating,
        reviews,
        isNew,
        isOffer,     
        active,
        category,    
    } = req.body;

    const categoryId = resolveCategoryId(category);

    const product = new Product({
        name,
        description,
        price,
        originalPrice,
        unit,
        stock,
        maxStock,
        imageUrl,
        rating,
        reviews,
        isNew: !!isNew,
        isOffer:
        typeof isOffer === "boolean"
            ? isOffer
            : originalPrice && originalPrice > price,
        active,
        category: categoryId,
    });

    await product.save();
    res.status(201).json(product);
    } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error del servidor" });
    }
});

// =======================
// PUT /api/products/:id  → actualizar
// =======================
router.put("/:id", async (req, res) => {
    try {
    console.log("PUT /api/products/:id body:", req.body);

    const {
        name,
        description,
        price,
        originalPrice,
        unit,
        stock,
        maxStock,
        imageUrl,
        rating,
        reviews,
        isNew,
        isOffer,
        active,
        category,
    } = req.body;

    const categoryId = resolveCategoryId(category);

    const data = {
        name,
        description,
        price,
        originalPrice,
        unit,
        stock,
        maxStock,
        imageUrl,
        rating,
        reviews,
        isNew: !!isNew,
        isOffer:
        typeof isOffer === "boolean"
            ? isOffer
            : originalPrice && originalPrice > price,
        active,
    };

    if (categoryId) {
        data.category = categoryId;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
        new: true,
    });

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
    } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error del servidor" });
    }
});

// =======================
// DELETE /api/products/:id  → eliminar
// =======================
router.delete("/:id", async (req, res) => {
    try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
    } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error del servidor" });
    }
});

export default router;
