import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getMyCart, addToCart, updateCartItem, clearCart } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', requireAuth, getMyCart);

router.post(
    '/add',
    requireAuth,
    body('productId').notEmpty(),
    body('quantity').optional().isInt({ gt: 0 }),
    addToCart
);

router.put(
    '/item',
    requireAuth,
    body('productId').notEmpty(),
    body('quantity').isInt(),
    updateCartItem
);

router.delete('/clear', requireAuth, clearCart);

export default router;
