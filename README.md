# 🛒 TechGadget Store

TechGadget Store es una tienda online especializada en productos tecnológicos de última generación. La plataforma ofrece una experiencia de compra completa con un catálogo diverso que incluye mouse, teclados, monitores y accesorios tecnológicos.

## 🎯 Descripción del Proyecto

Esta aplicación web simula una tienda de tecnología real con funcionalidades avanzadas de e-commerce. Los usuarios pueden navegar por diferentes categorías de productos, ver detalles específicos, agregar artículos a su carrito de compras y realizar pedidos completos. La página cuenta con un diseño moderno y responsivo que se adapta a cualquier dispositivo.

**Característica destacada:** El sistema de carrito de compras está completamente desarrollado utilizando **Programación Orientada a Objetos (POO)** en JavaScript, implementando clases como `Producto`, `Carrito` y `GestorCarrito` para una arquitectura de código limpia, mantenible y escalable.

Desarrollado como trabajo final de módulo del curso Frontend Trainee 2025.

---

## 🚀 Características principales

### 🛍️ Sistema de E-commerce Completo
✅ **Catálogo de productos tecnológicos** - Smartphones, laptops, tablets, auriculares, smartwatches y más  
✅ **Carga dinámica de productos** desde archivo JSON con información detallada  
✅ **Sistema de paginación inteligente** para navegación eficiente por el catálogo  
✅ **Filtros y búsqueda** para encontrar productos específicos  

### 🛒 Carrito de Compras POO
✅ **Arquitectura orientada a objetos** con clases `Producto`, `Carrito` y `GestorCarrito`  
✅ **Gestión completa del carrito** - agregar, eliminar, modificar cantidades  
✅ **Cálculo automático de totales** con validación de stock  
✅ **Persistencia en localStorage** para mantener el carrito entre sesiones  
✅ **Sidebar flotante** con animaciones suaves y diseño intuitivo  
✅ **Botón flotante fijo** que permanece visible durante el scroll

### 🔐 Sistema de Autenticación y Administración
✅ **Sistema de login** con validación de credenciales  
✅ **Panel de administrador** con acceso restringido  
✅ **Gestión de sesiones** con localStorage/sessionStorage  
✅ **Verificación automática** de permisos de administrador  
✅ **Navegación condicional** según tipo de usuario  

### 🎨 Experiencia de Usuario
✅ **Diseño responsivo** optimizado para móviles, tablets y desktop  
✅ **Modo oscuro/claro** con detección automática de preferencias del sistema  
✅ **Formularios interactivos** de contacto y suscripción con validación  
✅ **Animaciones CSS** y transiciones suaves  
✅ **Notificaciones visuales** para acciones del usuario  

### 🔧 Tecnología y Código
✅ **SASS modular** con arquitectura 7-1 para estilos organizados  
✅ **Bootstrap 5** para componentes y grid system  
✅ **JavaScript ES6+** con clases, módulos y programación funcional  
✅ **Código documentado** y comentado para facilitar el mantenimiento

---

## 📂 Estructura del proyecto

tecnostore-carritoPOO/
│
├── dist/
│ ├── css/
│ │ ├── admin.css
│ │ ├── styles.css
│ │ └── styles.css.map
│ └── js/
│ ├── admin.js
│ ├── auth.js
│ ├── carrito-poo.js
│ ├── scripts-poo.js
│ └── scripts.js
│
├── node_modules/
│
├── pages/
│ ├── admin.html
│ ├── contacto.html
│ ├── home.html
│ └── productos.html
│
├── src/
│ ├── data/
│ │ └── productos.json
│ ├── img/
│ │ ├── ofertas/
│ │ │ ├── oferta-1.jpg
│ │ │ ├── oferta-2.jpg
│ │ │ └── oferta-3.jpg
│ │ └── productos/
│ │ └── (imágenes de productos)
│ └── sass/
│  ├── abstracts/
│  ├── base/
│  ├── components/
│  ├── layout/
│  ├── main.scss
│  ├── pages/
│  └── themes/
│
├── .gitignore
├── index.html (Página de login)
├── package-lock.json
├── package.json
└── README.md

