import { Router } from "express";
import {
    createTransaction,
    commitTransaction,
} from "../controllers/payments.controller.js";

const router = Router();

// Crear transacción Webpay (sandbox)
router.post("/create-transaction", createTransaction);

// Confirmar/commit después del pago
router.post("/commit", commitTransaction);
router.get("/commit", commitTransaction);  

export default router;
