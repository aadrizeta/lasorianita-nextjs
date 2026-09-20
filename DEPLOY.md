# Despliegue en Coolify

La web se despliega en una instancia autoalojada de **Coolify**, que construye
directamente desde el repositorio remoto. Sustituye al método anterior
(GitHub Actions entrando por SSH al VPS y ejecutando `docker compose up --build`),
cuyo workflow se ha eliminado.

- **Build pack:** `Dockerfile`
- **Source:** el repositorio remoto, rama `main`
- **Puerto del contenedor:** `3000`

`docker-compose.yml` ya **no interviene en producción**: queda sólo para
levantar en local la misma imagen que corre desplegada. Coolify aporta su
propio proxy, red y gestión de volúmenes.

> [!IMPORTANT]
> El build pack debe estar en **Dockerfile**. Si queda en *Docker Compose*,
> Coolify lee el `docker-compose.yml` del repositorio y el despliegue falla con
> `network proxy declared as external, but could not be found`, o peor: monta
> `./data` dentro de `/artifacts/<uuid>`, que se recrea en cada despliegue, y
> se pierden la base de solicitudes y los CV.

---

## 1. Migrar los datos ANTES del primer despliegue

> [!WARNING]
> En `/app/data` viven la base SQLite con las **solicitudes de empleo**
> (`lasorianita.db`) y los **CV subidos** (`uploads/`). Si arrancas en Coolify
> sin declarar el volumen persistente, el contenedor empieza vacío y, a partir
> de ahí, **cada redespliegue borra lo que se haya recibido**.

Haz la copia antes de apagar el VPS antiguo.

### 1.1. Sacar los datos del VPS actual

```bash
# En el VPS viejo, dentro del directorio de la app
docker compose stop app                 # que nadie escriba durante la copia
tar czf lasorianita-data.tgz data/
```

Bájate `lasorianita-data.tgz` a un sitio seguro antes de seguir.

### 1.2. Crear la aplicación en Coolify sin arrancarla

Configúrala entera (apartados 2 y 3) pero **no lances el despliegue todavía**.
Necesitas que el volumen exista antes de meterle datos.

### 1.3. Volcar los datos en el volumen nuevo

Tras el primer despliegue (que arrancará con `data/` vacío), para la aplicación
y copia el contenido dentro del volumen. Con el nombre del contenedor que
muestre Coolify:

```bash
# En el servidor de Coolify
docker cp lasorianita-data.tgz <contenedor>:/tmp/
docker exec -u 0 <contenedor> sh -c 'cd /app && tar xzf /tmp/lasorianita-data.tgz && chown -R 1001:1001 /app/data && rm /tmp/lasorianita-data.tgz'
```

El `chown 1001:1001` no es opcional: el contenedor corre como el usuario
`nextjs` (uid 1001) y sin ese cambio no podrá escribir en la base ni guardar
nuevos CV.

### 1.4. Comprobar que los datos están

```bash
docker exec <contenedor> ls -la /app/data /app/data/uploads
```

Y verifica desde la web que `/trabaja-con-nosotros` sigue rechazando un email
ya registrado con el aviso de duplicado: eso demuestra que la tabla
`solicitudes_empleo` conserva las filas.

---

## 2. Almacenamiento persistente

Declara un volumen en la aplicación:

| Ruta en el contenedor | Contenido |
|---|---|
| `/app/data` | `lasorianita.db` y `uploads/<año>/<mes>/` |

Es el único directorio con estado. Todo lo demás es reconstruible desde el
repositorio y el CMS.

---

## 3. Variables de entorno

Todas son de **runtime**. Ninguna hace falta en build.

| Variable | Obligatoria | Notas |
|---|---|---|
| `DB_PATH` | sí | `/app/data/lasorianita.db`. Debe apuntar dentro del volumen. |
| `SMTP_HOST` | sí | Servidor de correo saliente. |
| `SMTP_PORT` | sí | |
| `SMTP_USER` | sí | |
| `SMTP_PASSWORD` | sí | Secreto. |
| `MAIL_FROM` | sí | Remitente de los correos al candidato. |
| `MAIL_NOTIFY` | sí | Buzón que recibe el aviso de cada solicitud. |
| `NEXT_PUBLIC_DIRECTUS_URL` | no | Sólo para apuntar a otro CMS. Ver aviso abajo. |

Si algún día necesitas `NEXT_PUBLIC_DIRECTUS_URL`, en Coolify hay que marcarla
como **variable de build**, no de runtime: Next la resuelve al generar el HTML
estático, así que declararla sólo en runtime no tendría ningún efecto.

Las variables `NEXT_PUBLIC_MAPS_API_KEY` y `NEXT_PUBLIC_MAP_ID` **ya no se
usan**: el mapa de `/encuentranos` pasó al embebido de Google Maps, que no
necesita clave. Puedes borrarlas del VPS antiguo y de los secretos de GitHub.

---

## 4. El build necesita salida a internet

El catálogo se prerenderiza en build: son **48 páginas estáticas** (7 categorías
y 41 productos) generadas leyendo `https://cms.pacomerlos.com`.

Consecuencias prácticas:

- El servidor de Coolify debe poder alcanzar el CMS durante la construcción.
- Si el CMS está caído al construir, **el build no falla**, pero las páginas
  salen con su estado vacío. La capa de datos devuelve listas vacías en lugar
  de lanzar, justo para no dejar la web sin desplegar por una caída ajena.
- Las páginas se revalidan cada **5 minutos** en runtime (`revalidate: 300`),
  así que un cambio en el CMS aparece solo, sin redesplegar.

Para forzar una actualización inmediata del catálogo hay dos vías: redesplegar,
o invalidar el tag de caché `catalogo` (ver `TAG_CATALOGO` en
`src/lib/directus.ts`) si más adelante se añade un endpoint de revalidación.

---

## 5. Dominio y proxy

Asigna el dominio en Coolify y deja que gestione el certificado con su proxy.
No publiques el puerto 3000 al host: el proxy de Coolify habla con el
contenedor por su red interna. Indica `3000` como puerto expuesto para que
sepa a dónde enrutar.

El Dockerfile incluye un `HEALTHCHECK` contra `/`, de modo que Coolify espera a
que la aplicación responda de verdad antes de dar por buena la nueva versión.

---

## 6. Despliegue continuo

Con el repositorio conectado como source, Coolify redespliega al recibir un push
en `main` mediante su webhook. No hace falta ningún workflow de GitHub Actions;
el antiguo `.github/workflows/deploy.yml` se ha eliminado.

Recuerda retirar de GitHub los secretos que ya no usa nadie: `VPS_HOST`,
`VPS_USER`, `VPS_SSH_KEY`, `VPS_APP_DIR`, `NEXT_PUBLIC_MAPS_API_KEY`,
`NEXT_PUBLIC_MAP_ID` y los `INSTAGRAM_*`.

---

## 7. Desarrollo local

```bash
pnpm install
pnpm dev
```

O con Docker, replicando la imagen de producción:

```bash
docker compose up --build
```

Necesita un `.env` en la raíz con las variables `SMTP_*` y `MAIL_*`. Los datos
quedan en `./data`, que está en `.gitignore` porque contiene CV de candidatos.
