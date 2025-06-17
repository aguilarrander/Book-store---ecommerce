DOCUMENTACIÓN DEL SISTEMA BOOKSTORE ECOMMERCE
Nombre del Proyecto:
Bookstore Ecommerce - Sistema de Tienda de Libros Full Stack

Descripción General:
Este proyecto es una plataforma de comercio electrónico enfocada en la venta de libros. Permite a los usuarios registrarse, iniciar sesión, navegar por el catálogo de libros, agregar productos al carrito de compras y finalizar compras mediante un sistema de órdenes. Además, cuenta con un sistema de administración de usuarios y productos accesible únicamente para los administradores.

Este proyecto ha sido desarrollado como parte de la prueba técnica para el puesto de Desarrollador Web Full Stack.

Tecnologías Utilizadas:

Backend:
Node.js
Express.js
PostgreSQL
JWT (JSON Web Token)
Bcrypt (para encriptación de contraseñas)
Axios (para pruebas internas)
dotenv (manejo de variables de entorno)

Frontend:
Next.js (React Framework)
React Hooks
Axios
TailwindCSS
Next Router
React Context API
Validaciones de formularios con feedback
Principales Funcionalidades Implementadas:
Registro e inicio de sesión seguro mediante JWT.
Control de roles diferenciados (Admin / Usuario).
Gestión completa de productos (CRUD de libros para admin).
Administración completa de usuarios (CRUD de usuarios para admin).
Carrito de compras totalmente funcional.
Flujo de checkout con registro de órdenes.
Búsqueda de libros por nombre.
Paginación automática de libros (10 libros por página).
Visualización de nombre de usuario logueado.
Cierre de sesión funcional.
Protección de rutas en frontend y backend.
Validaciones tanto en frontend como en backend.
Código completamente modularizado y profesional.

Estructura General del Proyecto:
bookstore-ecommerce/
│
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/app/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
└── README.md
Proceso de Instalación y Ejecución:
1️⃣ Clonar el Repositorio:
bash
Copiar
Editar
git clone https://github.com/tu-usuario/bookstore-ecommerce.git
cd bookstore-ecommerce
2️⃣ Configuración del Backend:
bash
Copiar
Editar
cd backend
npm install
Crear el archivo de variables de entorno .env:
env
Copiar
Editar
PORT=4000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/bookstore
JWT_SECRET=clave_secreta_personal
Script de Creación de Base de Datos (PostgreSQL):
sql
Copiar
Editar
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  book_id INT REFERENCES books(id),
  quantity INT DEFAULT 1
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  book_id INT REFERENCES books(id),
  quantity INT,
  price DECIMAL(10,2)
);
Iniciar el Backend:
bash
Copiar
Editar
npm start
3️⃣ Configuración del Frontend:
bash
Copiar
Editar
cd frontend
npm install
npm run dev

Rutas de la Aplicación:
Ruta		Descripción				Protegida
/		Página principal con libros		No
/login		Login de usuarios			No
/register	Registro de nuevos usuarios		No
/cart		Carrito de compras			Sí
/orders		Visualización de órdenes realizadas	Sí
/admin		Administración de usuarios (solo Admin)	Sí
/admin/books	Administración de libros (solo Admin)	Sí

Criterios Técnicos Cumplidos (Requisitos de la Prueba):

Registro e inicio de sesión seguro.
Manejo de roles de usuario.
Gestión de usuarios por parte del administrador.
Gestión completa de productos (libros).
Implementación de carrito de compras.
Flujo de compra con órdenes.
Búsqueda por nombre de producto.
Paginación automática.
Visualización de nombre de usuario activo.
Validación y manejo de errores en frontend y backend.
Código limpio, modular, documentado y mantenible.

Créditos:
Desarrollador:
Rander Darío Aguilar Guevara

Prueba Técnica:
Desarrollador Web Full Stack
