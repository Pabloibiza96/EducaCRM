# EducaCRM

Aplicación web para la gestión académica de un centro educativo: alumnos, profesores, grupos, asignaturas, departamentos, usuarios, calificaciones y reportes. Stack: Angular (frontend), Node.js + Express + TypeORM (backend) y MySQL 8, con despliegue completo vía Docker.

## 1. Funcionalidades
- Autenticación con control de acceso por roles: alumno, profesor, jefatura, dirección, administrador.
- CRUD de alumnos, profesores, grupos, asignaturas, departamentos, usuarios y calificaciones.
- Gestión académica: matrículas de alumnos en grupos y asignación de profesores a asignaturas por grupo.
- Reportes: medias globales por alumno y resumen individual (medias por evaluación y por asignatura/evaluación).
- UI responsive con Bootstrap 5.

## 2. Tecnologías
- Frontend: Angular 20 + TypeScript + Bootstrap 5.
- Backend: Node.js 22 + Express + TypeORM.
- Base de datos: MySQL 8.
- Contenedores: Docker + Docker Compose.

## 3. Estructura del repositorio (monorepo)
- `backend/educaCRM-api/` → API REST Express + TypeORM.
- `frontend/front-educaCRM/educaCRM/` → Aplicación Angular standalone.
- `educacrm.sql` → Script de creación y datos seed.
- `docker-compose.yml` → Orquestación (db + api + front).
- `frontend/front-educaCRM/educaCRM/nginx.conf` → Proxy del front para `/api` en Docker.

## 4. Requisitos
- Sin Docker: Node.js 18+ (recomendado 22), npm 9+, MySQL 8.
- Con Docker (recomendado): Docker Desktop + Docker Compose v2.

## 5. Ejecución en desarrollo (sin Docker)
### Backend
1) Ir a `backend/educaCRM-api`.
2) Instalar dependencias: `npm install`.
3) Crear `.env` (ver sección 7).
4) Arrancar: `npm run dev`.
5) API en `http://localhost:3000/api`.

### Frontend
1) Ir a `frontend/front-educaCRM/educaCRM`.
2) Instalar dependencias: `npm install`.
3) Arrancar Angular: `ng s`.
4) App en `http://localhost:4200`.

Nota: en desarrollo, `API_BASE = http://localhost:3000/api` (ver `src/app/app.config.ts`).

## 6. Ejecución con Docker
1) Situarse en la raíz (donde está `docker-compose.yml`).
2) Levantar stack: `docker compose up --build` (o `docker compose up -d --build`).
3) Accesos:
   - Frontend: `http://localhost:4200`
   - Backend: `http://localhost:3000/api`
   - MySQL: `localhost:3306` (si está libre). Si choca, cambia el mapeo a `3307:3306` en `docker-compose.yml`.

## 7. Variables de entorno (backend)
Archivo: `backend/educaCRM-api/.env`
```env
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=educacrm
JWT_SECRET=una_clave_segura
PORT=3000
```

## 8. Usuarios de prueba
- Administrador: `admin / admin123`
- Profesor: `agarcia / agarcia123`
- Alumno: `lperez / lperez123`

## 9. Scripts útiles
- Backend: `npm run dev` (watch), `npm start` (prod).
- Frontend: `ng s` (dev).
- Docker: `docker compose up --build`, `docker compose down`, `docker compose down -v` (resetea BD seed).

## 10. Troubleshooting rápido
- ECONNREFUSED MySQL en Docker: la BD tarda unos segundos en levantar. Revisa logs y que `DB_HOST=db`.
- 404 en `/api/...` desde el front Docker: revisa `frontend/front-educaCRM/educaCRM/nginx.conf` (proxy a `educacrm-api:3000`).
- Puerto 3306 ocupado: cambia el puerto expuesto (ej. `3307:3306`).
- BD vacía o sin datos seed: `docker compose down -v` y vuelve a levantar para reimportar `educacrm.sql`.

## 11. Licencia
Proyecto académico realizado por Pablo Ibiza Granados. Uso educativo.
