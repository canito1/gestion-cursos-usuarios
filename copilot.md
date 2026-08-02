Logros esperados

Emplea fundamentos de TypeScript mediante la aplicación de tipos de datos, funciones tipadas y programación orientada a objetos para asegurar una sintaxis clara y la mantenibilidad del código en el desarrollo de aplicaciones con Angular.

Implementa componentes en Angular siguiendo una arquitectura modular y aplicando directivas, pipes personalizados y librerías de diseño para garantizar la reutilización y escalabilidad en las aplicaciones.

Configura el enrutamiento en Angular gestionando la navegación y la carga dinámica de componentes mediante Guards y rutas personalizadas, con el fin de optimizar la experiencia del usuario en aplicaciones de una sola página (SPA).

Consume servicios REST en Angular utilizando HttpClient e integrando autenticación con JWT para establecer una comunicación eficaz y segura con APIs externas en la recuperación y envío de datos.

Indicaciones:

Contexto o situación problemática:
Una institución educativa necesita digitalizar su sistema de gestión de cursos y usuarios. Actualmente, los procesos son manuales y no hay control sobre el acceso a las funcionalidades, lo que pone en riesgo la seguridad de los datos. Además, los administradores deben gestionar cursos, ver reportes y actualizar datos en diferentes plataformas, lo que complica la experiencia de usuario. Por ello, como parte del equipo tecnológico de la institución, tú y dos compañeros han sido asignados para el desarrollo de una aplicación web que resuelva todos estos inconvenientes, permitiendo gestionar usuarios y cursos de forma centralizada, con seguridad en la navegación.

Pasos:
1.
Diseño de rutas y flujo de navegación:

Definir rutas públicas (login) y rutas protegidas (dashboard, usuarios, cursos).

Implementar rutas anidadas y lazy loading si corresponde.
2.
Implementación de guards de autenticación y autorización:

Crear un guard de autenticación (AuthGuard) para restringir acceso a rutas privadas.

Crear un guard de roles para controlar el acceso a rutas específicas según el tipo de usuario.
3.
Consumo de servicios REST con JWT:

Implementar servicio de login que reciba token JWT desde una API simulada o real.

Almacenar y utilizar el token para realizar peticiones autenticadas con HttpClient.
4.
Interacción con la API:

Implementar servicios Angular para obtener, agregar, editar y eliminar cursos y usuarios desde la API.

Mostrar los datos en tablas o listas dinámicas.
5.
Presentación técnica:

Explicar cómo se configuran las rutas, los guards y cómo se gestiona la autenticación con JWT.

Demostrar la navegación protegida y el consumo de datos desde la API.

Producto:
La aplicación web SPA (Single Page Application) debe ser desarrollada en Angular, cumpliendo con los siguientes requerimientos:

Sistema de login con validación JWT.

Enrutamiento protegido por guards para evitar accesos no autorizados.

Carga dinámica de componentes según el tipo de usuario (admin, profesor, estudiante).

Consumo de una API REST externa usando HttpClient para obtener, crear, actualizar y eliminar información de cursos y usuarios.

Interfaz clara y fluida como una SPA, usando rutas personalizadas para una navegación optimizada.Indicaciones:

Contexto o situación problemática:
Una institución educativa necesita digitalizar su sistema de gestión de cursos y usuarios. Actualmente, los procesos son manuales y no hay control sobre el acceso a las funcionalidades, lo que pone en riesgo la seguridad de los datos. Además, los administradores deben gestionar cursos, ver reportes y actualizar datos en diferentes plataformas, lo que complica la experiencia de usuario. Por ello, como parte del equipo tecnológico de la institución, tú y dos compañeros han sido asignados para el desarrollo de una aplicación web que resuelva todos estos inconvenientes, permitiendo gestionar usuarios y cursos de forma centralizada, con seguridad en la navegación.

Pasos:
1.
Diseño de rutas y flujo de navegación:

Definir rutas públicas (login) y rutas protegidas (dashboard, usuarios, cursos).

Implementar rutas anidadas y lazy loading si corresponde.
2.
Implementación de guards de autenticación y autorización:

Crear un guard de autenticación (AuthGuard) para restringir acceso a rutas privadas.

Crear un guard de roles para controlar el acceso a rutas específicas según el tipo de usuario.
3.
Consumo de servicios REST con JWT:

Implementar servicio de login que reciba token JWT desde una API simulada o real.

Almacenar y utilizar el token para realizar peticiones autenticadas con HttpClient.
4.
Interacción con la API:

Implementar servicios Angular para obtener, agregar, editar y eliminar cursos y usuarios desde la API.

Mostrar los datos en tablas o listas dinámicas.
5.

Explicar cómo se configuran las rutas, los guards y cómo se gestiona la autenticación con JWT.

Demostrar la navegación protegida y el consumo de datos desde la API.

Producto:
La aplicación web SPA (Single Page Application) debe ser desarrollada en Angular, cumpliendo con los siguientes requerimientos:

Sistema de login con validación JWT.

Enrutamiento protegido por guards para evitar accesos no autorizados.

Carga dinámica de componentes según el tipo de usuario (admin, profesor, estudiante).

Consumo de una API REST externa usando HttpClient para obtener, crear, actualizar y eliminar información de cursos y usuarios.

Interfaz clara y fluida como una SPA, usando rutas personalizadas para una navegación optimizada.

implementa el backend en  base al frontend en TypeScript, Node.js, Express, MongoDB, Mongoose y crea la base de datos