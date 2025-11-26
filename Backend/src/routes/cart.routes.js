import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middlewares/auth.middleware.js';
import { getMyCart, addToCart, updateCartItem, clearCart } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', auth, getMyCart);

router.post(
    '/add',
    auth,
    body('productId').notEmpty(),
    body('quantity').optional().isInt({ gt: 0 }),
    addToCart
);

router.put(
    '/item',
    auth,
    body('productId').notEmpty(),
    body('quantity').isInt(),
    updateCartItem
);

router.delete('/clear', auth, clearCart);

export default router;
