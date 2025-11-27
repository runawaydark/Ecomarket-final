// ==========================
// CONFIGURACIÓN DEL BACKEND
// ==========================

const API_BASE_URL = "http://localhost:3000/api";

        // ==========================
        // MÉTODO GET UNIVERSAL
        // ==========================

        async function apiGet(endpoint) {
            try {
                const token = getAuthToken && getAuthToken();
                const headers = {};
            
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
            
                const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
            
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
            
                const token = getAuthToken && getAuthToken();
                const headers = { "Content-Type": "application/json" };
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
            
                const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers,
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
                const token = getAuthToken && getAuthToken();
                const headers = { "Content-Type": "application/json" };
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
            
                const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "PUT",
                    headers,
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



        
        async function apiDelete(endpoint) {
            try {
                const token = getAuthToken && getAuthToken();
                const headers = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }
            
                const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: "DELETE",
                    headers,
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

// ==========================
// MÉTODO PATCH (sin apiRequest)
// ==========================
async function apiPatch(endpoint, data = {}) {
    try {
        console.log(`📤 PATCH ${endpoint}:`, data);

        const token = (typeof getAuthToken === 'function') ? getAuthToken() : null;

        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(data)
        });

        console.log("📥 Response status:", res.status);

        if (!res.ok) {
            let msg = `Error API: ${res.status}`;
            try {
                const body = await res.json();
                console.log("Error body:", body);
                if (body.message) msg = body.message;
            } catch (_) {}
            throw new Error(msg);
        }

        const responseData = await res.json();
        console.log("✅ Response data:", responseData);
        return responseData;
    } catch (error) {
        console.error("❌ Error en apiPatch:", error);
        throw error;
    }
}


// Exponer funciones globales
window.apiGet = apiGet;
window.apiPost = apiPost;
window.apiPut = apiPut;
window.apiDelete = apiDelete;
window.apiPatch = apiPatch;
window.getAuthToken = getAuthToken;
