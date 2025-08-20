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
      
      // Mostrar enlace del administrador solo si es admin
      const adminNavItem = document.getElementById('adminNavItem');
      if (adminNavItem) {
        if (usuario.esAdmin) {
          adminNavItem.style.display = 'block';
        } else {
          adminNavItem.style.display = 'none';
        }
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

  formularioPedido?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Obtener datos del formulario
    const datosCompra = {
      cliente: document.getElementById('nombrePedido')?.value || 'Cliente Anónimo',
      email: document.getElementById('emailPedido')?.value || '',
      celular: document.getElementById('celularPedido')?.value || '',
      direccion: document.getElementById('direccionPedido')?.value || '',
      ciudad: document.getElementById('ciudadPedido')?.value || '',
      codigoPostal: document.getElementById('codigoPostalPedido')?.value || '',
      instrucciones: document.getElementById('instruccionesPedido')?.value || '',
      fecha: new Date().toISOString()
    };
    
    // Deshabilitar el botón de envío para evitar múltiples envíos
    const submitBtn = formularioPedido.querySelector('button[type="submit"]');
    const textoOriginal = submitBtn?.textContent || 'Confirmar Pedido';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando...';
    }
    
    try {
      // Procesar la compra usando funciones asíncronas
      const resultado = await carritoGlobal.procesarCompraAsincrona(datosCompra);
      
      if (resultado.exito) {
        // Mostrar mensaje de éxito con detalles
        let mensajeExito = '🎉 ¡Pedido realizado exitosamente!\n\n';
        mensajeExito += `Estimado/a ${datosCompra.cliente},\n\n`;
        mensajeExito += 'Tu pedido ha sido procesado correctamente. ';
        mensajeExito += 'Te daremos seguimiento a través de tu correo electrónico.\n\n';
        
        if (resultado.detalles && resultado.detalles.length > 0) {
          mensajeExito += 'Productos procesados:\n';
          resultado.detalles.forEach(detalle => {
            if (detalle.producto) {
              mensajeExito += `• ${detalle.producto.getNombre()} - Stock actualizado\n`;
            }
          });
        }
        
        mensajeExito += '\nSi tienes dudas o consultas adicionales, no dudes en contactarnos.';
        
        alert(mensajeExito);
        
        // Limpiar formulario y cerrar
        formularioPedido.reset();
        formularioPedidoContainer.style.display = "none";
        cargarCarrito();
        actualizarVisualizacionProductos();
        cerrarCarrito();
      }
      
    } catch (error) {
      // Mostrar mensaje de error específico
      console.error('Error al procesar compra:', error);
      alert(`❌ Error al procesar el pedido:\n\n${error.message}\n\nPor favor, verifica tu carrito e intenta nuevamente.`);
      
      // Recargar carrito para mostrar estado actualizado
      cargarCarrito();
      actualizarVisualizacionProductos();
      
    } finally {
      // Rehabilitar el botón de envío
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
      }
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

    // Función para filtrar productos con filtros avanzados
    function filtrarProductos(terminoBusqueda) {
      const filtroCategoria = document.getElementById('filtroCategoria')?.value || '';
      const filtroPrecioMin = document.getElementById('filtroPrecioMin')?.value;
      const filtroPrecioMax = document.getElementById('filtroPrecioMax')?.value;
      
      const filtros = {
        texto: terminoBusqueda || '',
        categoria: filtroCategoria,
        precioMin: filtroPrecioMin ? Number(filtroPrecioMin) : null,
        precioMax: filtroPrecioMax ? Number(filtroPrecioMax) : null
      };
      
      const todosLosProductos = carritoGlobal.getProductos();
      
      if (!terminoBusqueda && !filtroCategoria && !filtroPrecioMin && !filtroPrecioMax) {
        productosFiltrados = todosLosProductos;
      } else {
        productosFiltrados = todosLosProductos.filter((producto) => {
          let cumpleFiltros = true;
          
          // Filtro por texto
          if (terminoBusqueda) {
            const terminoNormalizado = removeAccents(terminoBusqueda.toLowerCase());
            const nombreNormalizado = removeAccents(producto.getNombre().toLowerCase());
            const descNormalizada = removeAccents(producto.getDescripcion().toLowerCase());
            
            cumpleFiltros = cumpleFiltros && (
              nombreNormalizado.includes(terminoNormalizado) ||
              descNormalizada.includes(terminoNormalizado)
            );
          }
          
          // Filtro por categoría
          if (filtroCategoria) {
            cumpleFiltros = cumpleFiltros && producto.getCategoria() === filtroCategoria;
          }
          
          // Filtro por precio mínimo
          if (filtroPrecioMin) {
            cumpleFiltros = cumpleFiltros && producto.getPrecio() >= Number(filtroPrecioMin);
          }
          
          // Filtro por precio máximo
          if (filtroPrecioMax) {
            cumpleFiltros = cumpleFiltros && producto.getPrecio() <= Number(filtroPrecioMax);
          }
          
          return cumpleFiltros;
        });
      }
      actualizarPaginacion(productosFiltrados);
      mostrarProductosEnGrid(productosFiltrados, 1);
    }

    // Función para cargar categorías en el filtro
    function cargarCategoriasEnFiltro() {
      const selectCategoria = document.getElementById('filtroCategoria');
      if (!selectCategoria) return;
      
      const categorias = carritoGlobal.obtenerCategorias();
      
      // Limpiar opciones existentes (excepto la primera)
      selectCategoria.innerHTML = '<option value="">Todas las categorías</option>';
      
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.appendChild(option);
      });
    }

    // Función para limpiar todos los filtros
    function limpiarFiltros() {
      document.getElementById('filtroProductos').value = '';
      const filtroCategoria = document.getElementById('filtroCategoria');
      const filtroPrecioMin = document.getElementById('filtroPrecioMin');
      const filtroPrecioMax = document.getElementById('filtroPrecioMax');
      
      if (filtroCategoria) filtroCategoria.value = '';
      if (filtroPrecioMin) filtroPrecioMin.value = '';
      if (filtroPrecioMax) filtroPrecioMax.value = '';
      
      filtrarProductos('');
    }

    // Carga inicial de productos
    const todosLosProductos = carritoGlobal.getProductos();
    productosFiltrados = todosLosProductos;
    mostrarProductosEnGrid(todosLosProductos, 1);
    actualizarPaginacion(todosLosProductos);
    
    // Cargar categorías en el filtro
    cargarCategoriasEnFiltro();

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

    // Evento para el filtro de texto
    filtroInput?.addEventListener("input", (e) => {
      const termino = e.target.value;
      filtrarProductos(termino);
    });
    
    // Eventos para filtros avanzados
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroPrecioMin = document.getElementById('filtroPrecioMin');
    const filtroPrecioMax = document.getElementById('filtroPrecioMax');
    const limpiarFiltrosBtn = document.getElementById('limpiarFiltros');
    
    filtroCategoria?.addEventListener('change', () => {
      const termino = filtroInput?.value || '';
      filtrarProductos(termino);
    });
    
    filtroPrecioMin?.addEventListener('input', () => {
      const termino = filtroInput?.value || '';
      filtrarProductos(termino);
    });
    
    filtroPrecioMax?.addEventListener('input', () => {
      const termino = filtroInput?.value || '';
      filtrarProductos(termino);
    });
    
    limpiarFiltrosBtn?.addEventListener('click', limpiarFiltros);
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