---

## 💻 Tecnologías y Arquitectura

### Frontend
- **HTML5** - Estructura semántica y accesible
- **SCSS/Sass** - Estilos modulares con arquitectura 7-1
- **Bootstrap 5** - Framework CSS para diseño responsivo
- **JavaScript ES6+** - Programación orientada a objetos y funcional

### Arquitectura POO del Carrito
- **Clase Producto** - Encapsula propiedades y métodos de productos individuales
- **Clase Carrito** - Gestiona la colección de productos y operaciones CRUD
- **Clase GestorCarrito** - Controla la interfaz y persistencia del carrito
- **Herencia y Polimorfismo** - Implementación de principios POO avanzados

### Almacenamiento y Datos
- **localStorage** - Persistencia del carrito entre sesiones
- **JSON** - Base de datos de productos con estructura normalizada
- **Session Storage** - Gestión de preferencias temporales

### Herramientas de Desarrollo
- **Sass Compiler** - Compilación automática de estilos
- **Live Server** - Servidor de desarrollo local
- **Git** - Control de versiones

---

## 🏗️ Implementación POO del Carrito de Compras

El sistema de carrito está construido siguiendo los principios de la Programación Orientada a Objetos, proporcionando una arquitectura robusta y escalable:

### 📦 Clase Producto
```javascript
class Producto {
    constructor(id, nombre, precio, imagen, categoria, stock)
    // Métodos: getters, setters, validaciones
}
```
- **Encapsulación**: Propiedades privadas con getters/setters
- **Validación**: Control de stock y datos de entrada
- **Inmutabilidad**: Protección de datos críticos

### 🛒 Clase Carrito
```javascript
class Carrito {
    // Gestión de productos, cálculos y persistencia
    agregarProducto(producto, cantidad)
    eliminarProducto(id)
    calcularTotal()
}
```
- **Abstracción**: Operaciones complejas simplificadas
- **Responsabilidad única**: Cada método tiene una función específica
- **Manejo de errores**: Validaciones y excepciones controladas

### 🎛️ Clase GestorCarrito
```javascript
class GestorCarrito {
    // Interfaz entre el carrito y el DOM
    actualizarInterfaz()
    manejarEventos()
}
```
- **Separación de responsabilidades**: Lógica de negocio vs. presentación
- **Patrón Observer**: Actualización automática de la interfaz
- **Modularidad**: Componentes independientes y reutilizables

### 🔄 Beneficios de la Arquitectura POO
- **Mantenibilidad**: Código organizado y fácil de modificar
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Reutilización**: Clases pueden ser utilizadas en otros proyectos
- **Testabilidad**: Cada clase puede ser probada independientemente
- **Legibilidad**: Código autodocumentado y comprensible

---

## 🛠️ Instalación y Uso

### 📋 Requisitos Previos
- Node.js (para compilación de SASS)
- Navegador web moderno
- Servidor local (recomendado)

### 🚀 Instalación
1. **Clona el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd tecnostore-carritoPOO
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Compila los estilos SASS** (opcional - ya están compilados)
   ```bash
   npm run sass
   ```

### 🌐 Ejecución
1. **Inicia un servidor local**
   ```bash
   # Opción 1: Python
   python -m http.server 8000
   
   # Opción 2: Node.js
   npx http-server
   
   # Opción 3: Live Server (VSCode)
   ```

2. **Accede a la aplicación**
   - Abre `http://localhost:8000` en tu navegador
   - La página principal (`index.html`) es el sistema de login
   - Para acceso de administrador, usa: `admin@correo.cl` / `admin123`

