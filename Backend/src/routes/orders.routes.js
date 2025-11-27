// Backend/routes/orders.routes.js
import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import {
    checkout,
    myOrders,
    cancelOrder,
} from '../controllers/orders.controller.js';

const router = Router();

// Crear orden desde el checkout
router.post('/checkout', auth, checkout);

// Listar pedidos del usuario autenticado
router.get('/mine', auth, myOrders);

// Cancelar pedido del usuario autenticado
router.patch('/:id/cancel', auth, cancelOrder);

// Healthcheck opcional
router.get('/health', (req, res) => {
    res.json({ ok: true, where: 'orders' });
});

export default router;