// === FUNCIÓN GLOBAL PARA LIMPIAR FILTROS (ACCESIBLE DESDE HTML) ===
window.limpiarFiltros = function() {
  document.getElementById('filtroProductos').value = '';
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroPrecioMin = document.getElementById('filtroPrecioMin');
  const filtroPrecioMax = document.getElementById('filtroPrecioMax');
  
  if (filtroCategoria) filtroCategoria.value = '';
  if (filtroPrecioMin) filtroPrecioMin.value = '';
  if (filtroPrecioMax) filtroPrecioMax.value = '';
  
  // Recargar todos los productos
  const filtroInput = document.getElementById('filtroProductos');
  if (filtroInput) {
    const event = new Event('input');
    filtroInput.dispatchEvent(event);
  }
};

// === FUNCIÓN GLOBAL PARA LIMPIAR FILTROS ===
function limpiarFiltros() {
  document.getElementById('filtroProductos').value = '';
  const filtroCategoria = document.getElementById('filtroCategoria');
  const filtroPrecioMin = document.getElementById('filtroPrecioMin');
  const filtroPrecioMax = document.getElementById('filtroPrecioMax');
  
  if (filtroCategoria) filtroCategoria.value = '';
  if (filtroPrecioMin) filtroPrecioMin.value = '';
  if (filtroPrecioMax) filtroPrecioMax.value = '';
  
  // Recargar todos los productos
  const productosGrid = document.getElementById("productosGrid");
  if (productosGrid) {
    const todosLosProductos = carritoGlobal.getProductos();
    // Simular el filtrado con término vacío
    const event = new Event('input');
    const filtroInput = document.getElementById('filtroProductos');
    if (filtroInput) {
      filtroInput.dispatchEvent(event);
    }
  }
}

