# La Sorianita — Documentación del proyecto

> Web oficial del obrador artesanal **La Sorianita** (Madrid, desde 1955) → <https://lasorianita.es>
> Repositorio: `lasorianita-nextjs` · Fecha del documento: 20 de septiembre de 2026

---

## 1. Idea del proyecto y público objetivo

### Idea

La Sorianita es un obrador de pan y pastelería artesanal con más de 70 años de
historia en Madrid, gestionado por tres generaciones de la misma familia. El
proyecto consiste en su **web corporativa de nueva imagen**: un escaparate
digital que traslada el posicionamiento del obrador (tradición, fermentación
lenta de 24 h, materias primas nacionales, producto del día) a un sitio rápido,
accesible y bien indexado.

**No es una tienda online.** No hay carrito ni pasarela de pago: los precios que
se muestran son orientativos y el objetivo es que el visitante conozca el
producto y acabe entrando por la puerta o llamando. El sitio se articula en
cuatro funciones:

| Función | Ruta | Qué resuelve |
|---|---|---|
| Presentación de marca | `/` | Hero, legado familiar, proceso artesanal, esencia del obrador |
| Catálogo de producto | `/catalogo`, `/catalogo/[categoria]`, `/catalogo/[categoria]/[slug]` | 7 familias y 41 productos con precio orientativo, formato, peso, ingredientes y alérgenos |
| Localización y contacto | `/encuentranos` | Dirección, horarios, teléfono, email y mapa de la tienda |
| Captación de personal | `/trabaja-con-nosotros` | Formulario de candidatura con subida de CV, almacenamiento y avisos por correo |
| Legal | `/politica-de-privacidad` | Tratamiento de datos (RGPD), incluido el de candidatos |

### Público objetivo

1. **Cliente de barrio y de proximidad (principal).** Vecinos de Madrid que
   buscan el obrador, su horario o quieren ver qué se hornea cada día. Consumen
   la web mayoritariamente desde el móvil, lo que ha condicionado buena parte de
   las decisiones técnicas (ver §4).
2. **Cliente que busca producto concreto o por encargo.** Llega desde búsquedas
   tipo «tarta por encargo Madrid», «pan de masa madre», o buscando información
   de alérgenos antes de comprar. Es el público al que sirve el catálogo
   detallado con alérgenos y trazas por producto.
3. **Candidatos a empleo.** Personas que quieren trabajar en el obrador. Tienen
   su propio circuito: formulario público → base de datos → panel interno de
   RRHH (`empleo.lasorianita.es`, en desarrollo).
4. **La propia empresa como usuaria interna.** El contenido del catálogo lo
   mantiene el obrador desde un CMS sin tocar código, y las candidaturas les
   llegan por correo con enlace al panel.

---

## 2. API y fuentes de datos

El proyecto combina **cuatro** orígenes de datos distintos, cada uno con un rol
claro:

### 2.1 Directus (CMS headless) — catálogo de producto

Fuente principal de contenido dinámico. Instancia propia de **Directus 12** en
`https://cms.pacomerlos.com`, consumida vía su **API REST** (`/items/...`) en
modo solo lectura.

- **Colecciones usadas:** `categorias` (7 registros), `productos` (41) y
  `alergenos`, más la tabla puente de alérgenos y la relación de galería
  (`galeria.directus_files_id`).
- **Autenticación:** ninguna. El rol público del CMS tiene permiso de lectura y
  la escritura está bloqueada (403), así que no viaja ningún token al frontend.
- **Transformación de imágenes:** endpoint `/assets/{uuid}` con parámetros
  `width`, `fit`, `quality` y `format=webp`, encadenado con `next/image`.
- **Caché:** `fetch` con `next: { revalidate: 300, tags: ['catalogo'] }`. El tag
  `catalogo` permite invalidar el catálogo completo desde un webhook del CMS.
- **Estrategia de consulta:** con dos llamadas (`getCategorias` +
  `getProductos`) se resuelve casi todo el sitio; los filtrados por categoría,
  destacados y relacionados se hacen en memoria sobre ese listado ya cacheado.
- **Código:** [src/lib/directus.ts](src/lib/directus.ts) (transporte, URLs de
  imagen), [src/lib/catalogo.ts](src/lib/catalogo.ts) (consultas y
  normalización), [src/types/catalogo.ts](src/types/catalogo.ts) (contrato de
  datos), [src/lib/catalogo-formato.ts](src/lib/catalogo-formato.ts)
  (presentación: precios en `es-ES`, pesos, párrafos).

