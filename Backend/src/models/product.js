import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    unit: { type: String, default: "unidad" },
    stock: { type: Number, default: 0 },
    maxStock: { type: Number, default: 100 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    imageUrl: { type: String, default: "" },
    isOffer: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    rating: { type: Number, default: 4.0 },
    reviews: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    },
    { timestamps: true }
);


const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
