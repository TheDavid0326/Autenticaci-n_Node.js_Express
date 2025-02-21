# Proyecto de Autenticación con Node.js y Express

Este proyecto es una aplicación de autenticación básica construida con Node.js, Express y varias tecnologías modernas. Permite a los usuarios registrarse, iniciar sesión, cerrar sesión y acceder a rutas protegidas. Además, utiliza JWT (JSON Web Tokens) para la gestión de sesiones y cookies para almacenar tokens de acceso y refresco.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para construir aplicaciones web y APIs en Node.js.
- **EJS**: Motor de plantillas para generar HTML dinámico.
- **JWT (JSON Web Tokens)**: Para la autenticación y gestión de sesiones.
- **bcrypt**: Para el hashing de contraseñas.
- **Axios**: Para realizar solicitudes HTTP internas.
- **Zod**: Para la validación de esquemas de datos.
- **db-local**: Base de datos local para almacenar usuarios.
- **Cookie-parser**: Middleware para manejar cookies en Express.

## Estructura del Proyecto

- **`index.js`**: Punto de entrada de la aplicación. Configura el servidor Express, define las rutas y maneja la lógica de autenticación.
- **`user-repository.js`**: Contiene la lógica para interactuar con la base de datos de usuarios, incluyendo la creación de usuarios y la autenticación.
- **`user.js`**: Define el esquema de validación para los usuarios utilizando Zod.
- **`index.ejs`**: Vista principal que contiene los formularios de registro y login, así como la lógica para manejar las interacciones del usuario.

## Aprendizajes Clave

1. **Autenticación con JWT**:
   - Uso de tokens de acceso y refresco para gestionar sesiones.
   - Implementación de un mecanismo para renovar tokens de acceso expirados utilizando tokens de refresco.

2. **Validación de Datos**:
   - Uso de Zod para validar los datos de entrada del usuario, asegurando que cumplan con los requisitos antes de ser procesados.

3. **Seguridad**:
   - Hashing de contraseñas con bcrypt para almacenarlas de manera segura.
   - Uso de cookies seguras (httpOnly, secure, sameSite) para almacenar tokens.

4. **Manejo de Cookies**:
   - Uso de `cookie-parser` para manejar cookies en las solicitudes y respuestas HTTP.
   - Configuración de cookies con opciones de seguridad para prevenir ataques como XSS y CSRF.

5. **Rutas Protegidas**:
   - Implementación de middleware para proteger rutas y asegurar que solo usuarios autenticados puedan acceder a ciertas partes de la aplicación.

6. **Interacción con el Frontend**:
   - Uso de EJS para renderizar vistas dinámicas en el servidor.
   - Manejo de formularios y respuestas AJAX para una experiencia de usuario fluida.

## Cómo Ejecutar el Proyecto

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
  ```

2. Instala las dependencias:

   ``` bash
   npm install
   ```

3. Configura las variables de entorno:
Crea un archivo .env o config.js en la raíz del proyecto y define las siguientes variables:

   ```env
   PORT=3000
   SECRET_JWT_KEY=tu_clave_secreta_jwt
   SECRET_REFRESH_JWT_KEY=tu_clave_secreta_refresh_jwt
   SALT_ROUNDS=10
   ```
4. Inicia el servidor:

   ```
   npm run dev
   ```

5. Abre tu navegador y visita http://localhost:3000 para ver la aplicación en funcionamiento.

## Rutas Disponibles

- **GET /**: Página principal con formularios de login y registro.
- **POST /login**: Autentica al usuario y devuelve tokens de acceso y refresco.
- **POST /register**: Registra un nuevo usuario.
- **POST /logout**: Cierra la sesión del usuario.
- **GET /protected**: Ruta protegida que solo pueden acceder usuarios autenticados.
- **POST /refresh**: Renueva el token de acceso utilizando el token de refresco.

## Licencia
Este proyecto está bajo la licencia MIT.

¡Gracias por revisar este proyecto! Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue o contactarme directamente.
