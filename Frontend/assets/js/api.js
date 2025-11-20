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
        if (body.message) errorMsg = body.message;
    } catch (_) {}
    throw new Error(errorMsg);
    }

  return res.json(); // aquí debería venir { token, user, ... }
}

function getAuthToken() {
    return localStorage.getItem("ecomarket_token");
}

window.apiPost = apiPost;
window.getAuthToken = getAuthToken;
