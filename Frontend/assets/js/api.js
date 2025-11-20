const API_URL = "http://localhost:3000/api";

async function apiPost(path, data) {
    const res = await fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    });

    if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error API: " + res.status);
    }
    return res.json();
}

function getAuthToken() {
    return localStorage.getItem("ecomarket_token");
}

async function apiAuthPost(path, data) {
    const token = getAuthToken();
    const res = await fetch(API_URL + path, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    });

    if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error API: " + res.status);
    }
    return res.json();
}

window.apiPost = apiPost;
window.apiAuthPost = apiAuthPost;
window.getAuthToken = getAuthToken;
