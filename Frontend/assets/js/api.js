// SI el backend lo corres en tu computador:
const API_URL = 'http://localhost:3000/api';
// Más adelante, si despliegas el backend, algo como:
// const API_URL = 'https://tu-backend.onrender.com/api';

async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) {
    throw new Error(`Error API: ${res.status}`);
    }
    return res.json();
}

async function apiPost(path, data) {
    const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    });

    if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error API: ${res.status}`);
    }

    return res.json();
}

window.apiGet = apiGet;
window.apiPost = apiPost;
