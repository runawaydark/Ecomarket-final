import { WebpayPlus } from "transbank-sdk";

// Esto configura SANDBOX automáticamente
WebpayPlus.configureForTesting();

// FRONT y BACK para los redirect (ajusta cuando subas a producción)
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:3000";
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "https://ecomarket-five.vercel.app/index.html"; 
// o la URL de Vercel cuando la tengas

// POST /api/payments/create-transaction
export const createTransaction = async (req, res) => {
    try {
        const { buyOrder, sessionId, amount } = req.body;

    const tx = new WebpayPlus.Transaction();
    const response = await tx.create(
        buyOrder,
        sessionId,
        amount,
        `${BACKEND_BASE_URL}/api/payments/commit`
    );

    // response = { token, url }
    return res.json(response);
        } catch (error) {
    console.error("Error creando transacción Webpay:", error);
    return res
        .status(500)
        .json({ message: "Error creando transacción Webpay" });
    }
};

// POST /api/payments/commit  (return_url)
export const commitTransaction = async (req, res) => {
    try {
        const token = req.body.token_ws || req.query.token_ws;

    const tx = new WebpayPlus.Transaction();
    const result = await tx.commit(token);

    console.log("Resultado Webpay:", result);

    // Aquí podrías actualizar tu Order en Mongo:
    // - result.buy_order
    // - result.amount
    // - result.response_code (0 = OK)

    if (result.response_code === 0) {
      // Pago OK
        return res.redirect(`${FRONTEND_BASE_URL}/checkout-success.html`);
    } else {
      // Pago rechazado
        return res.redirect(`${FRONTEND_BASE_URL}/checkout-error.html`);
    }
    } catch (error) {
    console.error("Error en commit Webpay:", error);
    return res.redirect(`${FRONTEND_BASE_URL}/checkout-error.html`);
    }
};
