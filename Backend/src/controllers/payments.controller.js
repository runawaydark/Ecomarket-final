import pkg from "transbank-sdk";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

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

// URLs base
const BACKEND_BASE_URL =
    process.env.BACKEND_BASE_URL || "http://localhost:3000";

const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL || "http://localhost:5500/Frontend";


// POST /api/payments/create-transaction
export const createTransaction = async (req, res) => {
    try {
    let { buyOrder, sessionId, amount } = req.body;

    // Validaciones básicas
    if (!buyOrder || !sessionId || amount == null) {
        return res
        .status(400)
        .json({ message: 'Faltan datos para crear la transacción Webpay' });
    }

    // Aseguramos tipos y formato que le gustan a Webpay
    buyOrder = String(buyOrder).slice(0, 26); // máx 26 chars
    sessionId = String(sessionId).slice(0, 61); // máx 61 chars
    amount = Math.round(Number(amount));

    if (!Number.isFinite(amount) || amount <= 0) {
        return res
        .status(400)
        .json({ message: 'Monto inválido para transacción Webpay' });
    }

    console.log('Creando transacción Webpay con:', {
        buyOrder,
        sessionId,
        amount,
        returnUrl: `${BACKEND_BASE_URL}/api/payments/commit`,
    });

    // Creamos transacción con las opciones de integración (sandbox)
    const tx = new WebpayPlus.Transaction(webpayOptions);

    const response = await tx.create(
        buyOrder,
        sessionId,
        amount,
        `${BACKEND_BASE_URL}/api/payments/commit`
    );

    // Respuesta esperada: { token, url }
    console.log('Transacción Webpay creada OK:', response);
    return res.json(response);
    } catch (error) {
    // Log bien verboso para ver qué está devolviendo Webpay
    console.error(
        'Error creando transacción Webpay:',
        error.response?.data || error.message || error
    );

    return res.status(500).json({
        message: 'Error creando transacción Webpay',
        detail: error.response?.data || error.message || String(error),
    });
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
            // Pago OK → actualizar orden y carrito
            const orderId = result.buy_order; // lo enviamos como buyOrder al crear la transacción

            try {
                const order = await Order.findById(orderId);

                if (order) {
                    order.status = 'PAID';
                    order.paymentRef = result.authorization_code || token;
                    await order.save();

                    // Buscar carrito activo del usuario y marcarlo como CHECKED_OUT + vacío
                    const cart = await Cart.findOne({ user: order.user, status: 'ACTIVE' });
                    if (cart) {
                        cart.status = 'CHECKED_OUT';
                        cart.items = [];
                        await cart.save();
                    }
                } else {
                    console.warn('⚠️ Orden no encontrada para buyOrder:', orderId);
                }
            } catch (e) {
                console.error('Error actualizando orden/carrito después del pago:', e);
            }

            // Redirigir al frontend a la página de éxito
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

