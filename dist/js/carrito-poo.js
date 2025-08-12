// === CLASES POO PARA EL CARRITO DE COMPRAS ===

class Producto {
    #id;
    #nombre;
    #precio;
    #cantidad;
    #stock;
    #imagen;
    #descripcion;

    constructor(id, nombre, precio, cantidad, imagen = "", descripcion = "") {
        this.#id = id;
        this.#nombre = nombre;
        this.#precio = precio;
        this.#cantidad = cantidad;
        this.#stock = 0;
        this.#imagen = imagen;
        this.#descripcion = descripcion;
    }

    // Getters
    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getPrecio() { return this.#precio; }
    getCantidad() { return this.#cantidad; }
    getStock() { return this.#stock; }
    getImagen() { return this.#imagen; }
    getDescripcion() { return this.#descripcion; }

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

    // Cargar productos desde JSON
    async cargarProductos() {
        try {
            const response = await fetch("../src/data/productos.json");
            const productosData = await response.json();
            
            productosData.forEach(prodData => {
                const producto = new Producto(
                    prodData.id,
                    prodData.nombre,
                    parseInt(prodData.precio.replace(/\./g, "")),
                    1,
                    prodData.img,
                    prodData.desc
                );
                
                // Asignar stock desde JSON o aleatorio
                const stock = prodData.stock !== undefined ? prodData.stock : this.generarStockAleatorio();
                producto.setStock(stock);
                
                this.#productos.set(prodData.id, producto);
            });
            
            return true;
        } catch (error) {
            console.error("Error al cargar productos:", error);
            return false;
        }
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

    getProductos() {
        return Array.from(this.#productos.values());
    }

    getProductoPorId(id) {
        return this.#productos.get(id);
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