### 2.2 SQLite — solicitudes de empleo

Base de datos local embebida con **better-sqlite3**, en modo WAL y con claves
foráneas activas. Tabla `solicitudes_empleo` (nombre, apellidos, fecha de
nacimiento, email, teléfono, archivos en JSON, estado, IP y fecha). El archivo
vive en un volumen Docker (`/app/data/lasorianita.db`) para sobrevivir a los
redespliegues, junto a los adjuntos en `/app/data/uploads/AAAA/MM/`.
Código: [src/lib/db.ts](src/lib/db.ts).

### 2.3 SMTP — correo transaccional

**Nodemailer** contra un relay externo con autenticación (se usó Brevo), con
fallback a `localhost:25`. Cuatro plantillas HTML: confirmación al candidato,
actualización de solicitud existente, rechazo (disparado desde el panel de RRHH)
y notificación interna a la empresa.
Código: [src/lib/mail.ts](src/lib/mail.ts).

### 2.4 Servicios de Google

- **Google Maps (embed):** iframe del mapa de la ficha de Google Business, con
  `loading="lazy"`. Sustituyó a la integración con la JS API (ver §4.3).
- **Google Analytics 4** (`G-9XDB0XDVP0`) mediante `next/script` con
  `strategy="lazyOnload"`, para no competir con el render inicial.
- **Google Search Console**: verificación de dominio y envío de `sitemap.xml`
  generado dinámicamente desde el CMS ([src/app/sitemap.ts](src/app/sitemap.ts)),
  más [src/app/robots.ts](src/app/robots.ts).

### 2.5 Fuente descartada: Instagram Graph API

Hubo una sección `/siguenos` que renderizaba el feed de Instagram del obrador
(media + perfil vía `graph.instagram.com`, cacheado 1 h). Se retiró del proyecto
por el motivo que se explica en §4.1.

---

## 3. Lenguajes, frameworks y herramientas

### Lenguajes

- **TypeScript** (modo estricto) para toda la aplicación.
- **CSS** moderno: variables en `:root`, `@theme inline` y `@layer components`
  de Tailwind 4.
- **SQL** (SQLite) para el esquema y consultas de candidaturas.
- **JSX/TSX** para los componentes.
- **YAML** y **Dockerfile** para infraestructura y CI.

### Framework y librerías

| Pieza | Versión | Uso |
|---|---|---|
| **Next.js** | 16.1.6 | App Router, Server Components, rutas dinámicas, `output: "standalone"`, `generateMetadata`, `sitemap.ts`/`robots.ts`, `next/font`, `next/image`, `next/script` |
| **React** | 19.2.3 | UI; **React Compiler** activado (`reactCompiler: true` + `babel-plugin-react-compiler`) |
| **Tailwind CSS** | 4 | Estilos, vía `@tailwindcss/postcss`; clases de componente centralizadas en `globals.css` |
| **better-sqlite3** | 12.6 | Persistencia de candidaturas (declarado en `serverExternalPackages`) |
| **Nodemailer** | 8.0 | Correo transaccional |
| **clsx** | 2.1 | Composición condicional de clases |

### Herramientas de desarrollo y despliegue

- **pnpm 11.1.2** como gestor de paquetes, con `pnpm-workspace.yaml`
  (`allowBuilds` para `better-sqlite3`, `sharp` y `unrs-resolver`) y
  **`patchedDependencies`** para parchear Next (§4.5).
- **ESLint 9** con `eslint-config-next` (config plana en `eslint.config.mjs`).
- **Docker** multi-etapa (`deps` → `builder` → `runner`) sobre `node:22-alpine`,
  ejecutando como usuario no root `nextjs:nodejs`; **Docker Compose** con bind
  mount `./data` y red externa `proxy`.
- **GitHub Actions** (`appleboy/ssh-action`) para desplegar en el VPS por SSH:
  `git pull` → escritura del `.env` desde GitHub Secrets → `docker compose up -d
  --build` → `docker image prune`.
- **Apache** como reverse proxy en el VPS (`ProxyPass` al puerto 3000) con
  certificados **Let's Encrypt**.
