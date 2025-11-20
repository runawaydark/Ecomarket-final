// ===== FOOTER COMPONENT - Versión simplificada =====

function createFooter() {
    return `
    <footer class="footer">
        <div class="footer-top">
            <p>¿Te queda alguna duda? Capaz que esta información te sirva ;)</p>
        </div>
        <div class="footer-content">
            <div class="footer-section">
                <h4 class="footer-accordion-header" onclick="toggleAccordion('pasillos')">
                    PASILLOS <i class="bi bi-chevron-down accordion-icon" id="pasillos-icon"></i>
                </h4>
                <ul class="footer-accordion-content" id="pasillos-content">
                    <li><a href="catalogo.html?categoria=frutas">Frutas</a></li>
                    <li><a href="catalogo.html?categoria=verduras">Verduras</a></li>
                    <li><a href="catalogo.html?categoria=despensa">Despensa</a></li>
                    <li><a href="catalogo.html?categoria=ofertas">Ofertas</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4 class="footer-accordion-header" onclick="toggleAccordion('paginas')">
                    PÁGINAS <i class="bi bi-chevron-down accordion-icon" id="paginas-icon"></i>
                </h4>
                <ul class="footer-accordion-content" id="paginas-content">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="catalogo.html">Catálogo</a></li>
                    <li><a href="carrito.html">Carrito</a></li>
                    <li><a href="login.html">Mi cuenta</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4 class="footer-accordion-header" onclick="toggleAccordion('contacto')">
                    CONTACTO <i class="bi bi-chevron-down accordion-icon" id="contacto-icon"></i>
                </h4>
                <ul class="footer-accordion-content" id="contacto-content">
                    <li><a href="tel:+573001234567">📞 +57 300 123 4567</a></li>
                    <li><a href="mailto:info@ecomarket.com">✉️ info@ecomarket.com</a></li>
                    <li><a href="#">📍 Calle 123 #45-67, Ciudad</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4 class="footer-accordion-header" onclick="toggleAccordion('politicas')">
                    POLÍTICAS <i class="bi bi-chevron-down accordion-icon" id="politicas-icon"></i>
                </h4>
                <ul class="footer-accordion-content" id="politicas-content">
                    <li><a href="#">Términos y condiciones</a></li>
                    <li><a href="#">Política de privacidad</a></li>
                    <li><a href="#">Política de devoluciones</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-bottom">
            <p>&copy; 2024 EcoMarket. Todos los derechos reservados. | Frutas y verduras frescas para tu mesa</p>
        </div>
    </footer>
    `;
}

// Función para inicializar el footer
function initEcoMarketFooter() {
    console.log('🚀 Iniciando carga del footer...');
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        console.log('✅ Contenedor encontrado, insertando footer...');
        footerContainer.innerHTML = createFooter();
        console.log('✅ Footer cargado correctamente');
        
        // Verificar que se insertó correctamente
        const footerElement = footerContainer.querySelector('footer');
        if (footerElement) {
            console.log('✅ Footer element verificado en el DOM');
        } else {
            console.error('❌ Error: Footer no se insertó correctamente');
        }
    } else {
        console.error('❌ No se encontró el contenedor #footer-container');
        console.log('🔍 Contenedores disponibles:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    }
}

// Auto-inicialización con múltiples estrategias
document.addEventListener('DOMContentLoaded', initEcoMarketFooter);

// Backup - Si DOMContentLoaded ya pasó
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEcoMarketFooter);
} else {
    initEcoMarketFooter();
}

// Backup adicional con timeout
setTimeout(initEcoMarketFooter, 100);