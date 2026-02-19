# Plan de desarrollo — Sistema de solicitudes de empleo

> Fecha: 2026-02-19
> Proyecto: lasorianita-nextjs
> Fase: 2 — Completar formulario + Dashboard de RRHH (`empleo.lasorianita.es`)

---

## 1. Estado actual

Lo siguiente ya está implementado en `lasorianita-nextjs`:

| Archivo | Estado |
| --- | --- |
| `src/app/trabaja-con-nosotros/page.tsx` | ✅ Página pública del formulario |
| `src/components/layout/trabaja-con-nosotros/job-form.tsx` | ✅ Formulario completo con validación client-side, drag & drop |
| `src/app/api/solicitud-empleo/route.ts` | ✅ Endpoint POST con rate limiting, validación server-side, guardado de archivos |
| `src/lib/db.ts` | ✅ SQLite con `better-sqlite3`, tabla `solicitudes_empleo` |
| `src/lib/mail.ts` | ✅ Correo de confirmación al aspirante + notificación a la empresa |
| `src/lib/validation.ts` | ✅ Validación compartida (client/server), magic bytes check |
| `docker-compose.yml` | ✅ Volumen `app-data` montado en `/app/data` |

**Schema de la tabla `solicitudes_empleo`:**
```sql
id, nombre, apellidos, fecha_nacimiento, email, telefono,
archivos (JSON), estado, ip_address, created_at
```

**Flujo actual funcional:**
Usuario rellena formulario → POST a `/api/solicitud-empleo` → Archivos guardados en `/app/data/uploads/YYYY/MM/` → Registro en SQLite → Dos correos enviados.

---

## 2. Trabajo pendiente en el formulario público (Fase 1)

Antes de pasar al dashboard hay pequeños flecos que completar:

### 2.1 Página de política de privacidad
- El formulario enlaza a `/politica-de-privacidad` (target=_blank). Verificar que existe o crearla.
- Debe mencionar explícitamente el tratamiento de datos de candidatos (RGPD).

### 2.2 Columna `nota_interna` en la BD
- Añadir columna opcional en `solicitudes_empleo` para que el equipo añada comentarios internos desde el dashboard.
- Migración: `ALTER TABLE solicitudes_empleo ADD COLUMN nota_interna TEXT DEFAULT ''`.

### 2.3 Campo `mensaje` opcional en el formulario
- Textarea opcional para que el candidato añada un mensaje libre.
- Añadir a `validation.ts`, `job-form.tsx`, `route.ts` y al schema de la BD.

---

## 3. Arquitectura de la nueva aplicación (`empleo.lasorianita.es`)

### 3.1 Decisión arquitectónica: monorepo con dos apps Next.js

La aplicación del dashboard se implementa como una **segunda aplicación Next.js independiente** dentro del mismo repositorio, usando la estructura de monorepo que ya indica `pnpm-workspace.yaml`.

```
lasorianita-nextjs/                  ← raíz del monorepo
├── apps/
│   ├── web/                         ← app pública actual (mover src/ aquí)
│   └── empleo/                      ← NUEVO dashboard de RRHH
├── packages/
│   └── db/                          ← NUEVO paquete compartido (db.ts, tipos)
├── pnpm-workspace.yaml
└── docker-compose.yml
```

> **Alternativa más sencilla (recomendada si no se quiere refactorizar):**
> Crear `apps/empleo/` como app Next.js nueva sin mover la app actual.
> La app actual sigue en `src/` en la raíz y la nueva va en `apps/empleo/`.
> Ambas comparten el volumen Docker con la BD y los uploads.

### 3.2 Acceso a la base de datos

Ambas apps acceden al **mismo archivo SQLite** a través del volumen Docker `app-data`:

- App pública (`lasorianita`): `DB_PATH=/app/data/lasorianita.db` (ya configurado)
- App dashboard (`empleo`): `DB_PATH=/app/data/lasorianita.db` (mismo archivo, mismo volumen)

SQLite en modo WAL soporta múltiples lectores concurrentes. Las escrituras desde el dashboard son esporádicas, por lo que no hay riesgo de contención.

### 3.3 Estructura del contenedor del dashboard

