# Gestión de Cursos y Usuarios

## Estructura
- `backend/`: API Node.js + Express con JWT simulado.
- `frontend/`: SPA Angular con login, guards, usuarios, cursos y consumo de API.

## Instrucciones

### Backend
1. Abrir `backend`.
2. Ejecutar `npm install`.
3. Ejecutar `npm run dev`.
4. API disponible en `http://localhost:4000`.

### Frontend
1. Abrir `frontend`.
2. Ejecutar `npm install`.
3. Ejecutar `npm start`.
4. Acceder a `http://localhost:4200`.

## Usuarios de prueba
- admin / admin123
- profesor / profesor123
- estudiante / estudiante123

## Funcionalidad
- Login con JWT.
- Rutas protegidas con `AuthGuard`.
- Control de acceso por rol con `RoleGuard`.
- Gestión de usuarios para `admin`.
- Gestión de cursos para `admin` y `profesor`.
