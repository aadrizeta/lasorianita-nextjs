# La Sorianita

Aplicacion web de [La Sorianita](https://lasorianita.es) construida con [Next.js](https://nextjs.org) 16, React 19 y Tailwind CSS 4.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Docker local

```bash
docker build -t lasorianita .
docker run -p 3000:3000 lasorianita
```

## Despliegue en VPS

El proyecto se despliega automaticamente en el VPS con cada push a `main` mediante GitHub Actions.

### Flujo de despliegue

1. Push a `main`
2. GitHub Actions se conecta al VPS por SSH
3. Ejecuta `git pull` para obtener los cambios
4. Reconstruye y levanta el contenedor con `docker compose up -d --build`
5. Limpia imagenes Docker antiguas

### GitHub Secrets

Configurar en **Settings > Secrets and variables > Actions**:

| Secret | Descripcion |
|---|---|
| `VPS_HOST` | IP o hostname del VPS |
| `VPS_USER` | Usuario SSH del VPS |
| `VPS_SSH_KEY` | Clave SSH privada completa (incluyendo `-----BEGIN/END-----`) |
| `VPS_APP_DIR` | Ruta del proyecto en el VPS (ej: `/var/www/lasorianita-nextjs`) |

### Configuracion inicial del VPS

1. **Clonar el repositorio:**

```bash
cd /var/www
git clone https://github.com/aadrizeta/lasorianita-nextjs.git
```

2. **Asignar permisos al usuario SSH:**

```bash
sudo chown -R TU_USUARIO:TU_USUARIO /var/www/lasorianita-nextjs
```

3. **Levantar el contenedor:**

```bash
cd /var/www/lasorianita-nextjs
docker compose up -d --build
```

4. **Configurar Apache como reverse proxy:**

Asegurarse de que los modulos `proxy` y `proxy_http` estan habilitados:

```bash
a2enmod proxy proxy_http
```

Crear/editar `/etc/apache2/sites-available/lasorianita.es-le-ssl.conf`:

```apache
<IfModule mod_ssl.c>
  <VirtualHost *:443>
      ServerName lasorianita.es
      ServerAlias www.lasorianita.es

      ProxyPreserveHost On
      ProxyPass / http://localhost:3000/
      ProxyPassReverse / http://localhost:3000/

      ErrorLog ${APACHE_LOG_DIR}/lasorianita_error.log
      CustomLog ${APACHE_LOG_DIR}/lasorianita_access.log combined

      SSLCertificateFile /etc/letsencrypt/live/lasorianita.es/fullchain.pem
      SSLCertificateKeyFile /etc/letsencrypt/live/lasorianita.es/privkey.pem
      Include /etc/letsencrypt/options-ssl-apache.conf
  </VirtualHost>
</IfModule>
```

5. **Habilitar el sitio y reiniciar Apache:**

```bash
a2ensite lasorianita.es-le-ssl
systemctl restart apache2
```

### Red Docker

El contenedor se conecta a la red externa `matching-matcha-web-nextjs_default` compartida con Apache y otros contenedores del VPS. Esta red debe existir antes de levantar el contenedor.

## Ideas de marketing

### Frases por categoría

#### Tradición y legado familiar

- "Desde 1955, el sabor que une a Madrid."
- "Tres generaciones, un solo compromiso: el buen pan."
- "Lo que nuestros abuelos empezaron, nosotros lo honramos cada día."
- "El pan de siempre, con el alma de siempre."
- "70 años amasando historia."

#### Proceso artesanal y fermentación

- "24 horas de paciencia en cada bocado."
- "No aceleramos el tiempo. Lo respetamos."
- "Sin atajos, sin prisas. Solo masa madre y tiempo."
- "Lo bueno se hace esperar. Nuestro pan, también."
- "Fermentación lenta, sabor que perdura."

#### Frescura y calidad diaria

- "Cada mañana, un pan recién nacido."
- "Del horno a tu mesa. Cada día, sin excepción."
- "Aquí no se congela. Aquí se hornea."
- "Pan de hoy, hecho hoy."

#### Cercanía y Madrid

- "Madrid huele a pan cuando pasas por aquí."
- "El obrador de tu barrio, desde 1955."
- "Hecho en Madrid, con cariño de toda la vida."
- "Pan madrileño con raíces sorianas."

#### Emocionales / aspiracionales

- "El pan no alimenta solo el cuerpo."
- "Cada hogaza cuenta una historia de tres generaciones."
- "El aroma que te devuelve a casa."
- "Valor artesano en cada miga."
- "Donde la tradición se amasa con las manos."

#### Cortas (redes sociales / packaging)

- "Artesano de verdad."
- "Sabor heredado."
- "Masa madre, alma madre."
- "Pan con historia."
- "Horno vivo."

### Textos de introducción para el catálogo

#### Opción 1 -- Directa y cálida

> Cada producto que ves aquí está elaborado con materias primas nacionales, fermentación lenta de 24 horas y horneado fresco cada mañana. Sin atajos, sin congelados. Solo el sabor auténtico que llevamos perfeccionando desde 1955.

#### Opción 2 -- Narrativa / emocional

> Tres generaciones dedicadas a una sola cosa: hacer pan de verdad. Seleccionamos las mejores harinas nacionales, dejamos que la masa madre trabaje durante 24 horas y horneamos al amanecer. Lo que llega a tus manos es fresco, honesto y hecho con el mismo cariño de siempre.

#### Opción 3 -- Breve y elegante

> Origen nacional. Fermentación lenta. Horneado del día. Descubre el sabor de un obrador artesanal con más de 70 años de historia en Madrid.

#### Opción 4 -- Tono íntimo, tipo manifiesto

> Aquí no aceleramos el tiempo. Cada masa reposa sus 24 horas, cada ingrediente viene de donde debe, y cada mañana el horno vuelve a encenderse. Esto es lo que horneamos para ti.

---

### Comandos utiles en el VPS

```bash
# Ver estado del contenedor
docker ps --filter name=lasorianita

# Ver logs
docker logs lasorianita

# Parar el contenedor
cd /var/www/lasorianita-nextjs && docker compose down

# Reconstruir y levantar
cd /var/www/lasorianita-nextjs && docker compose up -d --build

# Deploy manual desde GitHub Actions
# Settings > Actions > Deploy to VPS > Run workflow
```
