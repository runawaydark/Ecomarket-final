/*  ============================================
    ECOMARKET - ARCHIVO PRINCIPAL DE JAVASCRIPT
    =============================================

    TABLA DE CONTENIDO:
    1. SISTEMA DE NOTIFICACIONES
    2. SISTEMA DE CONFIRMACIONES
    3. GESTIÓN DEL CARRITO
    4. SISTEMA DE AUTENTICACIÓN
    5. NAVEGACIÓN Y UI
    6. FOOTER Y COMPONENTES
    7. EVENTOS DEL DOCUMENTO

   ============================================= */

// =============================================
// 1. SISTEMA DE NOTIFICACIONES
// =============================================

/**
 * Muestra notificaciones elegantes en la esquina superior derecha
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, warning, info)
 * @param {number} duration - Duración en milisegundos
 */
function showNotification(message, type = 'info', duration = 4000) {
    // Crear el contenedor de notificaciones si no existe
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 350px;
        `;
        document.body.appendChild(container);
    }

    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible notification-slide`;
    notification.style.cssText = `
        margin-bottom: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        border: none;
        border-radius: 8px;
        transform: translateX(100%);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 
                            type === 'error' ? 'exclamation-triangle-fill' : 
                            type === 'warning' ? 'exclamation-triangle-fill' : 'info-circle-fill'}"></i>
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
        <div class="notification-progress" style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255,255,255,0.3);
            width: 100%;
            animation: progressBar ${duration}ms linear;
        "></div>
    `;

    container.appendChild(notification);

    // Agregar estilos de animación si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes progressBar {
                from { width: 100%; }
                to { width: 0%; }
            }
            .notification-slide {
                animation: slideInRight 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto eliminar después del tiempo especificado
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// =============================================
// 2. SISTEMA DE CONFIRMACIONES
// =============================================

/**
 * Muestra un modal de confirmación con botones de aceptar y cancelar
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje del modal
 * @param {function} onConfirm - Función a ejecutar si el usuario confirma
 * @param {function} onCancel - Función a ejecutar si el usuario cancela
 */
function showConfirmation(title, message, onConfirm, onCancel = null) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Crear modal de confirmación
    const modal = document.createElement('div');
    modal.className = 'card';
    modal.style.cssText = `
        max-width: 400px;
        margin: 20px;
        transform: scale(0.8);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;

    modal.innerHTML = `
        <div class="card-body text-center">
            <div class="mb-3">
                <i class="bi bi-question-circle-fill text-warning" style="font-size: 3rem;"></i>
            </div>
            <h5 class="card-title">${title}</h5>
            <p class="card-text text-muted">${message}</p>
            <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-outline-secondary" id="cancelBtn">Cancelar</button>
                <button class="btn btn-danger" id="confirmBtn">Aceptar</button>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);

    // Función para cerrar modal
    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 300);
    }

    // Event listeners
    modal.querySelector('#confirmBtn').addEventListener('click', () => {
        closeModal();
        if (onConfirm) onConfirm();
    });

    modal.querySelector('#cancelBtn').addEventListener('click', () => {
        closeModal();
        if (onCancel) onCancel();
    });

    // Cerrar con Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            if (onCancel) onCancel();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// =============================================
// 3. GESTIÓN DEL CARRITO
// =============================================

/**
 * Actualiza el contador del carrito en todas las páginas
 * Lee el localStorage y muestra el número total de productos
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('ecomarket_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

// Escuchar eventos de actualización del carrito
window.addEventListener('cartUpdated', function(event) {
    updateCartCount();
});

// Inicializar contador al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// =============================================
// 4. SISTEMA DE AUTENTICACIÓN
// =============================================

/**
 * Verifica el estado de autenticación del usuario
 * @returns {Object} Objeto con información del usuario logueado
 */
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('ecomarket_logged_in') === 'true';
    const userType = localStorage.getItem('ecomarket_user_type');
    const userEmail = localStorage.getItem('ecomarket_user_email');
    
    return {
        isLoggedIn,
        userType,
        userEmail,
        isAdmin: userType === 'admin' || userType === 'ADMIN'
    };
}

/**
 * Cierra la sesión del usuario actual
 * Muestra confirmación antes de proceder
 */