### 🎮 Funcionalidades a Probar
- ✅ **Navegación**: Explora las diferentes páginas (Home, Productos, Contacto)
- ✅ **Carrito POO**: Agrega/elimina productos y observa la persistencia
- ✅ **Sistema de Login**: Prueba el acceso con credenciales de administrador
- ✅ **Panel de Administrador**: Accede a funcionalidades administrativas
- ✅ **Modo Oscuro**: Usa el toggle en el navbar
- ✅ **Responsive**: Prueba en diferentes tamaños de pantalla
- ✅ **Formularios**: Completa los formularios de contacto y suscripción

---

## 🔐 Sistema de Autenticación y Credenciales

### 👤 Credenciales de Administrador
Para acceder al panel de administrador, utiliza las siguientes credenciales:

- **Email**: `admin@correo.cl`
- **Contraseña**: `admin123`

### 🔑 Funcionamiento del Sistema de Login

#### Inicialización Automática
Al cargar la página de login (`index.html`), el sistema automáticamente:
1. **Verifica usuarios existentes** en localStorage
2. **Crea el usuario administrador** si no existe previamente
3. **Guarda las credenciales** de forma segura en el almacenamiento local

#### Proceso de Autenticación
1. **Validación de formulario**: Verifica que los campos no estén vacíos
2. **Búsqueda de usuario**: Compara email y contraseña con los datos almacenados
3. **Creación de sesión**: Si las credenciales son válidas, guarda la sesión del usuario
4. **Redirección automática**: Lleva al usuario a la página principal (`pages/home.html`)

#### Gestión de Sesiones
- **Persistencia**: La sesión se mantiene en localStorage/sessionStorage
- **Verificación automática**: Al cargar cualquier página, se verifica si hay una sesión activa
- **Permisos de administrador**: Se verifica la propiedad `esAdmin` para mostrar opciones administrativas
- **Cierre de sesión**: Limpia completamente los datos de sesión

#### Características de Seguridad
- **Validación de entrada**: Previene campos vacíos y datos inválidos
- **Gestión de errores**: Muestra mensajes claros en caso de credenciales incorrectas
- **Protección de rutas**: Verifica permisos antes de mostrar contenido administrativo
- **Limpieza de sesión**: Elimina todos los datos al cerrar sesión

### 🛡️ Panel de Administrador
Una vez autenticado como administrador, tendrás acceso a:
- **Enlace "Administrador"** visible en la navegación principal
- **Página de administración** con funcionalidades exclusivas
- **Gestión de productos** y configuraciones del sistema
- **Estadísticas y reportes** de la tienda

### 🔄 Flujo de Usuario Completo
1. **Acceso inicial**: Visita `index.html` para el login
2. **Autenticación**: Ingresa las credenciales de administrador
3. **Redirección**: Automáticamente se redirige a `pages/home.html`
4. **Navegación**: El enlace "Administrador" aparece en el menú superior
5. **Administración**: Accede al panel desde el enlace en la navegación
6. **Cierre de sesión**: Usa el botón "Cerrar Sesión" para salir

---

## 🎨 Estilos y organización Sass

El proyecto usa una estructura clara para los estilos:

- **abstracts/**: variables y mixins Sass  
- **base/**: estilos base, tipografía, animaciones  
- **layout/**: header, footer, grillas y carousel  
- **components/**: botones, cards, carrito, enlaces  
- **pages/**: estilos específicos para cada página  
- **themes/**: modo oscuro y otros temas

El archivo principal `main.scss` importa todo en orden para una compilación modular.

---

## 📩 Formularios

- Formulario de suscripción con alerta de agradecimiento  
- Formulario de contacto con validación nativa y alerta  
- Ambos usan JavaScript para mejorar la experiencia sin frameworks externos

---

## 🌗 Modo oscuro

Detecta preferencia del sistema y guarda la elección del usuario en localStorage para mantener el tema activo entre sesiones.

---

## ✍️ Autor

Desarrollado por **José Huerta** ([GitHub](https://github.com/josemhuertab))