- **Git/GitHub** para control de versiones; **Directus** como panel de contenido
  para el cliente.
- **PageSpeed Insights / Lighthouse** para medir rendimiento móvil.

### Organización del código

```
src/
├── app/                 # rutas (App Router), API route, sitemap, robots, globals.css
├── components/
│   ├── layout/          # secciones compuestas (hero, legado, catálogo, formulario…)
│   └── ui/              # piezas reutilizables (tarjetas, migas, imágenes, header, footer)
├── lib/                 # acceso a datos y lógica: directus, catalogo, db, mail, validation
└── types/               # contratos de datos (tipos *Raw vs. tipos limpios)
```

Convención propia: todo el dominio nuevo se nombra **en español**
(`getProductos`, `TarjetaProducto`, `lista-alergenos`), mientras que el código
más antiguo conserva nombres en inglés — conviven ambos.

---

## 4. Problemas y dificultades encontradas

### 4.1 La API de Instagram nunca llegó a estar disponible

Se desarrolló una sección completa `/siguenos` con el feed del obrador: route
handler contra `graph.instagram.com`, tipos, grid de publicaciones, cabecera de
perfil y botones. El bloqueo fue **administrativo, no técnico**: la Graph API
exige una cuenta de Instagram Business vinculada a una página de Facebook y una
app revisada, y no se consiguieron las credenciales
(`INSTAGRAM_ACCESS_TOKEN` / `INSTAGRAM_BUSINESS_ID`) a tiempo. El código quedó
escrito pero inservible.

**Solución:** retirar toda la sección y **reconvertir ese espacio de navegación
en el catálogo de producto**, que aporta más valor de negocio y SEO y no depende
de terceros. El botón del header pasó de `ig-button` a `catalogo-button`.
Lección: no colocar en la navegación principal una sección cuya viabilidad
depende de un permiso que aún no se tiene.

### 4.2 Rendimiento móvil: cadena crítica de fuentes y LCP

El primer diagnóstico con PageSpeed fue malo en móvil. Dos causas:

- Las cuatro tipografías se cargaban con `@font-face` manual apuntando a
  `public/fonts/`, lo que generaba una cadena de peticiones
  `HTML → CSS → fuentes` de hasta **1494 ms**, con ~570 KB de payload (solo
  Inter pesaba 341 KB completa).
- La imagen del hero, que es el elemento **LCP**, se cargaba en diferido.

**Solución** (documentada en `PLAN Optimizar rendimiento mobile.txt` y aplicada
en el commit `bb3c7e5`): migrar a `next/font/google` con subconjunto `latin`,
`display: swap` y `adjustFontFallback`, distinguiendo fuentes críticas
(`Inter`, `Instrument Serif` → `preload: true`) de decorativas (`STIX Two Text`,
`Pinyon Script` → `preload: false`); añadir `priority` a la imagen del hero;
eliminar `public/fonts/`. Payload de fuentes estimado tras el cambio: ~100 KB.

**Detalle que costó encontrar:** las variables CSS de `next/font` no pueden
llamarse `--font-*`, porque colisionan con las variables del `@theme` de
Tailwind 4 y provocan una referencia circular. Se resolvió con el prefijo
`--nf-*` (`--nf-sans`, `--nf-serif`, `--nf-math`, `--nf-script`).

### 4.3 Google Maps: la API key que no sobrevivía al build

La primera versión del mapa usaba `@googlemaps/js-api-loader`, que necesita
`NEXT_PUBLIC_MAPS_API_KEY` y `NEXT_PUBLIC_MAP_ID`. Al ser variables
`NEXT_PUBLIC_` se **inlinean en tiempo de build**, así que había que propagarlas
como `ARG` y `ENV` hasta el Dockerfile y desde ahí a `docker-compose` y a los
GitHub Secrets. El historial refleja los tropiezos: una key versionada por error
(`ed060b5`), su corrección (`4066334 env eliminado`, `ce4a33d API KEY arreglada`)
y el `MAP_ID` que faltaba en el build (`f38df97`).

**Solución:** sustituir la JS API por el **iframe de embed** de la ficha de
Google Business. No necesita credenciales, se renderiza en servidor, carga en
diferido y no bloquea la interacción. Se le añadió `title` porque un iframe sin
nombre accesible se anuncia como «marco» en lectores de pantalla.