function logout() {
    showConfirmation(
        '¿Estás seguro de que deseas cerrar sesión?',
        'Se cerrará tu sesión actual',
        function() {
            // Limpiar todos los datos de sesión
            localStorage.removeItem('ecomarket_logged_in');
            localStorage.removeItem('ecomarket_user_type');
            localStorage.removeItem('ecomarket_user_email');
            localStorage.removeItem('ecomarket_user_name');
            localStorage.removeItem('ecomarket_token');
            localStorage.removeItem('ecomarket_user');
            
            showNotification('Sesión cerrada correctamente', 'success');
            
            // Pequeño delay para mostrar la notificación antes de redirigir
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        }
    );
}

// =============================================
// 5. NAVEGACIÓN Y UI
// =============================================

/**
 * Actualiza la barra de navegación según el estado de autenticación
 * Muestra/oculta elementos según el tipo de usuario
 */
function updateNavbar() {
    const auth = checkAuthStatus();
    const navbar = document.querySelector('.navbar-nav');
    
    // Para páginas con navbar tradicional (como catálogo)
    if (navbar) {
        // Buscar si ya existe el enlace de admin
        let adminLink = navbar.querySelector('.admin-nav-item');
        let loginLink = document.querySelector('a[href="login.html"]');
        
        if (auth.isLoggedIn && auth.isAdmin) {
            // Usuario admin logueado - mostrar enlace de admin
            if (!adminLink) {
                const adminItem = document.createElement('li');
                adminItem.className = 'nav-item admin-nav-item';
                adminItem.innerHTML = `
                    <a class="nav-link" href="admin.html">
                        <i class="bi bi-gear-fill"></i> Admin
                    </a>
                `;
                navbar.appendChild(adminItem);
            }
            
            // Cambiar enlace de login por logout
            if (loginLink) {
                loginLink.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
                loginLink.href = '#';
                loginLink.title = 'Cerrar sesión';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
            }
        } else if (auth.isLoggedIn) {
            // Usuario normal logueado - solo mostrar logout
            if (adminLink) {
                adminLink.remove();
            }
            
            if (loginLink) {
                loginLink.innerHTML = '<i class="bi bi-box-arrow-right"></i>';
                loginLink.href = '#';
                loginLink.title = 'Cerrar sesión';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
            }
        } else {
            // Usuario no logueado - remover admin link y mostrar login normal
            if (adminLink) {
                adminLink.remove();
            }
            
            if (loginLink) {
                loginLink.innerHTML = '<i class="bi bi-person fs-5"></i>';
                loginLink.href = 'login.html';
                loginLink.title = 'Iniciar sesión';
                loginLink.onclick = null;
            }
        }
    }
    
    // Para páginas con dropdown (como index)
    updateUserDropdown();
}

/**
 * Actualiza el menú desplegable del usuario
 * Cambia las opciones según si está logueado y su tipo de usuario
 */
