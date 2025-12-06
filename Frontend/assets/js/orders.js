function notify(message, type = 'info', duration = 4000) {
    if (typeof showNotification === 'function') {
    showNotification(message, type, duration);
    } else if (typeof showToast === 'function') {
    showToast(message, type, duration);
    } else {
    console.log(`[${type}] ${message}`);
    }
}

function formatCurrency(clp) {
    return `$${(clp || 0).toLocaleString('es-CL')}`;
}

function formatDate(dateStr) {
    try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    } catch {
    return dateStr || '';
    }
}

function buildOrderCard(order) {
    const totalProducts =
    Array.isArray(order.items) &&
    order.items.reduce((acc, it) => acc + (it.quantity || 0), 0);

    const totalAmount = order.total || 0;

    const status = (order.status || '').toUpperCase();
    let statusLabel = 'Pendiente';
    let statusClass = 'status-pending';

    if (status === 'PAID') {
    statusLabel = 'Confirmado';
    statusClass = 'status-success';
    } else if (status === 'CANCELED') {
    statusLabel = 'Cancelado';
    statusClass = 'status-canceled';
    } 

    const orderId =
    order.paymentRef || order._id || order.id || 'SIN-CÓDIGO';

    return `
    <div class="order-card" data-order-id="${order._id}">
        <div class="order-card-header">
        <div>
            <strong>Pedido #${orderId}</strong><br>
            <small>${formatDate(order.createdAt)}</small>
        </div>
        <span class="order-status-badge ${statusClass}">
            ${statusLabel}
        </span>
        </div>

        <div class="order-card-body">
        <p><strong>${totalProducts}</strong> productos</p>
        <p><strong>Total:</strong> ${formatCurrency(totalAmount)}</p>
        <p><strong>Método de pago:</strong> Tarjeta de Crédito</p>
        <p><strong>Dirección:</strong> ${order.shippingAddress || 'Dirección no informada'}</p>
        </div>

        <div class="order-card-actions">
        <button class="btn btn-outline-primary btn-order-details">
            Ver detalles
        </button>
        <button class="btn btn-outline-danger btn-cancel-order"
                ${status === 'CANCELED' ? 'disabled' : ''}>
            Cancelar pedido
        </button>
        </div>
    </div>
    `;
}

async function loadOrders() {
    const container = document.getElementById('orders-list');
    const emptyMsg = document.getElementById('orders-empty-message');

    if (!container) {
    console.warn(
        'No se encontró contenedor #orders-list en pedidos.html'
    );
    return;
    }

    container.innerHTML = '<p>Cargando tus pedidos...</p>';
    if (emptyMsg) emptyMsg.style.display = 'none';

    try {
    const resp = await apiGet('/orders/mine');
    const orders = resp.data || resp;

    if (!Array.isArray(orders) || orders.length === 0) {
        container.innerHTML = '';
        if (emptyMsg) {
        emptyMsg.style.display = 'block';
        } else {
        container.innerHTML =
            '<p>No tienes pedidos registrados todavía.</p>';
        }
        return;
    }

    // Renderizar tarjetas
    container.innerHTML = orders.map(buildOrderCard).join('');
    } catch (err) {
    console.error('Error cargando pedidos:', err);
    container.innerHTML =
        '<p>Ocurrió un error al cargar tus pedidos. Intenta nuevamente.</p>';
        notify(
        'No se pudieron cargar tus pedidos. Por favor intenta nuevamente.',
        'error'
        );
    }
}

async function handleCancel(orderId, cardEl, btnEl) {
    if (!orderId) return;
    if (!confirm('¿Seguro que quieres cancelar este pedido?')) return;

    try {
    const resp = await apiPatch(`/orders/${orderId}/cancel`, {});
    const updated = resp.data || resp;

    const statusBadge = cardEl.querySelector('.order-status-badge');
    if (statusBadge) {
        statusBadge.textContent = 'Cancelado';
        statusBadge.classList.remove('status-success', 'status-pending');
        statusBadge.classList.add('status-canceled');
    }

    btnEl.disabled = true;

    notify('Pedido cancelado exitosamente', 'success');
    } catch (err) {
    console.error('Error cancelando pedido:', err);
    notify('No se pudo cancelar el pedido. Intenta nuevamente.', 'error');
    }
}

    document.addEventListener('DOMContentLoaded', () => {
    // Si tienes funciones para el navbar
    try {
    if (typeof updateNavbar === 'function') {
        updateNavbar();
    } else if (typeof updateUserDropdown === 'function') {
        updateUserDropdown();
    }
    } catch (e) {
    console.warn('No se pudo actualizar navbar en pedidos:', e);
    }

    // Verificar sesión
    const token =
    typeof getAuthToken === 'function' ? getAuthToken() : null;
    if (!token) {
    notify('Debes iniciar sesión para ver tus pedidos.', 'warning');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2500);
    return;
    }

    // Cargar pedidos
    loadOrders();

  // Delegar clicks para cancelar
    const container = document.getElementById('orders-list') || document;
    container.addEventListener('click', (e) => {
    const cancelBtn = e.target.closest('.btn-cancel-order');
    if (!cancelBtn) return;

    const cardEl = cancelBtn.closest('.order-card');
    if (!cardEl) return;

    const orderId = cardEl.dataset.orderId;
    handleCancel(orderId, cardEl, cancelBtn);
    });
});
