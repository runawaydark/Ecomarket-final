import { Router } from 'express';
import auth from '../middlewares/auth.middleware.js';
import * as admin from '../controllers/admin.controller.js';

const router = Router();

// Todas protegidas para admin
router.get('/stats', auth.requireAdmin, admin.getStats);

router.get('/orders', auth.requireAdmin, admin.listOrders);
router.patch('/orders/:id/status', auth.requireAdmin, admin.updateOrderStatus);

router.get('/users', auth.requireAdmin, admin.listUsers);
router.patch('/users/:id/role', auth.requireAdmin, admin.updateUserRole);

router.patch('/products/:id/toggle', auth.requireAdmin, admin.toggleProductActive);

export default router;
