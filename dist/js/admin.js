// === ADMINISTRADOR DE INVENTARIO - ES6 ===

class AdministradorInventario {
    #carrito;
    #productoEditando;
    #filtrosActivos;

    constructor(carritoInstance) {
        this.#carrito = carritoInstance;
        this.#productoEditando = null;
        this.#filtrosActivos = {
            texto: '',
            categoria: '',
            precioMin: null,
            precioMax: null
        };
    }

    async inicializar() {
        await this.#carrito.cargarProductos();
        this.cargarCategorias();
        this.cargarTablaProductos();
        this.configurarEventos();
        this.verificarSesion();
    }

    verificarSesion() {
        const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
        if (!sesion) {
            alert('Acceso denegado. Debes iniciar sesión para acceder al panel de administrador.');
            window.location.href = '../index.html';
            return;
        }

        const usuario = JSON.parse(sesion);
        
        // Verificar si el usuario es administrador
        if (!usuario.esAdmin) {
            alert('Acceso denegado. No tienes permisos de administrador.');
            window.location.href = 'home.html';
            return;
        }
        const navbar = document.querySelector('.navbar .container');
        const navbarBrand = navbar.querySelector('.navbar-brand');
        
        // Crear elemento de bienvenida
        const welcomeElement = document.createElement('span');
        welcomeElement.className = 'navbar-text ms-3';
        welcomeElement.style.color = '#0D3B66';
        welcomeElement.style.fontWeight = '600';
        welcomeElement.innerHTML = `¡Bienvenido, ${usuario.nombre}!`;
        
        navbarBrand.parentNode.insertBefore(welcomeElement, navbarBrand.nextSibling);
        
        // Mostrar botón de cerrar sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('sesionActiva');
                sessionStorage.removeItem('sesionActiva');
                window.location.href = '../index.html';
            });
        }
    }

    cargarCategorias() {
        const selectCategoria = document.getElementById('filtroCategoria');
        const categorias = this.#carrito.obtenerCategorias();
        
        // Limpiar opciones existentes (excepto la primera)
        selectCategoria.innerHTML = '<option value="">Todas las categorías</option>';
        
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
    }

    cargarTablaProductos() {
        const tbody = document.getElementById('tablaProductos');
        const mensajeSinProductos = document.getElementById('mensajeSinProductos');
        
        // Aplicar filtros
        const productos = this.#carrito.filtrarProductos(this.#filtrosActivos);
        
        if (productos.length === 0) {
            tbody.innerHTML = '';
            mensajeSinProductos.style.display = 'block';
            return;
        }
        
        mensajeSinProductos.style.display = 'none';
        tbody.innerHTML = '';
        
        productos.forEach(producto => {
            const fila = this.crearFilaProducto(producto);
            tbody.appendChild(fila);
        });
    }

    crearFilaProducto(producto) {
        const fila = document.createElement('tr');
        
        // Determinar clase de stock
        let claseStock = '';
        let iconoStock = '';
        if (producto.estaAgotado()) {
            claseStock = 'text-danger';
            iconoStock = '<i class="bi bi-exclamation-triangle"></i> ';
        } else if (producto.stockBajo()) {
            claseStock = 'text-warning';
            iconoStock = '<i class="bi bi-exclamation-circle"></i> ';
        } else {
            claseStock = 'text-success';
            iconoStock = '<i class="bi bi-check-circle"></i> ';
        }
        
        fila.innerHTML = `
            <td><code>${producto.getId()}</code></td>
            <td>
                ${producto.getImagen() ? 
                    `<img src="${producto.getImagen()}" alt="${producto.getNombre()}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : 
                    '<div class="bg-light d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; border-radius: 4px;"><i class="bi bi-image text-muted"></i></div>'
                }
            </td>
            <td>
                <strong>${producto.getNombre()}</strong>
            </td>
            <td>
                <small class="text-muted">${producto.getDescripcion().substring(0, 50)}${producto.getDescripcion().length > 50 ? '...' : ''}</small>
            </td>
            <td>
                <span class="badge bg-secondary">${producto.getCategoria()}</span>
            </td>
            <td>
                <strong class="text-primary">$${producto.getPrecio().toLocaleString('es-CL')}</strong>
            </td>
            <td>
                <span class="${claseStock}">${iconoStock}${producto.getStock()}</span>
            </td>
            <td>
                ${producto.getEtiquetas().map(etiqueta => 
                    `<span class="badge bg-info text-dark me-1">${etiqueta}</span>`
                ).join('')}
            </td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="administrador.editarProducto('${producto.getId()}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="administrador.eliminarProducto('${producto.getId()}', '${producto.getNombre()}')" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return fila;
    }

    configurarEventos() {
        // Eventos de filtros
        document.getElementById('filtroTexto').addEventListener('input', (e) => {
            this.#filtrosActivos.texto = e.target.value;
            this.cargarTablaProductos();
        });

        document.getElementById('filtroCategoria').addEventListener('change', (e) => {
            this.#filtrosActivos.categoria = e.target.value;
            this.cargarTablaProductos();
        });

        document.getElementById('filtroPrecioMin').addEventListener('input', (e) => {
            this.#filtrosActivos.precioMin = e.target.value ? Number(e.target.value) : null;
            this.cargarTablaProductos();
        });

        document.getElementById('filtroPrecioMax').addEventListener('input', (e) => {
            this.#filtrosActivos.precioMax = e.target.value ? Number(e.target.value) : null;
            this.cargarTablaProductos();
        });
    }

    limpiarFiltros() {
        this.#filtrosActivos = {
            texto: '',
            categoria: '',
            precioMin: null,
            precioMax: null
        };
        
        document.getElementById('filtroTexto').value = '';
        document.getElementById('filtroCategoria').value = '';
        document.getElementById('filtroPrecioMin').value = '';
        document.getElementById('filtroPrecioMax').value = '';
        
        this.cargarTablaProductos();
    }

    abrirModalCrear() {
        this.#productoEditando = null;
        document.getElementById('modalProductoTitulo').textContent = 'Nuevo Producto';
        document.getElementById('formProducto').reset();
        document.getElementById('productoId').value = '';
    }

    editarProducto(id) {
        const producto = this.#carrito.getProductoPorId(id);
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        this.#productoEditando = producto;
        document.getElementById('modalProductoTitulo').textContent = 'Editar Producto';
        
        // Llenar formulario
        document.getElementById('productoId').value = producto.getId();
        document.getElementById('productoNombre').value = producto.getNombre();
        document.getElementById('productoCategoria').value = producto.getCategoria();
        document.getElementById('productoDescripcion').value = producto.getDescripcion();
        document.getElementById('productoPrecio').value = producto.getPrecio();
        document.getElementById('productoStock').value = producto.getStock();
        document.getElementById('productoImagen').value = producto.getImagen();
        document.getElementById('productoEtiquetas').value = producto.getEtiquetas().join(', ');
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
        modal.show();
    }

    eliminarProducto(id, nombre) {
        this.#productoEditando = { id, nombre };
        document.getElementById('productoEliminarNombre').textContent = nombre;
        
        const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
        modal.show();
    }

    guardarProducto() {
        const form = document.getElementById('formProducto');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const datosProducto = {
            nombre: document.getElementById('productoNombre').value.trim(),
            categoria: document.getElementById('productoCategoria').value,
            descripcion: document.getElementById('productoDescripcion').value.trim(),
            precio: Number(document.getElementById('productoPrecio').value),
            stock: Number(document.getElementById('productoStock').value),
            imagen: document.getElementById('productoImagen').value.trim(),
            etiquetas: document.getElementById('productoEtiquetas').value
                .split(',')
                .map(etiqueta => etiqueta.trim())
                .filter(etiqueta => etiqueta !== '')
        };

        try {
            if (this.#productoEditando) {
                // Editar producto existente
                this.#carrito.actualizarProducto(this.#productoEditando.getId(), datosProducto);
                this.mostrarMensaje('Producto actualizado exitosamente', 'success');
            } else {
                // Crear nuevo producto
                this.#carrito.crearProducto(datosProducto);
                this.mostrarMensaje('Producto creado exitosamente', 'success');
            }

            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
            modal.hide();

            // Recargar tabla y categorías
            this.cargarCategorias();
            this.cargarTablaProductos();

        } catch (error) {
            this.mostrarMensaje('Error: ' + error.message, 'danger');
        }
    }

    confirmarEliminar() {
        if (!this.#productoEditando) return;

        try {
            this.#carrito.eliminarProductoDelInventario(this.#productoEditando.id);
            this.mostrarMensaje('Producto eliminado exitosamente', 'success');

            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
            modal.hide();

            // Recargar tabla y categorías
            this.cargarCategorias();
            this.cargarTablaProductos();

        } catch (error) {
            this.mostrarMensaje('Error: ' + error.message, 'danger');
        }
    }

    mostrarMensaje(mensaje, tipo) {
        // Crear elemento de alerta
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        alerta.style.top = '20px';
        alerta.style.right = '20px';
        alerta.style.zIndex = '9999';
        alerta.style.minWidth = '300px';
        
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alerta);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 5000);
    }
}

