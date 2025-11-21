// Por ahora, backend local
const API_URL = "http://localhost:3000/api";

async function apiPost(path, data) {
    const res = await fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    });

    if (!res.ok) {
    // Intentamos leer mensaje del backend
    let errorMsg = `Error API: ${res.status}`;
    try {
        const body = await res.json();
        console.log("Error backend:", body);  // 👈 para verlo en consola

      // intenta distintos formatos de error
        if (typeof body.message === "string") {
        errorMsg = body.message;
        } else if (typeof body.error === "string") {
        errorMsg = body.error;
        } else if (Array.isArray(body.errors) && body.errors.length > 0) {
        // típico de express-validator
        errorMsg = body.errors[0].msg || JSON.stringify(body.errors[0]);
        } else {
        errorMsg = JSON.stringify(body);
        }
    } catch (_) {
      // si no es JSON, dejamos el mensaje por defecto
    }

    throw new Error(errorMsg);
    }

    return res.json();
}

function getAuthToken() {
    return localStorage.getItem("ecomarket_token");
}

window.apiPost = apiPost;
window.getAuthToken = getAuthToken;