```yaml
# En docker-compose.yml (añadir servicio)
empleo:
  build:
    context: ./apps/empleo
  container_name: lasorianita-empleo
  restart: unless-stopped
  environment:
    - DB_PATH=/app/data/lasorianita.db
    - UPLOADS_DIR=/app/data/uploads
    - SESSION_SECRET=${EMPLEO_SESSION_SECRET}
    - SMTP_HOST=${SMTP_HOST}
    - SMTP_PORT=${SMTP_PORT}
    - MAIL_FROM=${MAIL_FROM}
  volumes:
    - app-data:/app/data        # mismo volumen que la app pública
  ports:
    - "3001:3000"
  networks:
    - proxy
```

El proxy inverso (Nginx/Caddy en el VPS) enruta:
- `lasorianita.es` → container `lasorianita:3000`
- `empleo.lasorianita.es` → container `lasorianita-empleo:3001`

---

## 4. Schema de base de datos — extensiones necesarias

### 4.1 Tabla `usuarios_empleo` (nueva)

```sql
CREATE TABLE IF NOT EXISTS usuarios_empleo (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,          -- bcrypt
  nombre      TEXT NOT NULL,
  rol         TEXT NOT NULL DEFAULT 'lectura',  -- 'lectura' | 'escritura'
  activo      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now')),
  last_login  TEXT
);
```

Los usuarios se crean mediante un **script de seed** ejecutado manualmente en el servidor (no hay registro público). El primer usuario admin se crea con el script `scripts/create-user.ts`.

### 4.2 Tabla `sesiones_empleo` (nueva)

```sql
CREATE TABLE IF NOT EXISTS sesiones_empleo (
  id          TEXT PRIMARY KEY,          -- UUID v4
  usuario_id  INTEGER NOT NULL REFERENCES usuarios_empleo(id),
  expires_at  TEXT NOT NULL,
  created_at  TEXT DEFAULT (datetime('now'))
);
```

### 4.3 Columnas adicionales en `solicitudes_empleo`

```sql
ALTER TABLE solicitudes_empleo ADD COLUMN nota_interna TEXT DEFAULT '';
ALTER TABLE solicitudes_empleo ADD COLUMN mensaje TEXT DEFAULT '';
ALTER TABLE solicitudes_empleo ADD COLUMN revisado_por TEXT DEFAULT '';
ALTER TABLE solicitudes_empleo ADD COLUMN revisado_at TEXT DEFAULT NULL;
```

El campo `estado` ya existe con valor por defecto `'pendiente'`. Los estados posibles serán:
- `pendiente` — recién recibida, sin revisar
- `en_revision` — alguien la está revisando
- `guardada` — perfil interesante para más adelante
- `rechazada` — descartada
- `contratada` — proceso completado con éxito

---

## 5. Autenticación del dashboard

### 5.1 Estrategia: sesiones con cookie httpOnly

- Al hacer login, se genera un `session_id` (UUID) que se guarda en la tabla `sesiones_empleo` y se envía al cliente como cookie `httpOnly; Secure; SameSite=Strict`.
- En cada request protegido, el middleware de Next.js lee la cookie, valida la sesión en la BD y adjunta el usuario al contexto.
- Las sesiones expiran en **8 horas** (configurable).
- No se usa ninguna librería externa de auth para minimizar dependencias — implementación manual con `bcryptjs` para el hash de contraseñas.

### 5.2 Rutas de autenticación

```
POST /api/auth/login     — valida credenciales, crea sesión, devuelve cookie
POST /api/auth/logout    — invalida sesión en BD, borra cookie
GET  /api/auth/me        — devuelve usuario actual (para client-side)
```

### 5.3 Middleware de protección

`middleware.ts` en `apps/empleo/` aplica a todas las rutas excepto `/login`:

```
/login          → público
/               → requiere sesión (cualquier rol)
/solicitudes/*  → requiere sesión (cualquier rol)
/admin/*        → requiere rol 'escritura'
```

---

## 6. Estructura del dashboard — páginas y componentes