### 4.4 Compilar `better-sqlite3` dentro de Docker con pnpm

`better-sqlite3` es una dependencia nativa: exige toolchain de compilación en
Alpine (`python3 make g++`) y que pnpm tenga permiso explícito para ejecutar
scripts de instalación. Encadenó varios problemas:

- Hubo que declarar `allowBuilds` en `pnpm-workspace.yaml` y
  `enable-pre-post-scripts=true` en `.pnpmrc` — un archivo que además debe
  copiarse **antes** del `pnpm install` en el Dockerfile.
- El paso de `.npmrc` a `.pnpmrc` y el ajuste de la versión de pnpm obligó a
  varias iteraciones de despliegue (`75c5c2f`, `b2b88dd`, `b95f765`, `993f58b`,
  `2dec002`: cinco commits consecutivos tocando Dockerfile y gestor de paquetes).
- También hizo falta declarar `serverExternalPackages: ["better-sqlite3"]` en
  `next.config.ts` para que Next no intentara empaquetar el binario nativo.

### 4.5 Un polyfill de Next que había que parchear

Se mantiene un **patch propio sobre Next** (`patches/next.patch`, vía
`patchedDependencies`) que vacía `dist/build/polyfills/polyfill-module.js`. Ese
polyfill de legacy (`trimStart`, `Array.flat`, `Promise.finally`…) es peso
muerto para los navegadores objetivo y entraba en el bundle de todas las
páginas. Es una solución frágil por naturaleza: **hay que revisarla en cada
actualización de Next**.

### 4.6 Persistencia de datos entre redespliegues

El despliegue reconstruye el contenedor en cada push, así que la base SQLite y
los CV subidos desaparecían. Primero se usó un volumen nombrado y luego se
cambió a **bind mount `./data:/app/data`** (`912416c`), que además permite
inspeccionar y respaldar los archivos directamente desde el VPS. El Dockerfile
crea `/app/data/uploads` con el `chown` correcto porque el contenedor corre como
usuario no root.

### 4.7 Entrega de correo

El primer montaje enviaba por el `localhost:25` del VPS, con la entregabilidad
que cabe esperar (SPF/DKIM ausentes, riesgo de spam). Se añadió soporte de
**autenticación SMTP opcional** para usar un relay externo (Brevo): si existen
`SMTP_USER` y `SMTP_PASSWORD` se añade `auth` al transporte, y si no se mantiene
el comportamiento anterior (`bc1169a`). La lógica de qué correo se envía en cada
caso también hubo que rehacerla (`40616e3`).

### 4.8 Candidaturas duplicadas

Los candidatos reenviaban el formulario. Se resolvió detectando el email
existente y devolviendo un `409 EMAIL_EXISTS`: el frontend entonces pregunta al
usuario si quiere **actualizar** su solicitud, y en ese caso se reenvía con
`actualizar=true` y se manda un correo de actualización en lugar de uno de
confirmación (`cdb0aa5`, `d2e5813`).

### 4.9 Endurecer la subida de archivos

Aceptar adjuntos públicos abre superficie de ataque. Contramedidas en
[src/lib/validation.ts](src/lib/validation.ts) y la
[API route](src/app/api/solicitud-empleo/route.ts): lista blanca de MIME
(`application/pdf`, `image/jpeg`) **y** de extensión, límite de 5 MB por archivo
y 5 archivos por solicitud, verificación de **magic bytes** (no basta el
`Content-Type`, que lo controla el cliente), nombres regenerados con `crypto`,
rate limit de 3 envíos por hora e IP, escapado HTML de todo lo que entra en las
plantillas de correo, y validación duplicada cliente/servidor compartiendo el
mismo módulo.

### 4.10 El CMS no devolvía los datos con la forma esperada

Integrar Directus fue más laborioso de lo previsto porque la API emite tipos que
no coinciden con lo que declara el esquema. Verificado contra producción:

- `precio_orientativo` llega como **string** (`"4.50"`).
- `destacado` y `vegano` llegan como **0 | 1**, no como booleanos.
- `alergenos` y `trazas` llegan con doble salto por la tabla puente:
  `[{ alergenos_id: { codigo } }]`.
- Un campo de archivo puede llegar como string, `{ id }` o
  `{ directus_files_id }` según el interfaz configurado; la galería usa la
  tercera forma.