// === VARIABLES GLOBALES ===
let administrador;

// === FUNCIONES GLOBALES PARA LOS EVENTOS DEL HTML ===
function abrirModalCrear() {
    administrador.abrirModalCrear();
}

function guardarProducto() {
    administrador.guardarProducto();
}

function confirmarEliminar() {
    administrador.confirmarEliminar();
}

function limpiarFiltros() {
    administrador.limpiarFiltros();
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar que carritoGlobal esté disponible
    if (typeof carritoGlobal === 'undefined') {
        console.error('carritoGlobal no está definido. Asegúrate de que carrito-poo.js se cargue antes que admin.js');
        return;
    }
    
    administrador = new AdministradorInventario(carritoGlobal);
    await administrador.inicializar();
    
    // === MODO OSCURO ===
    const darkModeToggle = document.getElementById("darkModeToggle");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Verificar preferencia guardada o del sistema
    if (
        localStorage.getItem("dark-mode") === "enabled" ||
        (!localStorage.getItem("dark-mode") && prefersDarkScheme.matches)
    ) {
        document.body.classList.add("dark-mode");
        if (darkModeToggle) darkModeToggle.textContent = "☀️";
    }
    
    darkModeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
            darkModeToggle.textContent = "☀️";
        } else {
            localStorage.setItem("dark-mode", "disabled");
            darkModeToggle.textContent = "🌙";
        }
    });
});