import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { checkout, myOrders } from '../controllers/orders.controller.js';

const router = Router();

router.post('/checkout', requireAuth, checkout);
router.get('/mine', requireAuth, myOrders);
router.get('/health', (req, res) => {
    res.json({ ok: true, where: 'orders' });
});


export default router;
