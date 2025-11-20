# Sistema de Footer Reutilizable - EcoMarket

## 📋 Descripción
Este sistema permite tener un footer único y reutilizable en todos los archivos HTML del proyecto, evitando duplicación de código y facilitando el mantenimiento.

## 🗂️ Archivos del Sistema

### 1. `footer.html`
Archivo independiente que contiene todo el código HTML del footer:
- Barra superior con mensaje
- Secciones con acordeón (móvil) / estáticas (desktop)
- Enlaces organizados por categorías
- Footer inferior con copyright

### 2. `assets/js/app.js`
Contiene la función `loadFooter()` que:
- Busca el contenedor `#footer-container`
- Carga el HTML del footer desde una variable JavaScript incrustada
- Inicializa los acordeones después de cargar
- **Funciona tanto en servidor como abriendo archivos directamente**

## 🚀 Cómo usar el footer reutilizable

### En cualquier archivo HTML nuevo:

1. **Incluir las dependencias CSS y JS:**
```html
<link href="assets/css/style.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

<!-- Al final del body -->
<script src="assets/js/app.js"></script>
```

2. **Agregar el contenedor del footer:**
```html
<!-- Footer Container - El footer se carga dinámicamente -->
<div id="footer-container"></div>
```

### ¡Es todo! 🎉
No necesitas copiar todo el código del footer, solo agregar el div contenedor.

## 💡 Ventajas del sistema

✅ **DRY (Don't Repeat Yourself)**: Un solo lugar para el código del footer
✅ **Fácil mantenimiento**: Cambios en un archivo se reflejan en todos
✅ **Consistencia**: Mismo footer en todos los archivos
✅ **Estilos preservados**: Los estilos CSS se aplican correctamente
✅ **Funcionalidad intacta**: Los acordeones móviles siguen funcionando
✅ **Gestión de errores**: Footer de respaldo en caso de error de carga

## 🔧 Personalización

### Para modificar el footer:
- Edita únicamente el archivo `footer.html`
- Los cambios se aplicarán automáticamente en todos los archivos HTML

### Para agregar nuevas secciones:
1. Edita `footer.html` agregando la nueva sección
2. Si necesita acordeón móvil, sigue el patrón existente:
```html
<h4 class="footer-accordion-header" onclick="toggleAccordion('nueva-seccion')">
    NUEVA SECCIÓN <i class="bi bi-chevron-down accordion-icon" id="nueva-seccion-icon"></i>
</h4>
<ul class="footer-accordion-content" id="nueva-seccion-content">
    <!-- contenido -->
</ul>
```

## 📱 Compatibilidad

- ✅ Desktop: Footer estático con todas las secciones visibles
- ✅ Móvil: Footer con acordeones colapsables
- ✅ Bootstrap 5 icons
- ✅ Todos los navegadores modernos

## 🛠️ Archivos actualizados

- `index.html` - ✅ Convertido al sistema modular
- `login.html` - ✅ Convertido al sistema modular  
- `carrito.html` - ✅ Ejemplo de implementación
- `footer.html` - ✅ Footer reutilizable creado
- `assets/js/app.js` - ✅ Función loadFooter() añadida

## 📝 Notas importantes

- El HTML del footer está ahora incrustado directamente en `app.js` para evitar problemas con `fetch()` en archivos locales
- Los estilos del footer están en `assets/css/style.css` y se cargan automáticamente
- La función `toggleAccordion()` ya existe en `app.js` para manejar los acordeones móviles
- **Funciona tanto abriendo archivos directamente como en servidor web**

## 🔧 Resolución de problemas

Si el footer no aparece:
1. Abre la consola del navegador (F12)
2. Busca mensajes de error o de confirmación
3. Verifica que el archivo `assets/js/app.js` se esté cargando
4. Usa el archivo `test-footer.html` para hacer pruebas

---
*Creado para el proyecto EcoMarket - Sistema de gestión de footer reutilizable*