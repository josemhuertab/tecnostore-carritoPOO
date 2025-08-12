// === VARIABLES GLOBALES ===
let carritoSidebar;
let carritoNotificacion;

// === FUNCIÓN GLOBAL PARA ACTUALIZAR NOTIFICACIÓN DEL CARRITO ===
function actualizarNotificacionCarrito() {
  const carritoNotificacionElement = document.getElementById("carritoNotificacion");
  if (!carritoNotificacionElement) return;
  
  const totalCantidad = carritoGlobal.getTotalItems();
  
  if (totalCantidad > 0) {
    carritoNotificacionElement.textContent = totalCantidad;
    carritoNotificacionElement.style.display = "block";
  } else {
    carritoNotificacionElement.style.display = "none";
  }
}

// === FUNCIÓN GLOBAL PARA CARGAR CARRITO ===
function cargarCarrito() {
  const carritoItemsContainer = document.getElementById("carritoItems");
  if (!carritoItemsContainer) return;
  
  carritoItemsContainer.innerHTML = "";
  const items = carritoGlobal.getItems();
  const vaciarBtn = document.getElementById('vaciarCarritoBtn');

  if (items.length === 0) {
    carritoItemsContainer.innerHTML = '<p class="text-muted">Tu carrito está vacío.</p>';
    if (vaciarBtn) vaciarBtn.style.display = 'none';
    actualizarNotificacionCarrito();
    return;
  }
  if (vaciarBtn) vaciarBtn.style.display = 'block';

  let total = 0;
  items.forEach((item, index) => {
    const producto = item.getProducto();
    const subtotal = item.getSubtotal();
    total += subtotal;
    
    const div = document.createElement("div");
    div.classList.add(
      "d-flex",
      "align-items-center",
      "mb-3",
      "gap-2",
      "justify-content-between",
      "border-bottom",
      "pb-2"
    );
    
    div.innerHTML = `
      <img src="${producto.getImagen()}" alt="${producto.getNombre()}" width="50" height="50" style="object-fit: cover;">
      <div class="flex-grow-1 ms-2">
        <p class="mb-1 fw-bold">${producto.getNombre()}</p>
        <div class="d-flex align-items-center gap-2 mb-1">
          <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidadCarrito('${producto.getId()}', ${item.getCantidad() - 1})">-</button>
          <span class="fw-bold">${item.getCantidad()}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidadCarrito('${producto.getId()}', ${item.getCantidad() + 1})">+</button>
        </div>
        <small class="text-muted">Subtotal: $${subtotal.toLocaleString("es-CL")}</small>
      </div>
      <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito('${producto.getId()}')">&times;</button>
    `;
    carritoItemsContainer.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("mt-3", "fw-bold", "text-end", "fs-5");
  totalDiv.textContent = `Total: $${total.toLocaleString("es-CL")}`;
  carritoItemsContainer.appendChild(totalDiv);

  actualizarNotificacionCarrito();
}

// === FUNCIONES PARA MANEJAR EL CARRITO ===
function modificarCantidadCarrito(idProducto, nuevaCantidad) {
  if (carritoGlobal.modificarCantidad(idProducto, nuevaCantidad)) {
    cargarCarrito();
    // Actualizar la visualización de productos si es necesario
    actualizarVisualizacionProductos();
  }
}

function eliminarDelCarrito(idProducto) {
  if (carritoGlobal.eliminarProducto(idProducto)) {
    cargarCarrito();
    actualizarVisualizacionProductos();
  }
}

function actualizarVisualizacionProductos() {
  // Actualizar los botones de compra en la página de productos
  const productCards = document.querySelectorAll('.card');
  productCards.forEach(card => {
    const idElement = card.querySelector('.data-id');
    if (idElement) {
      const id = idElement.textContent.replace('ID: ', '');
      const producto = carritoGlobal.getProductoPorId(id);
      if (producto) {
        const botonComprar = card.querySelector('.btn-primary');
        const stockInfo = card.querySelector('.stock-info');
        
        // Actualizar información de stock
        if (stockInfo) {
          stockInfo.remove();
        }
        
        // Crear nueva información de stock
        const nuevaStockInfo = document.createElement('div');
        nuevaStockInfo.className = 'stock-info mt-2';
        
        if (producto.estaAgotado()) {
          nuevaStockInfo.innerHTML = `<span class="badge bg-danger">Agotado</span>`;
          botonComprar.disabled = true;
          botonComprar.textContent = 'Agotado';
          botonComprar.classList.remove('btn-primary');
          botonComprar.classList.add('btn-secondary');
        } else {
          botonComprar.disabled = false;
          botonComprar.textContent = 'Comprar';
          botonComprar.classList.remove('btn-secondary');
          botonComprar.classList.add('btn-primary');
          
          const mensajeStock = producto.getMensajeStock();
          const claseStock = producto.getClaseStock();
          
          if (mensajeStock) {
            nuevaStockInfo.innerHTML = `<small class="${claseStock} fw-bold">${mensajeStock}</small>`;
          } else {
            nuevaStockInfo.innerHTML = `<small class="text-success">Stock: ${producto.getStock()} unidades</small>`;
          }
        }
        
        const cardBody = card.querySelector('.card-body');
        const precio = cardBody.querySelector('.fw-bold.text-primary');
        precio.parentNode.insertBefore(nuevaStockInfo, precio.nextSibling);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  // === CARGAR PRODUCTOS EN EL CARRITO ===
  await carritoGlobal.cargarProductos();
  carritoGlobal.cargarDesdeLocalStorage();
  
  // === VERIFICAR SESIÓN Y MOSTRAR USUARIO ===
  function verificarYMostrarUsuario() {
    const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (sesion) {
      const usuario = JSON.parse(sesion);
      const navbar = document.querySelector('.navbar .container');
      const navbarBrand = navbar.querySelector('.navbar-brand');
      
      // Crear elemento de bienvenida si no existe
      let welcomeElement = document.getElementById('welcomeUser');
      if (!welcomeElement) {
        welcomeElement = document.createElement('span');
        welcomeElement.id = 'welcomeUser';
        welcomeElement.className = 'navbar-text ms-3';
        welcomeElement.style.color = '#0D3B66';
        welcomeElement.style.fontWeight = '600';
        welcomeElement.innerHTML = `¡Bienvenido, ${usuario.nombre}!`;
        
        // Insertar después del navbar-brand
        navbarBrand.parentNode.insertBefore(welcomeElement, navbarBrand.nextSibling);
      }
      
      // Mostrar botón de cerrar sesión
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
      }
    } else {
      // Ocultar botón de cerrar sesión si no hay sesión
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
    }
  }
  
  // === FUNCIÓN PARA CERRAR SESIÓN ===
  function cerrarSesion() {
    // Eliminar datos de sesión
    localStorage.removeItem('sesionActiva');
    sessionStorage.removeItem('sesionActiva');
    
    // Redirigir a la página de login
    window.location.href = '../index.html';
  }
  
  // Llamar la función al cargar la página
  verificarYMostrarUsuario();
  
  // === EVENT LISTENER PARA CERRAR SESIÓN ===
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', cerrarSesion);
  }
  
  // === SUSCRIPCIÓN CON ALERTA ===
  const subscriptionForm = document.getElementById("subscriptionForm");
  const alertContainer = document.getElementById("alertContainer");

  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por suscribirte!</strong> Te mantendremos informado sobre nuestras promociones y ofertas.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
      subscriptionForm.reset();
      setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(
          document.querySelector(".alert")
        );
        alert.close();
      }, 3000);
    });
  }

  // === CONTACTO CON ALERTA ===
  const contactForm = document.getElementById("contactForm");
  const contactAlertContainer = document.getElementById(
    "contactAlertContainer"
  );

  if (contactForm && contactAlertContainer) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactAlertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>¡Gracias por escribirnos!</strong> Nos pondremos en contacto contigo a la brevedad posible.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
      contactForm.reset();
      setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(
          contactAlertContainer.querySelector(".alert")
        );
        alert.close();
      }, 3000);
    });
  }
  
  // === VARIABLES CARRITO ===
  const abrirCarritoBtn = document.getElementById("abrirCarrito");
  const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
  carritoSidebar = document.getElementById("carritoSidebar");
  const carritoItemsContainer = document.getElementById("carritoItems");
  const realizarPedidoBtn = document.getElementById("realizarPedidoBtn");
  const formularioPedidoContainer = document.getElementById(
    "formularioPedidoContainer"
  );
  const formularioPedido = document.getElementById("formularioPedido");
  const overlayCarrito = document.getElementById("overlayCarrito");
  carritoNotificacion = document.getElementById("carritoNotificacion");

  // === FUNCIÓN PARA VACIAR EL CARRITO ===
  function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
      carritoGlobal.vaciarCarrito();
      cargarCarrito();
      actualizarVisualizacionProductos();
    }
  }

  // === FUNCIÓN PARA CERRAR CARRITO ===
  function cerrarCarrito() {
    carritoSidebar.classList.remove("abierto");
    overlayCarrito.classList.remove("activo");
    document.body.classList.remove("carrito-abierto"); // Quitar clase del body
    formularioPedidoContainer.style.display = "none";
  }

  // === EVENTOS DEL CARRITO ===
  abrirCarritoBtn?.addEventListener("click", () => {
    carritoSidebar.classList.add("abierto");
    overlayCarrito.classList.add("activo");
    document.body.classList.add("carrito-abierto"); // Agregar clase al body
    cargarCarrito();
  });

  cerrarCarritoBtn?.addEventListener("click", cerrarCarrito);
  overlayCarrito?.addEventListener("click", cerrarCarrito);

  realizarPedidoBtn?.addEventListener("click", () => {
    const items = carritoGlobal.getItems();
    if (items.length === 0) {
      alert(
        "Tu carrito está vacío. Agrega productos antes de realizar un pedido."
      );
      return;
    }
    
    // Mostrar/ocultar formulario
    formularioPedidoContainer.style.display =
      formularioPedidoContainer.style.display === "none" ? "block" : "none";
    
    // Autocompletar campos con datos de la sesión
    if (formularioPedidoContainer.style.display === "block") {
      const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
      if (sesion) {
        const usuario = JSON.parse(sesion);
        
        // Autocompletar nombre y apellido
        const nombrePedidoInput = document.getElementById('nombrePedido');
        if (nombrePedidoInput && usuario.nombre && usuario.apellido) {
          nombrePedidoInput.value = `${usuario.nombre} ${usuario.apellido}`;
        }
        
        // Autocompletar correo electrónico
        const emailPedidoInput = document.getElementById('emailPedido');
        if (emailPedidoInput && usuario.email) {
          emailPedidoInput.value = usuario.email;
        }
      }
    }
  });

  // === EVENTO PARA VACIAR CARRITO ===
  document.getElementById('vaciarCarritoBtn')?.addEventListener('click', vaciarCarrito);

  formularioPedido?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Procesar la compra usando POO
    if (carritoGlobal.procesarCompra()) {
      alert(
        "¡Pedido realizado exitosamente! Te daremos seguimiento a través de tu correo. Si tienes dudas o consultas adicionales, no dudes en contactarnos."
      );
      formularioPedido.reset();
      formularioPedidoContainer.style.display = "none";
      cargarCarrito();
      actualizarVisualizacionProductos();
      cerrarCarrito();
    }
  });

  // === FILTRADO, CARGA Y PAGINACIÓN DE PRODUCTOS ===
  const productosGrid = document.getElementById("productosGrid");
  const pagina1Btn = document.getElementById("pagina1");
  const pagina2Btn = document.getElementById("pagina2");
  const filtroInput = document.getElementById("filtroProductos");

  if (productosGrid) {
    let productosFiltrados = [];

    function mostrarProductosEnGrid(productos, pagina) {
      productosGrid.innerHTML = "";
      if (productos.length === 0) {
        // Si no hay productos, mostrar el mensaje de "No se encontraron productos"
        productosGrid.innerHTML = `
          <div class="col-12 text-center">
            <p class="h4 text-muted">No se encontraron productos que coincidan con la búsqueda. 😥</p>
          </div>
        `;
        return; // Salir de la función para no intentar renderizar nada
      }

      const itemsPorPagina = 9;
      const inicio = (pagina - 1) * itemsPorPagina;
      const fin = inicio + itemsPorPagina;
      const productosMostrar = productos.slice(inicio, fin);

      productosMostrar.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-3");
        
        // Determinar el estado del botón y la información de stock
        let botonHtml = '';
        let stockHtml = '';
        
        if (producto.estaAgotado()) {
          botonHtml = '<button class="btn btn-secondary mt-auto" disabled>Agotado</button>';
          stockHtml = '<div class="stock-info mt-2"><span class="badge bg-danger">Agotado</span></div>';
        } else {
          botonHtml = '<button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(\'' + producto.getId() + '\')" data-id="' + producto.getId() + '">Comprar</button>';
          
          const mensajeStock = producto.getMensajeStock();
          const claseStock = producto.getClaseStock();
          
          if (mensajeStock) {
            stockHtml = `<div class="stock-info mt-2"><small class="${claseStock} fw-bold">${mensajeStock}</small></div>`;
          } else {
            stockHtml = `<div class="stock-info mt-2"><small class="text-success">Stock: ${producto.getStock()} unidades</small></div>`;
          }
        }
        
        card.innerHTML = `
          <div class="card h-100">
            <img src="${producto.getImagen()}" class="card-img-top" alt="${producto.getNombre()}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.getNombre()}</h5>
              <p class="small data-id">ID: ${producto.getId()}</p>
              <p class="card-text">${producto.getDescripcion()}</p>
              <p class="card-text fw-bold text-primary">$${producto.getPrecio().toLocaleString("es-CL")}</p>
              ${stockHtml}
              ${botonHtml}
            </div>
          </div>
        `;
        productosGrid.appendChild(card);
      });
    }

    function actualizarPaginacion(productos) {
      const totalPaginas = Math.ceil(productos.length / 9);
      pagina1Btn.style.display = "block";
      pagina2Btn.style.display = totalPaginas > 1 ? "block" : "none";

      if (totalPaginas <= 1) {
        pagina1Btn.classList.add("active");
      }
    }

    // Función auxiliar para eliminar acentos de una cadena
    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function filtrarProductos(terminoBusqueda) {
      const todosLosProductos = carritoGlobal.getProductos();
      
      if (!terminoBusqueda) {
        productosFiltrados = todosLosProductos;
      } else {
        const terminoNormalizado = removeAccents(terminoBusqueda.toLowerCase());

        productosFiltrados = todosLosProductos.filter((producto) => {
          const nombreNormalizado = removeAccents(producto.getNombre().toLowerCase());
          const descNormalizada = removeAccents(producto.getDescripcion().toLowerCase());

          return (
            nombreNormalizado.includes(terminoNormalizado) ||
            descNormalizada.includes(terminoNormalizado)
          );
        });
      }
      actualizarPaginacion(productosFiltrados);
      mostrarProductosEnGrid(productosFiltrados, 1);
    }

    // Carga inicial de productos
    const todosLosProductos = carritoGlobal.getProductos();
    productosFiltrados = todosLosProductos;
    mostrarProductosEnGrid(todosLosProductos, 1);
    actualizarPaginacion(todosLosProductos);

    // Eventos de paginación
    pagina1Btn?.addEventListener("click", () => {
      mostrarProductosEnGrid(productosFiltrados, 1);
      pagina1Btn.classList.add("active");
      pagina2Btn.classList.remove("active");
    });

    pagina2Btn?.addEventListener("click", () => {
      mostrarProductosEnGrid(productosFiltrados, 2);
      pagina2Btn.classList.add("active");
      pagina1Btn.classList.remove("active");
    });

    // Evento para el filtro
    filtroInput?.addEventListener("input", (e) => {
      const termino = e.target.value;
      filtrarProductos(termino);
    });
  }

  // === MODO OSCURO ===
  const darkModeToggle = document.getElementById("darkModeToggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Cargar preferencia previa
  if (
    localStorage.getItem("dark-mode") === "enabled" ||
    (!localStorage.getItem("dark-mode") && prefersDarkScheme.matches)
  ) {
    document.body.classList.add("dark-mode");
  }

  darkModeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("dark-mode", "enabled");
    } else {
      localStorage.setItem("dark-mode", "disabled");
    }
  });

  // === ANIMACIONES ===
  requestAnimationFrame(() => {
    document.body.classList.add("fade-in");
    
    // Remover el transform después de que termine la animación
    setTimeout(() => {
      document.body.classList.add("animation-complete");
    }, 500);
  });

  const main = document.querySelector("main");
  if (main) {
    main.classList.add("fade-in");
  }

  // Llamar actualizarNotificacionCarrito al cargar la página
  actualizarNotificacionCarrito();
});

// === FUNCIÓN GLOBAL PARA AGREGAR PRODUCTO AL CARRITO ===
function agregarAlCarrito(idProducto) {
  const producto = carritoGlobal.getProductoPorId(idProducto);
  if (!producto) return;
  
  if (producto.estaAgotado()) {
    alert("Este producto está agotado");
    return;
  }
  
  let cantidad = prompt("¿Cuántas unidades deseas agregar?", "1");
  cantidad = parseInt(cantidad);
  
  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Cantidad inválida.");
    return;
  }
  
  if (carritoGlobal.agregarProducto(idProducto, cantidad)) {
    // Encontrar el botón que se presionó
    const boton = document.querySelector(`button[data-id="${idProducto}"]`);
    if (boton) {
      const textoOriginal = boton.textContent;
      boton.textContent = "Agregado";
      boton.disabled = true;
      setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.disabled = false;
      }, 1500);
    }
    
    // Actualizar carrito si está abierto
    if (carritoSidebar && carritoSidebar.classList.contains("abierto")) {
      cargarCarrito();
    }
    actualizarNotificacionCarrito();
    actualizarVisualizacionProductos();
  }
}