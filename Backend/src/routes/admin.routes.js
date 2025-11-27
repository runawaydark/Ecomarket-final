import { Router } from 'express';
import { auth as requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import * as admin from '../controllers/admin.controller.js';

const router = Router();

// Todas protegidas: primero autenticar, luego verificar rol admin
router.get('/stats', requireAuth, requireAdmin, admin.getStats);
router.get('/orders', requireAuth, requireAdmin, admin.listOrders);
router.put('/orders/:id/status', requireAuth, requireAdmin, admin.updateOrderStatus);
router.get('/users', requireAuth, requireAdmin, admin.listUsers);
router.put('/users/:id/role', requireAuth, requireAdmin, admin.updateUserRole);
router.put('/products/:id/toggle', requireAuth, requireAdmin, admin.toggleProductActive);

export default router;
