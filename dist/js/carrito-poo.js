// === CLASES POO PARA EL CARRITO DE COMPRAS - ES6 ===

class Producto {
    #id;
    #nombre;
    #precio;
    #cantidad;
    #stock;
    #imagen;
    #descripcion;
    #categoria;
    #etiquetas;

    constructor(id, nombre, precio, cantidad, imagen = "", descripcion = "", categoria = "", etiquetas = []) {
        this.#id = id;
        this.#nombre = nombre;
        this.#precio = precio;
        this.#cantidad = cantidad;
        this.#stock = 0;
        this.#imagen = imagen;
        this.#descripcion = descripcion;
        this.#categoria = categoria;
        this.#etiquetas = Array.isArray(etiquetas) ? etiquetas : [];
    }

    // Getters
    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getPrecio() { return this.#precio; }
    getCantidad() { return this.#cantidad; }
    getStock() { return this.#stock; }
    getImagen() { return this.#imagen; }
    getDescripcion() { return this.#descripcion; }
    getCategoria() { return this.#categoria; }
    getEtiquetas() { return [...this.#etiquetas]; }

    // Setters
    setStock(nuevoStock) {
        if (Number.isInteger(nuevoStock) && nuevoStock >= 0) {
            this.#stock = nuevoStock;
        } else {
            console.error("El stock no puede ser negativo");
        }
    }

    setCantidad(nuevaCantidad) {
        if (Number.isInteger(nuevaCantidad) && nuevaCantidad > 0) {
            this.#cantidad = nuevaCantidad;
        } else {
            console.error("La cantidad debe ser mayor que cero");
        }
    }

    setNombre(nuevoNombre) {
        if (nuevoNombre && nuevoNombre.trim() !== "") {
            this.#nombre = nuevoNombre;
        } else {
            console.error("El nombre no puede estar vacío");
        }
    }

    setPrecio(nuevoPrecio) {
        if (Number(nuevoPrecio) > 0) {
            this.#precio = nuevoPrecio;
        } else {
            console.error("El precio debe ser mayor que cero");
        }
    }

    setImagen(nuevaUrl) {
        if (typeof nuevaUrl === "string") this.#imagen = nuevaUrl.trim();
    }

    setDescripcion(nuevaDescripcion) {
        if (typeof nuevaDescripcion === "string") this.#descripcion = nuevaDescripcion.trim();
    }

    setCategoria(nuevaCategoria) {
        if (typeof nuevaCategoria === "string") this.#categoria = nuevaCategoria.trim();
    }

    setEtiquetas(nuevasEtiquetas) {
        if (Array.isArray(nuevasEtiquetas)) {
            this.#etiquetas = nuevasEtiquetas.filter(etiqueta => 
                typeof etiqueta === "string" && etiqueta.trim() !== ""
            ).map(etiqueta => etiqueta.trim());
        }
    }

    agregarEtiqueta(etiqueta) {
        if (typeof etiqueta === "string" && etiqueta.trim() !== "" && !this.#etiquetas.includes(etiqueta.trim())) {
            this.#etiquetas.push(etiqueta.trim());
        }
    }

    eliminarEtiqueta(etiqueta) {
        const index = this.#etiquetas.indexOf(etiqueta);
        if (index > -1) {
            this.#etiquetas.splice(index, 1);
        }
    }

    // Métodos para manejo de stock
    estaAgotado() {
        return this.#stock === 0;
    }

    esUltimoEnInventario() {
        return this.#stock === 1;
    }

    stockBajo() {
        return this.#stock > 0 && this.#stock < 4;
    }

    reducirStock(cantidad) {
        if (cantidad <= this.#stock) {
            this.#stock -= cantidad;
            return true;
        }
        return false;
    }

    puedeAgregarCantidad(cantidad) {
        return cantidad <= this.#stock;
    }

    getMensajeStock() {
        if (this.estaAgotado()) {
            return "Producto agotado";
        } else if (this.esUltimoEnInventario()) {
            return "¡Último producto en inventario!";
        } else if (this.stockBajo()) {
            return `Solo quedan ${this.#stock} unidades`;
        }
        return "";
    }

    // Métodos de búsqueda y filtrado
    coincideConTexto(texto) {
        if (!texto || typeof texto !== "string") return true;
        
        const textoNormalizado = this.#normalizarTexto(texto);
        const nombre = this.#normalizarTexto(this.#nombre);
        const descripcion = this.#normalizarTexto(this.#descripcion);
        const categoria = this.#normalizarTexto(this.#categoria);
        const etiquetas = this.#etiquetas.map(etiqueta => this.#normalizarTexto(etiqueta)).join(" ");
        
        return nombre.includes(textoNormalizado) ||
               descripcion.includes(textoNormalizado) ||
               categoria.includes(textoNormalizado) ||
               etiquetas.includes(textoNormalizado);
    }

    coincideConCategoria(categoria) {
        if (!categoria || typeof categoria !== "string") return true;
        return this.#normalizarTexto(this.#categoria) === this.#normalizarTexto(categoria);
    }

    coincideConRangoPrecio(precioMin, precioMax) {
        const precio = Number(this.#precio);
        if (precioMin !== null && precio < precioMin) return false;
        if (precioMax !== null && precio > precioMax) return false;
        return true;
    }

    tieneEtiqueta(etiqueta) {
        if (!etiqueta || typeof etiqueta !== "string") return false;
        return this.#etiquetas.some(e => this.#normalizarTexto(e) === this.#normalizarTexto(etiqueta));
    }

    #normalizarTexto(texto) {
        return texto.toLowerCase()
                   .normalize("NFD")
                   .replace(/[\u0300-\u036f]/g, "")
                   .trim();
    }

    getClaseStock() {
        if (this.estaAgotado()) {
            return "text-danger";
        } else if (this.esUltimoEnInventario()) {
            return "text-warning";
        } else if (this.stockBajo()) {
            return "text-info";
        }
        return "";
    }
}

class ItemCarrito {
    #producto;
    #cantidad;

    constructor(producto, cantidad = 1) {
        this.#producto = producto;
        this.#cantidad = cantidad;
    }

    getProducto() { return this.#producto; }
    getCantidad() { return this.#cantidad; }

    setCantidad(nuevaCantidad) {
        if (Number.isInteger(nuevaCantidad) && nuevaCantidad > 0) {
            if (this.#producto.puedeAgregarCantidad(nuevaCantidad)) {
                this.#cantidad = nuevaCantidad;
                return true;
            } else {
                console.error(`No hay suficiente stock. Stock disponible: ${this.#producto.getStock()}`);
                return false;
            }
        } else {
            console.error("La cantidad debe ser un número entero mayor que cero");
            return false;
        }
    }

    getSubtotal() {
        return this.#producto.getPrecio() * this.#cantidad;
    }

    aumentarCantidad(cantidad = 1) {
        const nuevaCantidad = this.#cantidad + cantidad;
        return this.setCantidad(nuevaCantidad);
    }

    disminuirCantidad(cantidad = 1) {
        const nuevaCantidad = this.#cantidad - cantidad;
        if (nuevaCantidad > 0) {
            this.#cantidad = nuevaCantidad;
            return true;
        }
        return false;
    }
}

class CarritoCompras {
    #items;
    #productos; // Referencia a todos los productos disponibles

    constructor() {
        this.#items = [];
        this.#productos = new Map();
    }

    // === FUNCIONES ASÍNCRONAS PARA GESTIÓN DE INVENTARIO ===
    
    // Cargar productos desde localStorage o JSON de forma asíncrona
    async cargarProductos() {
        // Intentar cargar desde localStorage primero
        if (this.cargarProductosDesdeLocalStorage()) {
            console.log("Productos cargados desde localStorage");
            return true;
        }
        
        // Si no hay datos en localStorage, cargar desde JSON usando fetch()
        try {
            console.log("Cargando productos desde JSON de forma asíncrona...");
            const response = await fetch("../src/data/productos.json");
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const productosData = await response.json();
            
            // Simular tiempo de carga del servidor
            await this.#simularTiempoServidor(500, 1000);
            
            productosData.forEach(prodData => {
                // Generar categorías y etiquetas basadas en el nombre y descripción
                const categoria = this.#determinarCategoria(prodData.nombre, prodData.desc);
                const etiquetas = this.#generarEtiquetas(prodData.nombre, prodData.desc, categoria);
                
                const producto = new Producto(
                    prodData.id,
                    prodData.nombre,
                    parseInt(prodData.precio.replace(/\./g, "")),
                    1,
                    prodData.img,
                    prodData.desc,
                    categoria,
                    etiquetas
                );
                
                // Asignar stock desde JSON o aleatorio
                const stock = prodData.stock !== undefined ? prodData.stock : this.generarStockAleatorio();
                producto.setStock(stock);
                
                this.#productos.set(prodData.id, producto);
            });
            
            // Guardar en localStorage para futuras cargas
            this.#guardarProductosEnLocalStorage();
            console.log("Productos cargados desde JSON y guardados en localStorage");
            
            return true;
        } catch (error) {
            console.error("Error al cargar productos de forma asíncrona:", error);
            throw new Error(`No se pudieron cargar los productos: ${error.message}`);
        }
    }
    
    // Función auxiliar para simular tiempo de respuesta del servidor
    async #simularTiempoServidor(minMs = 300, maxMs = 800) {
        const tiempoEspera = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
        return new Promise(resolve => setTimeout(resolve, tiempoEspera));
    }

    generarStockAleatorio() {
        // Generar stock aleatorio pero realista
        const probabilidades = [
            { min: 0, max: 0, peso: 0.05 },    // 5% agotado
            { min: 1, max: 1, peso: 0.05 },    // 5% último producto
            { min: 2, max: 3, peso: 0.15 },    // 15% stock bajo
            { min: 4, max: 10, peso: 0.35 },   // 35% stock medio
            { min: 11, max: 25, peso: 0.30 },  // 30% stock alto
            { min: 26, max: 50, peso: 0.10 }   // 10% stock muy alto
        ];

        const random = Math.random();
        let acumulado = 0;
        
        for (const prob of probabilidades) {
            acumulado += prob.peso;
            if (random <= acumulado) {
                return Math.floor(Math.random() * (prob.max - prob.min + 1)) + prob.min;
            }
        }
        
        return 5; // Valor por defecto
    }

    // Métodos auxiliares para categorización automática
    #determinarCategoria(nombre, descripcion) {
        const texto = (nombre + " " + descripcion).toLowerCase();
        
        // Todos los audífonos van a la categoría Audio
        if (texto.includes("audifonos") || texto.includes("audífonos") || 
            texto.includes("auriculares") || texto.includes("headphones") ||
            texto.includes("earbuds") || texto.includes("headset")) return "Audio";
        if (texto.includes("mouse") || texto.includes("teclado")) return "Periféricos";
        if (texto.includes("monitor") || texto.includes("pantalla")) return "Monitores";
        if (texto.includes("tablet")) return "Tablets";
        if (texto.includes("drone")) return "Drones";
        if (texto.includes("cargador")) return "Accesorios";
        if (texto.includes("camara") || texto.includes("cámara")) return "Cámaras";
        
        return "Tecnología";
    }

    #generarEtiquetas(nombre, descripcion, categoria) {
        const etiquetas = new Set();
        const texto = (nombre + " " + descripcion).toLowerCase();
        
        // Etiquetas por características
        if (texto.includes("inalambrico") || texto.includes("inalámbrico") || texto.includes("bluetooth")) {
            etiquetas.add("Inalámbrico");
        }
        if (texto.includes("rgb")) etiquetas.add("RGB");
        if (texto.includes("gaming")) etiquetas.add("Gaming");
        if (texto.includes("hd") || texto.includes("full hd")) etiquetas.add("HD");
        if (texto.includes("compacto")) etiquetas.add("Compacto");
        if (texto.includes("pro")) etiquetas.add("Pro");
        if (texto.includes("mecanico") || texto.includes("mecánico")) etiquetas.add("Mecánico");
        if (texto.includes("rapida") || texto.includes("rápida")) etiquetas.add("Carga Rápida");
        
        // Agregar categoría como etiqueta
        etiquetas.add(categoria);
        
        return Array.from(etiquetas);
    }

    getProductos() {
        return Array.from(this.#productos.values());
    }

    getProductoPorId(id) {
        return this.#productos.get(id);
    }

    // Métodos de filtrado avanzado
    filtrarProductos(filtros = {}) {
        const { texto, categoria, precioMin, precioMax, etiqueta } = filtros;
        
        return this.getProductos().filter(producto => {
            return producto.coincideConTexto(texto) &&
                   producto.coincideConCategoria(categoria) &&
                   producto.coincideConRangoPrecio(precioMin, precioMax) &&
                   (etiqueta ? producto.tieneEtiqueta(etiqueta) : true);
        });
    }

    buscarPorNombre(nombre) {
        if (!nombre || typeof nombre !== "string") return this.getProductos();
        
        return this.getProductos().filter(producto => 
            producto.getNombre().toLowerCase().includes(nombre.toLowerCase())
        );
    }

    buscarPorDescripcion(descripcion) {
        if (!descripcion || typeof descripcion !== "string") return this.getProductos();
        
        return this.getProductos().filter(producto => 
            producto.getDescripcion().toLowerCase().includes(descripcion.toLowerCase())
        );
    }

    buscarPorCategoria(categoria) {
        if (!categoria || typeof categoria !== "string") return this.getProductos();
        
        return this.getProductos().filter(producto => 
            producto.coincideConCategoria(categoria)
        );
    }

    buscarPorEtiqueta(etiqueta) {
        if (!etiqueta || typeof etiqueta !== "string") return this.getProductos();
        
        return this.getProductos().filter(producto => 
            producto.tieneEtiqueta(etiqueta)
        );
    }

    buscarPorRangoPrecio(precioMin, precioMax) {
        return this.getProductos().filter(producto => 
            producto.coincideConRangoPrecio(precioMin, precioMax)
        );
    }

    obtenerCategorias() {
        const categorias = new Set();
        this.getProductos().forEach(producto => {
            if (producto.getCategoria()) {
                categorias.add(producto.getCategoria());
            }
        });
        return Array.from(categorias).sort();
    }

    obtenerEtiquetas() {
        const etiquetas = new Set();
        this.getProductos().forEach(producto => {
            producto.getEtiquetas().forEach(etiqueta => {
                etiquetas.add(etiqueta);
            });
        });
        return Array.from(etiquetas).sort();
    }

    obtenerRangoPrecio() {
        const productos = this.getProductos();
        if (productos.length === 0) return { min: 0, max: 0 };
        
        const precios = productos.map(p => Number(p.getPrecio()));
        return {
            min: Math.min(...precios),
            max: Math.max(...precios)
        };
    }

    agregarProducto(idProducto, cantidad = 1) {
        const producto = this.#productos.get(idProducto);
        if (!producto) {
            console.error("Producto no encontrado");
            return false;
        }

        if (producto.estaAgotado()) {
            alert("Este producto está agotado");
            return false;
        }

        // Verificar si el producto ya está en el carrito
        const itemExistente = this.#items.find(item => 
            item.getProducto().getId() === idProducto
        );

        if (itemExistente) {
            const nuevaCantidad = itemExistente.getCantidad() + cantidad;
            if (producto.puedeAgregarCantidad(nuevaCantidad)) {
                itemExistente.setCantidad(nuevaCantidad);
                this.guardarEnLocalStorage();
                return true;
            } else {
                alert(`No hay suficiente stock. Stock disponible: ${producto.getStock()}`);
                return false;
            }
        } else {
            if (producto.puedeAgregarCantidad(cantidad)) {
                const nuevoItem = new ItemCarrito(producto, cantidad);
                this.#items.push(nuevoItem);
                this.guardarEnLocalStorage();
                return true;
            } else {
                alert(`No hay suficiente stock. Stock disponible: ${producto.getStock()}`);
                return false;
            }
        }
    }

    eliminarProducto(idProducto) {
        const index = this.#items.findIndex(item => 
            item.getProducto().getId() === idProducto
        );
        if (index !== -1) {
            this.#items.splice(index, 1);
            this.guardarEnLocalStorage();
            return true;
        }
        return false;
    }

    modificarCantidad(idProducto, nuevaCantidad) {
        const item = this.#items.find(item => 
            item.getProducto().getId() === idProducto
        );
        if (item) {
            if (nuevaCantidad <= 0) {
                return this.eliminarProducto(idProducto);
            }
            const resultado = item.setCantidad(nuevaCantidad);
            if (resultado) {
                this.guardarEnLocalStorage();
            }
            return resultado;
        }
        return false;
    }

    vaciarCarrito() {
        this.#items = [];
        this.guardarEnLocalStorage();
    }

    getItems() {
        return [...this.#items];
    }

    getTotalItems() {
        return this.#items.reduce((total, item) => total + item.getCantidad(), 0);
    }

    getTotal() {
        return this.#items.reduce((total, item) => total + item.getSubtotal(), 0);
    }

    // Verificación asíncrona de stock con manejo de errores
    async verificarStockAsincrono(idProducto, cantidadSolicitada) {
        try {
            console.log(`Verificando stock para producto ${idProducto}...`);
            
            // Simular verificación en servidor
            await this.#simularTiempoServidor(200, 500);
            
            const producto = this.#productos.get(idProducto);
            if (!producto) {
                throw new Error(`Producto con ID ${idProducto} no encontrado`);
            }
            
            // Verificar si el producto está agotado
            if (producto.estaAgotado()) {
                const error = new Error(`El producto "${producto.getNombre()}" está completamente agotado`);
                error.tipo = 'PRODUCTO_AGOTADO';
                error.producto = producto;
                throw error;
            }
            
            // Verificar si hay suficiente stock
            if (!producto.puedeAgregarCantidad(cantidadSolicitada)) {
                const error = new Error(`Stock insuficiente para "${producto.getNombre()}". Stock disponible: ${producto.getStock()}, solicitado: ${cantidadSolicitada}`);
                error.tipo = 'STOCK_INSUFICIENTE';
                error.producto = producto;
                error.stockDisponible = producto.getStock();
                error.cantidadSolicitada = cantidadSolicitada;
                throw error;
            }
            
            console.log(`Stock verificado correctamente para ${producto.getNombre()}`);
            return {
                valido: true,
                producto: producto,
                stockDisponible: producto.getStock(),
                mensaje: `Stock disponible: ${producto.getStock()} unidades`
            };
            
        } catch (error) {
            console.error('Error en verificación asíncrona de stock:', error.message);
            throw error;
        }
    }
    
    // Actualización asíncrona de stock simulando operación en servidor
    async actualizarStockAsincrono(idProducto, cantidadReducir, datosCompra = {}) {
        try {
            console.log(`Actualizando stock en servidor para producto ${idProducto}...`);
            
            // Simular operación en servidor con tiempo variable
            await this.#simularTiempoServidor(800, 1500);
            
            const producto = this.#productos.get(idProducto);
            if (!producto) {
                throw new Error(`Producto con ID ${idProducto} no encontrado`);
            }
            
            const stockAnterior = producto.getStock();
            
            // Simular posibles errores del servidor (5% de probabilidad)
            if (Math.random() < 0.05) {
                throw new Error('Error temporal del servidor. Intente nuevamente.');
            }
            
            // Actualizar stock
            if (!producto.reducirStock(cantidadReducir)) {
                throw new Error(`No se pudo reducir el stock. Stock actual: ${producto.getStock()}`);
            }
            
            const stockNuevo = producto.getStock();
            
            // Guardar cambios en localStorage
            this.#guardarProductosEnLocalStorage();
            
            console.log(`Stock actualizado: ${stockAnterior} → ${stockNuevo}`);
            
            // Si el stock está bajo, notificar al responsable
            if (producto.stockBajo() || producto.estaAgotado()) {
                await this.notificarResponsableStock(producto, datosCompra);
            }
            
            return {
                exito: true,
                producto: producto,
                stockAnterior: stockAnterior,
                stockNuevo: stockNuevo,
                mensaje: `Stock actualizado correctamente. Nuevo stock: ${stockNuevo}`
            };
            
        } catch (error) {
            console.error('Error en actualización asíncrona de stock:', error.message);
            throw error;
        }
    }
    
    // Simulación de notificación por correo al responsable
    async notificarResponsableStock(producto, datosCompra = {}) {
        try {
            console.log(`Enviando notificación por correo para ${producto.getNombre()}...`);
            
            // Simular tiempo de envío de correo
            await this.#simularTiempoServidor(1000, 2000);
            
            // Simular posibles errores de envío (3% de probabilidad)
            if (Math.random() < 0.03) {
                throw new Error('Error al enviar notificación por correo');
            }
            
            const tipoNotificacion = producto.estaAgotado() ? 'AGOTADO' : 'STOCK_BAJO';
            const asunto = producto.estaAgotado() 
                ? `🚨 PRODUCTO AGOTADO: ${producto.getNombre()}`
                : `⚠️ STOCK BAJO: ${producto.getNombre()}`;
            
            const mensaje = {
                para: 'responsable@techgadgetstore.com',
                asunto: asunto,
                cuerpo: `
                    Estimado responsable de inventario,
                    
                    ${producto.estaAgotado() 
                        ? `El producto "${producto.getNombre()}" se ha AGOTADO completamente.`
                        : `El producto "${producto.getNombre()}" tiene stock bajo (${producto.getStock()} unidades).`
                    }
                    
                    Detalles del producto:
                    - ID: ${producto.getId()}
                    - Nombre: ${producto.getNombre()}
                    - Categoría: ${producto.getCategoria()}
                    - Stock actual: ${producto.getStock()}
                    - Precio: $${producto.getPrecio().toLocaleString()}
                    
                    ${datosCompra.cliente ? `Última compra realizada por: ${datosCompra.cliente}` : ''}
                    ${datosCompra.fecha ? `Fecha: ${datosCompra.fecha}` : ''}
                    
                    Se recomienda reabastecer el inventario lo antes posible.
                    
                    Saludos,
                    Sistema de Gestión de Inventario
                    TechGadget Store
                `,
                fecha: new Date().toISOString(),
                tipo: tipoNotificacion
            };
            
            // Simular envío exitoso
            console.log('📧 Notificación enviada:', mensaje);
            
            return {
                exito: true,
                mensaje: 'Notificación enviada correctamente',
                detalles: mensaje
            };
            
        } catch (error) {
            console.error('Error al enviar notificación por correo:', error.message);
            // No lanzar error para no interrumpir el flujo de compra
            return {
                exito: false,
                mensaje: `Error al enviar notificación: ${error.message}`
            };
        }
    }
    
    // Proceso de compra asíncrono mejorado
    async procesarCompraAsincrona(datosCompra = {}) {
        if (this.#items.length === 0) {
            throw new Error("El carrito está vacío");
        }

        try {
            console.log('Iniciando proceso de compra asíncrono...');
            
            // 1. Verificar stock de todos los productos de forma asíncrona
            console.log('Verificando stock de todos los productos...');
            for (const item of this.#items) {
                await this.verificarStockAsincrono(item.getProducto().getId(), item.getCantidad());
            }
            
            // 2. Actualizar stock de todos los productos
            console.log('Actualizando stock en servidor...');
            const resultadosActualizacion = [];
            
            for (const item of this.#items) {
                const resultado = await this.actualizarStockAsincrono(
                    item.getProducto().getId(), 
                    item.getCantidad(),
                    datosCompra
                );
                resultadosActualizacion.push(resultado);
            }
            
            // 3. Vaciar carrito
            this.vaciarCarrito();
            
            console.log('Compra procesada exitosamente');
            
            return {
                exito: true,
                mensaje: 'Compra procesada correctamente',
                detalles: resultadosActualizacion
            };
            
        } catch (error) {
            console.error('Error en proceso de compra asíncrono:', error.message);
            
            // Mostrar mensaje de error específico según el tipo
            let mensajeError = 'Error al procesar la compra';
            
            if (error.tipo === 'PRODUCTO_AGOTADO') {
                mensajeError = `❌ ${error.message}`;
            } else if (error.tipo === 'STOCK_INSUFICIENTE') {
                mensajeError = `⚠️ ${error.message}`;
            } else {
                mensajeError = `🚫 Error del sistema: ${error.message}`;
            }
            
            throw new Error(mensajeError);
        }
    }

    // Método original mantenido para compatibilidad
    procesarCompra() {
        if (this.#items.length === 0) {
            alert("El carrito está vacío");
            return false;
        }

        // Verificar stock antes de procesar
        for (const item of this.#items) {
            const producto = item.getProducto();
            if (!producto.puedeAgregarCantidad(item.getCantidad())) {
                alert(`No hay suficiente stock para ${producto.getNombre()}. Stock disponible: ${producto.getStock()}`);
                return false;
            }
        }

        // Reducir stock de todos los productos
        for (const item of this.#items) {
            const producto = item.getProducto();
            producto.reducirStock(item.getCantidad());
        }

        // Vaciar carrito
        this.vaciarCarrito();
        return true;
    }

    guardarEnLocalStorage() {
        const carritoData = this.#items.map(item => ({
            id: item.getProducto().getId(),
            cantidad: item.getCantidad()
        }));
        localStorage.setItem("carritoPOO", JSON.stringify(carritoData));
    }

    // Métodos para administrador de inventario
    crearProducto(datosProducto) {
        const { nombre, descripcion, precio, categoria, etiquetas, stock, imagen } = datosProducto;
        
        // Validaciones
        if (!nombre || !descripcion || !precio) {
            throw new Error("Nombre, descripción y precio son obligatorios");
        }
        
        if (Number(precio) <= 0) {
            throw new Error("El precio debe ser mayor que cero");
        }
        
        if (Number(stock) < 0) {
            throw new Error("El stock no puede ser negativo");
        }
        
        // Generar ID único
        const id = this.#generarIdUnico();
        
        const producto = new Producto(
            id,
            nombre,
            Number(precio),
            1,
            imagen || "",
            descripcion,
            categoria || "Tecnología",
            Array.isArray(etiquetas) ? etiquetas : []
        );
        
        producto.setStock(Number(stock) || 0);
        this.#productos.set(id, producto);
        this.#guardarProductosEnLocalStorage();
        
        return producto;
    }

    actualizarProducto(id, datosActualizados) {
        const producto = this.#productos.get(id);
        if (!producto) {
            throw new Error("Producto no encontrado");
        }
        
        const { nombre, descripcion, precio, categoria, etiquetas, stock, imagen } = datosActualizados;
        
        // Actualizar solo los campos proporcionados
        if (nombre !== undefined) producto.setNombre(nombre);
        if (descripcion !== undefined) producto.setDescripcion(descripcion);
        if (precio !== undefined) producto.setPrecio(Number(precio));
        if (categoria !== undefined) producto.setCategoria(categoria);
        if (etiquetas !== undefined) producto.setEtiquetas(etiquetas);
        if (stock !== undefined) producto.setStock(Number(stock));
        if (imagen !== undefined) producto.setImagen(imagen);
        
        this.#guardarProductosEnLocalStorage();
        return producto;
    }

    eliminarProductoDelInventario(id) {
        if (!this.#productos.has(id)) {
            throw new Error("Producto no encontrado");
        }
        
        // Eliminar del carrito si existe
        const index = this.#items.findIndex(item => 
            item.getProducto().getId() === id
        );
        if (index !== -1) {
            this.#items.splice(index, 1);
            this.guardarEnLocalStorage();
        }
        
        // Eliminar de la lista de productos
        const eliminado = this.#productos.delete(id);
        this.#guardarProductosEnLocalStorage();
        
        return eliminado;
    }

    #generarIdUnico() {
        let id;
        do {
            id = Math.floor(Math.random() * 100000).toString();
        } while (this.#productos.has(id));
        return id;
    }

    #guardarProductosEnLocalStorage() {
        const productosArray = Array.from(this.#productos.values()).map(producto => ({
            id: producto.getId(),
            nombre: producto.getNombre(),
            desc: producto.getDescripcion(),
            precio: producto.getPrecio().toString(),
            categoria: producto.getCategoria(),
            etiquetas: producto.getEtiquetas(),
            stock: producto.getStock(),
            img: producto.getImagen()
        }));
        
        localStorage.setItem("productosInventario", JSON.stringify(productosArray));
    }

    cargarProductosDesdeLocalStorage() {
        const productosGuardados = localStorage.getItem("productosInventario");
        if (productosGuardados) {
            try {
                const productosArray = JSON.parse(productosGuardados);
                productosArray.forEach(prodData => {
                    const producto = new Producto(
                        prodData.id,
                        prodData.nombre,
                        Number(prodData.precio),
                        1,
                        prodData.img || "",
                        prodData.desc,
                        prodData.categoria || "Tecnología",
                        prodData.etiquetas || []
                    );
                    
                    producto.setStock(prodData.stock || 0);
                    this.#productos.set(prodData.id, producto);
                });
                return true;
            } catch (error) {
                console.error("Error al cargar productos desde localStorage:", error);
                return false;
            }
        }
        return false;
    }

    cargarDesdeLocalStorage() {
        const carritoData = JSON.parse(localStorage.getItem("carritoPOO")) || [];
        this.#items = [];
        
        carritoData.forEach(itemData => {
            const producto = this.#productos.get(itemData.id);
            if (producto && !producto.estaAgotado()) {
                const item = new ItemCarrito(producto, itemData.cantidad);
                this.#items.push(item);
            }
        });
    }
}

// Instancia global del carrito
const carritoGlobal = new CarritoCompras();