```
apps/empleo/src/
├── app/
│   ├── layout.tsx                    ← Layout con sidebar y header
│   ├── login/
│   │   └── page.tsx                  ← Formulario de login
│   ├── page.tsx                      ← Redirige a /solicitudes
│   ├── solicitudes/
│   │   ├── page.tsx                  ← Lista de solicitudes (tabla)
│   │   └── [id]/
│   │       └── page.tsx              ← Detalle de una solicitud
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── solicitudes/
│       │   ├── route.ts              ← GET lista (con filtros/ordenación)
│       │   └── [id]/
│       │       ├── route.ts          ← GET detalle, PATCH estado/nota, DELETE
│       │       └── archivos/[nombre]/route.ts  ← Servir archivo para descarga
│       └── usuarios/
│           └── route.ts              ← GET/POST usuarios (solo rol 'escritura')
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── solicitudes/
│   │   ├── SolicitudesTable.tsx      ← Tabla con sorting y filtros
│   │   ├── SolicitudCard.tsx         ← Vista de detalle
│   │   ├── EstadoBadge.tsx           ← Badge de color por estado
│   │   └── AccionesBar.tsx           ← Botones cambiar estado / borrar
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       └── Modal.tsx                 ← Confirmación de borrado
└── lib/
    ├── db.ts                         ← Reutiliza la misma lógica
    ├── auth.ts                       ← getSession(), requireSession()
    └── solicitudes.ts                ← Queries de la BD
```

---

## 7. Funcionalidades del dashboard — detalle

### 7.1 Página de login (`/login`)
- Formulario usuario + contraseña
- Mensaje de error genérico si las credenciales son incorrectas (no revelar si el usuario existe)
- Redirect a `/solicitudes` tras login exitoso
- Si ya hay sesión activa, redirigir directamente

### 7.2 Lista de solicitudes (`/solicitudes`)

**Columnas de la tabla:**
| Columna | Descripción |
|---|---|
| # | ID |
| Nombre completo | nombre + apellidos |
| Email | enlace mailto |
| Teléfono | |
| Fecha solicitud | created_at formateada |
| Estado | Badge de color (pendiente=gris, en_revision=azul, guardada=amarillo, rechazada=rojo, contratada=verde) |
| Archivos | Número de archivos adjuntos |
| Acciones | Ver detalle |

**Filtros y ordenación:**
- Ordenar por: fecha (asc/desc), nombre, estado
- Filtrar por estado (select múltiple)
- Buscador por nombre/email (búsqueda client-side sobre los datos cargados, o con debounce a la API)
- Paginación: 25 por página

### 7.3 Vista de detalle (`/solicitudes/[id]`)

**Datos mostrados:**
- Nombre completo, email, teléfono, fecha de nacimiento, fecha de solicitud
- IP de origen (solo visible para rol escritura)
- Mensaje del candidato (si existe)
- Estado actual con selector para cambiar (solo rol escritura)
- Archivos adjuntos: lista con nombre, tamaño y botón de descarga individual
- Nota interna (textarea editable, solo rol escritura)
- Histórico implícito: `revisado_por` y `revisado_at`

**Acciones disponibles según rol:**

| Acción | Lectura | Escritura |
|---|---|---|
| Ver datos | ✅ | ✅ |
| Descargar archivos | ✅ | ✅ |
| Cambiar estado | ❌ | ✅ |
| Añadir nota interna | ❌ | ✅ |
| Eliminar solicitud | ❌ | ✅ |

### 7.4 Descarga de archivos

Los archivos están en el volumen Docker en `/app/data/uploads/YYYY/MM/nombre-seguro.pdf`.
La ruta `GET /api/solicitudes/[id]/archivos/[nombre]` verifica:
1. Que la sesión es válida
2. Que el archivo pertenece a esa solicitud (consulta en BD)
3. Sirve el archivo con `Content-Disposition: attachment`

**Nunca se expone la ruta real del disco.** El nombre en la URL es el nombre original del archivo, pero se busca en la BD el path real.

### 7.5 Cambio de estado

`PATCH /api/solicitudes/[id]` — body: `{ estado, nota_interna }`
Requiere rol `escritura`. Actualiza `estado`, `nota_interna`, `revisado_por` (username del usuario en sesión) y `revisado_at`.

### 7.6 Eliminación de solicitudes

