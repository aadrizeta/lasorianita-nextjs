FROM node:22-alpine AS base

# --- Dependencies ---
FROM base AS deps
# better-sqlite3 se compila desde fuente en Alpine.
RUN apk add --no-cache python3 make g++
RUN corepack enable pnpm
WORKDIR /app

# Copiar archivos de configuración (incluyendo .pnpmrc)
COPY .pnpmrc ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
RUN corepack enable pnpm
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# OJO: el catálogo se prerenderiza en build (48 páginas estáticas), así que
# esta etapa necesita salida a internet para leer el CMS de Directus. Si el
# CMS no responde, el build no falla pero el catálogo sale vacío.
#
# NEXT_PUBLIC_DIRECTUS_URL es la única variable de build y es opcional: sin
# ella se usa https://cms.pacomerlos.com. Para apuntar a otra instancia hay
# que declararla en Coolify marcada como variable de BUILD, no de runtime,
# porque next/image la necesita ya resuelta al generar el HTML.
ARG NEXT_PUBLIC_DIRECTUS_URL
ENV NEXT_PUBLIC_DIRECTUS_URL=$NEXT_PUBLIC_DIRECTUS_URL

RUN pnpm build

# --- Runner ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Punto de montaje del volumen persistente: aquí viven la base SQLite de
# solicitudes de empleo y los CV subidos. Sin volumen, se pierden en cada
# redespliegue.
RUN mkdir -p /app/data/uploads && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Permite a Coolify esperar a que la app responda antes de cortar la versión
# anterior, en lugar de darla por buena en cuanto arranca el proceso.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
