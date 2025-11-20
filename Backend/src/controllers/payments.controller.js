import pkg from "transbank-sdk";

// Desestructuramos todo desde el default (porque el paquete es CommonJS)
const {
    WebpayPlus,
    Options,
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Environment,
} = pkg;

// Configuración sandbox (integración)
const webpayOptions = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,  // código de comercio de integración
  IntegrationApiKeys.WEBPAY,             // api key de integración
  Environment.Integration                // ambiente sandbox
);

// URLs base (puedes moverlas a .env si quieres)
const BACKEND_BASE_URL =
    process.env.BACKEND_BASE_URL || "http://localhost:3000";
const FRONTEND_BASE_URL =
    process.env.FRONTEND_BASE_URL || "https://ecomarket-five.vercel.app/index.html"; // o la URL de Vercel después


// POST /api/payments/create-transaction
export const createTransaction = async (req, res) => {
    try {
    const { buyOrder, sessionId, amount } = req.body;

    // Creamos transacción con las opciones de integración
    const tx = new WebpayPlus.Transaction(webpayOptions);

    const response = await tx.create(
        buyOrder,
        sessionId,
        amount,
        `${BACKEND_BASE_URL}/api/payments/commit`
    );

    // { token, url }
    return res.json(response);
    } catch (error) {
    console.error(
        "Error creando transacción Webpay:",
        error.response?.data || error.message
    );
    return res
        .status(500)
        .json({ message: "Error creando transacción Webpay" });
    }
};


// POST /api/payments/commit  (return_url)
export const commitTransaction = async (req, res) => {
    try {
    const token = req.body.token_ws || req.query.token_ws;

    const tx = new WebpayPlus.Transaction(webpayOptions);
    const result = await tx.commit(token);

    console.log("Resultado Webpay:", result);

    if (result.response_code === 0) {
      // Pago OK
        return res.redirect(`${FRONTEND_BASE_URL}/checkout-success.html`);
    } else {
      // Pago rechazado
        return res.redirect(`${FRONTEND_BASE_URL}/checkout-error.html`);
    }
    } catch (error) {
    console.error(
        "Error en commit Webpay:",
        error.response?.data || error.message
    );
    return res.redirect(`${FRONTEND_BASE_URL}/checkout-error.html`);
    }
};