- Una relación M2O puede venir expandida o como slug suelto.

**Solución arquitectónica:** dos niveles de tipos —`*Raw` (lo que la API
devuelve de verdad) y tipos limpios (lo que consumen los componentes)— con toda
la normalización concentrada en `src/lib/catalogo.ts`. Ningún componente toca la
forma cruda. Además, el rol público del CMS **no** filtra por estado, así que
cada consulta aplica `filter[status][_eq]=published` de forma explícita; sin eso
se colaban los borradores.

### 4.11 Un catálogo sin fotografías

Al integrar el CMS, las 7 categorías y los 41 productos devolvían `imagen: null`:
la base de imágenes no estaba poblada. El caso «sin foto» no era una excepción
rara, era **lo normal**.

**Solución:** el componente
[ImagenCatalogo](src/components/ui/catalogo/imagen-catalogo.tsx) pinta una
reserva —icono sobre el color de acento de la categoría y leyenda «Foto en
camino»— que se lee como *pendiente* y no como *error de carga*. El día que se
suban las fotos empieza a servirlas sin tocar nada más. En la misma línea, la
`descripcion` se declara como markdown en el CMS pero hoy ningún registro usa
marcas, así que se parte en párrafos en vez de añadir un renderizador de
markdown (y con él, riesgo de HTML inyectado).

### 4.12 Que la caída del CMS no tumbe el build

Con el catálogo, el `sitemap.ts` y varias páginas dependiendo de Directus, un CMS
caído rompía `next build` entero. `leerColeccion` **devuelve `null` en lugar de
lanzar** cuando la petición falla, y cada consulta degrada a `[]`, de modo que la
página muestra su estado vacío y el despliegue sigue adelante. Quien llama decide
qué pintar.

### 4.13 Redes Docker compartidas en el VPS

El contenedor convivía con otros proyectos en el VPS y al principio se enganchó a
la red de otro (`matching-matcha-web-nextjs_default`), acoplando su ciclo de vida
al de un proyecto ajeno. Se corrigió pasando a una red `proxy` independiente
(`940ae22`). Para desarrollar en un Mac sin Traefik hizo falta además un
`docker-compose.dev.yml` que convierte esa red externa en local y quita
`host-gateway` de `extra_hosts`, sin tocar el compose de producción (`a7851fa`).

### 4.14 Despliegues automáticos que se disparaban de más

El workflow arrancó con `on: push` a `main`, lo que reconstruía la imagen
completa en cada commit, incluidos los de contenido o documentación. Está ahora
en **`workflow_dispatch`** (despliegue manual bajo demanda) y el puerto SSH se
movió del 22 por defecto. Es una discrepancia consciente con lo que aún dice el
README (sección «Flujo de despliegue»), que conviene actualizar.

### 4.15 Cumplimiento RGPD

GA4 se integró antes de resolver el consentimiento de cookies, que en la UE es
obligatorio. Queda anotado como pendiente en `indexacion-y-analiticas.txt`, junto
con la necesidad de que la política de privacidad cubra explícitamente el
tratamiento de datos de **candidatos** (currículos, con datos personales y
conservación limitada), no solo de visitantes.

---

## 5. Estado y trabajo pendiente

- **Catálogo:** funcional contra el CMS; **pendiente subir las fotografías** de
  categorías y productos, y conectar un webhook de Directus que invalide el tag
  `catalogo` para no esperar los 300 s de revalidación.
- **Empleo:** formulario público y almacenamiento terminados. El **panel de RRHH**
  (`empleo.lasorianita.es`) está planificado en [PLAN_EMPLEO.md](PLAN_EMPLEO.md)
  como segunda app Next.js en el monorepo (`pnpm-workspace.yaml` ya está
  preparado), compartiendo el mismo SQLite por volumen. Pendientes menores:
  columna `nota_interna` y campo `mensaje` opcional.
- **Legal/analítica:** banner de consentimiento de cookies y revisión de la
  política de privacidad para candidatos.
- **Mantenimiento:** el correo de notificación interna aún apunta a una dirección
  de pruebas (`MAIL_NOTIFY`), y `patches/next.patch` debe revisarse en cada
  actualización de Next.
- **Documentación:** actualizar el README, que describe un despliegue automático
  por push que hoy es manual.