// === FUNCIÓN GLOBAL PARA AGREGAR PRODUCTO AL CARRITO ===
async function agregarAlCarrito(idProducto) {
  const producto = carritoGlobal.getProductoPorId(idProducto);
  if (!producto) return;
  
  // Verificar si el producto está agotado antes de continuar
  if (producto.estaAgotado()) {
    alert("❌ Este producto está agotado y no se puede agregar al carrito.");
    return;
  }
  
  // Encontrar el botón que se presionó para mostrar estado de carga
  const boton = document.querySelector(`button[data-id="${idProducto}"]`);
  const textoOriginal = boton?.textContent || 'Comprar';
  
  try {
    // Verificar stock de forma asíncrona
    if (boton) {
      boton.textContent = "Verificando...";
      boton.disabled = true;
    }
    
    let cantidad = prompt("¿Cuántas unidades deseas agregar?", "1");
    cantidad = parseInt(cantidad);
    
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("❌ Cantidad inválida. Por favor ingresa un número válido.");
      return;
    }
    
    try {
      // Verificar que la cantidad solicitada esté disponible
      const resultadoStock = await carritoGlobal.verificarStockAsincrono(idProducto, cantidad);
      
      if (!resultadoStock.valido) {
        alert("❌ Error en verificación de stock");
        return;
      }
    } catch (error) {
      if (error.tipo === 'PRODUCTO_AGOTADO') {
        alert(`❌ ${error.message}`);
      } else if (error.tipo === 'STOCK_INSUFICIENTE') {
        alert(`❌ ${error.message}`);
      } else {
        alert(`❌ Error al verificar stock: ${error.message}`);
      }
      return;
    }
    
    if (carritoGlobal.agregarProducto(idProducto, cantidad)) {
      // Mostrar confirmación de agregado
      if (boton) {
        boton.textContent = "✓ Agregado";
        boton.style.backgroundColor = "#28a745";
        setTimeout(() => {
          boton.textContent = textoOriginal;
          boton.disabled = false;
          boton.style.backgroundColor = "";
        }, 1500);
      }
      
      // Actualizar carrito si está abierto
      if (carritoSidebar && carritoSidebar.classList.contains("abierto")) {
        cargarCarrito();
      }
      actualizarNotificacionCarrito();
      actualizarVisualizacionProductos();
      
      // Mostrar mensaje de confirmación
      console.log(`✓ Producto "${producto.getNombre()}" agregado al carrito (${cantidad} unidades)`);
    }
    
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    alert(`❌ Error al agregar el producto: ${error.message}`);
    
  } finally {
    // Restaurar botón en caso de error
    if (boton && boton.disabled) {
      boton.textContent = textoOriginal;
      boton.disabled = false;
      boton.style.backgroundColor = "";
    }
  }
}