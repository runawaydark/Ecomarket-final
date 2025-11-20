document.addEventListener("DOMContentLoaded", async () => {
  // 1. Verificar que el usuario esté logueado
    const token = getAuthToken && getAuthToken();
    if (!token) {
    alert("Debes iniciar sesión para continuar con el pago.");
    window.location.href = "login.html";
    return;
    }

  // 2. Obtener carrito del localStorage
    const cart = JSON.parse(localStorage.getItem("ecomarket_cart")) || [];
    if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    window.location.href = "catalogo.html";
    return;
    }

  // 3. Obtener productos desde el backend o catálogo
    let products = [];
    try {
    if (typeof getProducts === "function") {
        products = getProducts();
    } else {
        products = await apiGet("/products");
    }
    } catch (error) {
    console.error(error);
    alert("Error cargando productos.");
    return;
    }

  // 4. Renderizar resumen
    const resumen = document.getElementById("checkout-resumen");
    const totalElement = document.getElementById("checkout-total");

    let total = 0;
    resumen.innerHTML = "";

    cart.forEach(item => {
        const product =
            products.find(p => p.id === item.productId || p._id === item.productId);

    if (!product) return;

    const price = product.price;
    const lineTotal = price * item.quantity;

    total += lineTotal;

    const row = document.createElement("div");
    row.className = "checkout-item d-flex justify-content-between mb-2";
    row.innerHTML = `
        <div>
        <strong>${product.name}</strong>
        <div class="text-muted">${item.quantity} x $${price.toLocaleString()}</div>
        </div>
        <div>$${lineTotal.toLocaleString()}</div>
    `;
    resumen.appendChild(row);
    });

    totalElement.textContent = `$${total.toLocaleString()}`;

  // 5. Manejar envío del formulario
    const form = document.getElementById("checkout-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const paymentMethod = form.paymentMethod.value;

    if (!name || !email || !address) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
    }

    // Crear orden temporal
    const buyOrder = "order-" + Date.now();
    const sessionId = "session-" + Date.now();

    // 6. Crear transacción Webpay en el backend
    try {
        const payment = await apiAuthPost("/payments/create-transaction", {
        buyOrder,
        sessionId,
        amount: total
        });

      // payment = { token, url }
      // Enviar automáticamente formulario a Webpay
        const webpayForm = document.createElement("form");
        webpayForm.method = "POST";
        webpayForm.action = payment.url;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = payment.token;

        webpayForm.appendChild(input);
        document.body.appendChild(webpayForm);
        webpayForm.submit();

    } catch (err) {
        console.error(err);
        alert("Error iniciando pago vía Webpay");
    }
    });
});