`DELETE /api/solicitudes/[id]` — requiere rol `escritura`.
- Muestra modal de confirmación antes de enviar la petición
- Elimina el registro de la BD
- **No elimina los archivos del disco** (se conservan por si acaso; una tarea de limpieza periódica puede gestionarlos)
- Alternativamente: borrado lógico añadiendo columna `deleted_at`

---

## 8. Stack tecnológico del dashboard

| Tecnología | Justificación |
|---|---|
| **Next.js 15+ (App Router)** | Consistencia con la app principal |
| **better-sqlite3** | Ya en uso, evita añadir un servidor de BD |
| **bcryptjs** | Hash de contraseñas (puro JS, sin compilación nativa) |
| **Tailwind CSS v4** | Consistencia con la app principal |
| **TypeScript** | Ya en uso |

No se añaden librerías de autenticación externas (next-auth, etc.) para mantener la simplicidad y el control total.

---

## 9. Consideraciones de seguridad

- **Cookies httpOnly + Secure + SameSite=Strict** para las sesiones
- **CSRF**: al usar SameSite=Strict las mutaciones POST/PATCH/DELETE están protegidas
- **Archivos**: nunca servir directamente desde el filesystem con rutas predecibles; siempre pasar por la API que verifica la sesión
- **Contraseñas**: bcrypt con factor de coste ≥ 12
- **Rate limiting en login**: máximo 5 intentos por IP en 15 minutos; bloqueo temporal
- **Subdominio interno**: considerar restricción por IP en el proxy inverso si se quiere una capa adicional
- **Headers de seguridad**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, CSP restrictivo
- **Inputs**: toda la información se muestra escapada; los archivos se sirven como `attachment` nunca como `inline` para PDFs en el contexto del dashboard

---

## 10. Infraestructura y despliegue

### 10.1 Cambios en `docker-compose.yml`

- Añadir servicio `empleo` con su propio `Dockerfile` en `apps/empleo/`
- Montar el mismo volumen `app-data` para compartir BD y uploads
- Exponer en puerto `3001` (o cualquier puerto libre)
- Añadir variable `EMPLEO_SESSION_SECRET` al `.env` del servidor

### 10.2 Configuración del proxy inverso

En el VPS, añadir una nueva entrada en Nginx/Caddy para `empleo.lasorianita.es` apuntando al puerto `3001`.

Ejemplo en Caddy:
```
empleo.lasorianita.es {
    reverse_proxy lasorianita-empleo:3001
}
```

### 10.3 Creación de usuarios iniciales

Script `apps/empleo/scripts/create-user.ts` ejecutable con:
```bash
docker exec lasorianita-empleo node scripts/create-user.js --username admin --nombre "Admin" --rol escritura
```
Pedirá la contraseña de forma interactiva (no como argumento).

---

## 11. Orden de implementación sugerido

```
[ ] 1. Completar Fase 1: columnas adicionales en BD (nota_interna, mensaje)
[ ] 2. Crear estructura monorepo: apps/empleo/ con Next.js
[ ] 3. Implementar db.ts del dashboard (reutilizar lógica + nuevas tablas)
[ ] 4. Implementar autenticación: tablas, API routes, middleware
[ ] 5. Implementar página de login
[ ] 6. Implementar API GET /solicitudes con filtros y paginación
[ ] 7. Implementar página lista de solicitudes (tabla)
[ ] 8. Implementar API GET /solicitudes/[id] y página de detalle
[ ] 9. Implementar descarga de archivos (API route protegida)
[ ] 10. Implementar PATCH estado/nota y DELETE (solo rol escritura)
[ ] 11. Implementar script de creación de usuarios
[ ] 12. Actualizar docker-compose.yml con nuevo servicio
[ ] 13. Configurar proxy inverso en VPS para empleo.lasorianita.es
[ ] 14. Testing manual del flujo completo
[ ] 15. Crear primer usuario administrador en producción
```

---

## 12. Variables de entorno necesarias (nuevas)

```bash
# Para el servicio empleo en docker-compose / .env del servidor
EMPLEO_SESSION_SECRET=una-cadena-aleatoria-larga-y-segura
DB_PATH=/app/data/lasorianita.db
UPLOADS_DIR=/app/data/uploads
```

---

*Plan generado el 2026-02-19. Revisión recomendada antes de iniciar la implementación.*
