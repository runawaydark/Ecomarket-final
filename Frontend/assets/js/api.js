// ==========================
// CONFIGURACIÓN DEL BACKEND
// ==========================
// ==========================
// CONFIGURACIÓN DEL BACKEND
// ==========================

const API_BASE_URL = "http://localhost:3000/api";

// ==========================
// MÉTODO GET UNIVERSAL
// ==========================

async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Error GET ${endpoint}: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en apiGet:", error);
        throw error;
    }
}

// ==========================
// MÉTODO POST UNIVERSAL
// ==========================

async function apiPost(endpoint, data) {
    try {
        console.log(`📤 POST ${endpoint}:`, data);
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        console.log(`📥 Response status:`, res.status);

        if (!res.ok) {
            let errorMsg = `Error API: ${res.status}`;
            try {
                const body = await res.json();
                console.log('Error body:', body);
                if (body.message) errorMsg = body.message;
            } catch (_) {}
            throw new Error(errorMsg);
        }

        const responseData = await res.json();
        console.log(`✅ Response data:`, responseData);
        return responseData;
    } catch (error) {
        console.error("❌ Error en apiPost:", error);
        throw error;
    }
}

// ==========================
// MÉTODO PUT UNIVERSAL
// ==========================

async function apiPut(endpoint, data) {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            let errorMsg = `Error API: ${res.status}`;
            try {
                const body = await res.json();
                if (body.message) errorMsg = body.message;
            } catch (_) {}
            throw new Error(errorMsg);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en apiPut:", error);
        throw error;
    }
}

// ==========================
// MÉTODO DELETE UNIVERSAL
// ==========================

async function apiDelete(endpoint) {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            let errorMsg = `Error API: ${res.status}`;
            try {
                const body = await res.json();
                if (body.message) errorMsg = body.message;
            } catch (_) {}
            throw new Error(errorMsg);
        }

        return await res.json();
    } catch (error) {
        console.error("Error en apiDelete:", error);
        throw error;
    }
}

// ==========================
// TOKEN DE AUTH
// ==========================

function getAuthToken() {
    return localStorage.getItem("ecomarket_token");
}

// Exponer funciones globales
window.apiGet = apiGet;
window.apiPost = apiPost;
window.apiPut = apiPut;
window.apiDelete = apiDelete;
window.getAuthToken = getAuthToken;