function updateUserDropdown() {
    const auth = checkAuthStatus();
    const dropdownMenu = document.getElementById('userDropdownMenu');
    
    if (!dropdownMenu) return;
    
    if (auth.isLoggedIn) {
        const userName = localStorage.getItem('ecomarket_user_name') || auth.userEmail;
        const displayName = auth.isAdmin ? 'Administrador' : userName;
        
        dropdownMenu.innerHTML = `
            <li><span class="dropdown-item-text"><strong>${displayName}</strong></span></li>
            <li><hr class="dropdown-divider"></li>
            ${auth.isAdmin ? '<li><a class="dropdown-item" href="admin.html"><i class="bi bi-gear-fill me-2"></i>Panel Admin</a></li>' : ''}
            <li><a class="dropdown-item" href="pedidos.html"><i class="bi bi-bag me-2"></i>Mis pedidos</a></li>
            <li><a class="dropdown-item" href="carrito.html"><i class="bi bi-cart me-2"></i>Ver carrito</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
        `;
    } else {
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="login.html"><i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión</a></li>
            <li><a class="dropdown-item" href="login.html"><i class="bi bi-person-plus me-2"></i>Registrarse</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="carrito.html"><i class="bi bi-cart me-2"></i>Ver carrito</a></li>
        `;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    
    // Verificar si estamos en una página que requiere autenticación
    const currentPage = window.location.pathname.split('/').pop();
    const auth = checkAuthStatus();
    
    if (currentPage === 'admin.html' && (!auth.isLoggedIn || !auth.isAdmin)) {
        showNotification('Acceso denegado. Debes iniciar sesión como administrador.', 'error', 3000);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
});

// Proteger acceso al elemento logoutBtn (puede no existir en algunas páginas)
const _logoutBtn = document.getElementById("logoutBtn");
if (_logoutBtn && _logoutBtn.classList) {
    _logoutBtn.classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
    let current = window.location.pathname.split("/").pop();
    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
        if(link.getAttribute("href") === current){
            link.classList.add("active");
        }
    });
});

// =============================================
// FUNCIONALIDADES DEL MENÚ MÓVIL
// =============================================

/**
 * Configuración del menú móvil de navegación
 * Maneja el cierre automático del menú al hacer clic en enlaces
 */
document.addEventListener("DOMContentLoaded", () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click(); // Simular clic en el botón para cerrar
            }
        });
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        const navbar = document.querySelector('.navbar');
        const isClickInsideNavbar = navbar.contains(event.target);
        
        if (!isClickInsideNavbar && navbarCollapse.classList.contains('show')) {
            navbarToggler.click(); // Simular clic en el botón para cerrar
        }
    });
});

// =============================================
// 6. FOOTER Y COMPONENTES
// =============================================

/**
 * Controla el comportamiento de acordeón del footer en móviles
 * @param {string} sectionId - ID de la sección a mostrar/ocultar
 */
function toggleAccordion(sectionId) {
    // Solo funciona en móviles (pantallas menores a 769px)
    if (window.innerWidth <= 768) {
        const content = document.getElementById(sectionId + '-content');
        const icon = document.getElementById(sectionId + '-icon');
        
        if (content.classList.contains('active')) {
            // Cerrar el acordeón
            content.classList.remove('active');
            icon.classList.remove('rotated');
        } else {
            // Abrir el acordeón
            content.classList.add('active');
            icon.classList.add('rotated');
        }
    }
}

/**
 * Maneja el cambio de tamaño de ventana para el footer responsivo
 * Abre/cierra automáticamente las secciones según el tamaño de pantalla
 */
function handleResize() {
    const accordionContents = document.querySelectorAll('.footer-accordion-content');
    const accordionIcons = document.querySelectorAll('.accordion-icon');
    
    if (window.innerWidth > 768) {
        // Desktop: mostrar todo el contenido
        accordionContents.forEach(content => {
            content.classList.remove('active');
        });
        accordionIcons.forEach(icon => {
            icon.classList.remove('rotated');
        });
    } else {
        // Móvil: cerrar todos por defecto
        accordionContents.forEach(content => {
            content.classList.remove('active');
        });
        accordionIcons.forEach(icon => {
            icon.classList.remove('rotated');
        });
    }
}

/**
 * FUNCIONES DE CARGA DEL FOOTER
 * HTML del footer almacenado directamente en JavaScript 
 * para evitar problemas con fetch() en archivos locales
 */

/**
 * Retorna el HTML completo del footer
 * @returns {string} Código HTML del footer
 */
function getFooterHTML() {
    return `<footer class="footer">
    <div class="footer-top">
        <p>¿Te queda alguna duda? Capaz que esta información te sirva ;)</p>
    </div>
    <div class="footer-content">
        <div class="footer-section">
            <h4 class="footer-accordion-header" onclick="toggleAccordion('pasillos')">
                PASILLOS <i class="bi bi-chevron-down accordion-icon" id="pasillos-icon"></i>
            </h4>
            <ul class="footer-accordion-content" id="pasillos-content">
                <li><a href="#">Frutas</a></li>
                <li><a href="#">Verduras</a></li>
                <li><a href="#">Despensa</a></li>
                <li><a href="#">Ofertas</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4 class="footer-accordion-header" onclick="toggleAccordion('paginas')">
                PÁGINAS <i class="bi bi-chevron-down accordion-icon" id="paginas-icon"></i>
            </h4>
            <ul class="footer-accordion-content" id="paginas-content">
                <li><a href="nosotros.html">Nosotros</a></li>
                <li><a href="catalogo.html">Catálogo</a></li>
                <li><a href="contacto.html">Contacto</a></li>
                <li><a href="#">Blog</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4 class="footer-accordion-header" onclick="toggleAccordion('contacto')">
                CONTACTO <i class="bi bi-chevron-down accordion-icon" id="contacto-icon"></i>
            </h4>
            <ul class="footer-accordion-content" id="contacto-content">
                <li><a href="#">WhatsApp</a></li>
                <li><a href="#">Correo</a></li>
                <li><a href="#">Instagram</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4 class="footer-accordion-header" onclick="toggleAccordion('politicas')">
                POLÍTICAS <i class="bi bi-chevron-down accordion-icon" id="politicas-icon"></i>
            </h4>
            <ul class="footer-accordion-content" id="politicas-content">
                <li><a href="#">Términos de servicio</a></li>
                <li><a href="#">Política de privacidad</a></li>
                <li><a href="#">Política de devoluciones</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-bottom">
        <p>© 2025, EcoMarket | Todos los derechos reservados</p>
    </div>
</footer>`;
}

/**
 * Carga e inserta el footer en el contenedor correspondiente
 * Busca el elemento con ID 'footer-container' e inserta el HTML
 */
function loadFooter() {
    console.log('=== INICIANDO CARGA DEL FOOTER ===');
    
    // Buscar el contenedor donde se debe cargar el footer
    const footerContainer = document.getElementById('footer-container');
    
    if (footerContainer) {
        console.log('✅ Contenedor #footer-container encontrado');
        console.log('🔄 Insertando HTML del footer...');
        
        try {
            footerContainer.innerHTML = getFooterHTML();
            console.log('✅ HTML insertado correctamente');
            
            // Verificar que se insertó
            const footer = footerContainer.querySelector('footer');
            if (footer) {
                console.log('✅ Footer element creado exitosamente');
                // Después de cargar el footer, inicializar los acordeones
                handleResize();
                console.log('✅ Footer cargado y configurado completamente');
            } else {
                console.error('❌ Error: Footer element no encontrado después de insertar HTML');
            }
        } catch (error) {
            console.error('❌ Error al insertar HTML del footer:', error);
        }
    } else {
        console.error('❌ No se encontró el contenedor #footer-container');
        console.log('🔍 Contenedores disponibles:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    }
}

// =============================================
// 7. EVENTOS DEL DOCUMENTO
// =============================================

/**
 * Inicialización principal del documento
 * Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 DOM Content Loaded - Iniciando app.js');
    
    // Cargar el footer si existe un contenedor para él
    loadFooter();
    
    // Inicializar acordeones
    handleResize();
    
    // Escuchar cambios en el tamaño de ventana
    window.addEventListener('resize', handleResize);
    
    console.log('✅ Inicialización completa');
});


// =============================================
// FUNCIONALIDADES DE LOGIN
// =============================================

/**
 * Configuración del formulario de login
 * Maneja la visibilidad de contraseñas y validación
 * NOTA: Este código solo se aplica si NO estamos en login.html
 * porque login.html tiene su propia implementación
 */
document.addEventListener("DOMContentLoaded", () => {
    // Solo ejecutar si NO estamos en login.html
    if (window.location.pathname.includes('login.html')) {
        return; // Salir para evitar conflictos
    }

    // Buscar formulario por `loginForm` o `authForm` para compatibilidad
    const loginForm = document.getElementById("loginForm") || document.getElementById("authForm");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // Proteger para evitar errores si los elementos no existen en la página actual
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePassword.innerHTML = type === "password" 
                ? '<i class="bi bi-eye"></i>' 
                : '<i class="bi bi-eye-slash"></i>';
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!loginForm.checkValidity()) {
                e.stopPropagation();
                loginForm.classList.add("was-validated");
                return;
            }

            // Este código ahora es manejado por el formulario específico en login.html
            // No se ejecuta la notificación de ejemplo aquí
        });
    }
});

/**
 * Control alternativo de visibilidad de contraseña
 * Implementación adicional para botones de toggle
 */
document.addEventListener("DOMContentLoaded", () => {
    // Solo ejecutar si NO estamos en login.html
    if (window.location.pathname.includes('login.html')) {
        return; // Salir para evitar conflictos
    }

    const pwd = document.getElementById("password");
    const toggleBtn = document.querySelector(".password-toggle");
    const icon = toggleBtn ? toggleBtn.querySelector("i") : null;

    if (toggleBtn && pwd && icon) {
        const setMode = (show) => {
        pwd.type = show ? "text" : "password";
        toggleBtn.setAttribute("aria-pressed", String(show));
        icon.classList.toggle("bi-eye", !show);
        icon.classList.toggle("bi-eye-slash", show);

      // Mantener el cursor al final (algunos navegadores lo mueven)
        const v = pwd.value;
        pwd.value = "";
        pwd.value = v;
        pwd.focus({ preventScroll: true });
    };

    toggleBtn.addEventListener("click", () => {
        setMode(pwd.type === "password");
        });
    }
});
