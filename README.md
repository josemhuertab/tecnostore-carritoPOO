# 🛒 TechGadget Store

TechGadget Store es una tienda online especializada en productos tecnológicos de última generación. La plataforma ofrece una experiencia de compra completa con un catálogo diverso que incluye smartphones, laptops, tablets, auriculares, smartwatches y accesorios tecnológicos.

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

techgadget-store/
│
├── dist/
│ ├── css/
│ │ ├── style.css
│ │ └── style.css.map
│ └── js/
│ └── scripts.js
│
├── node_modules/
│
├── pages/
│ ├── index.html
│ ├── products.html
│ ├── contact.html
│ └── faq.html
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
│  ├── pages/
│  └── themes/
│
├── .gitignore
├── index.html (Login simulado)
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
   - Navega a `pages/index.html` para comenzar

### 🎮 Funcionalidades a Probar
- ✅ **Navegación**: Explora las diferentes páginas (Home, Productos, Contacto)
- ✅ **Carrito POO**: Agrega/elimina productos y observa la persistencia
- ✅ **Modo Oscuro**: Usa el toggle en el navbar
- ✅ **Responsive**: Prueba en diferentes tamaños de pantalla
- ✅ **Formularios**: Completa los formularios de contacto y suscripción

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
