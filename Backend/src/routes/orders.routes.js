import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { checkout, myOrders } from '../controllers/orders.controller.js';

const router = Router();

// Todas las rutas de órdenes requieren usuario autenticado
router.post('/checkout', auth, checkout);
router.get('/mine', auth, myOrders);

router.get('/health', (req, res) => {
    res.json({ ok: true, where: 'orders' });
});

export default router;
