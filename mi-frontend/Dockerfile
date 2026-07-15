# Build stage
FROM node:20-alpine AS builder

WORKDIR /build

# Copiar package.json y package-lock.json
COPY mi-frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY mi-frontend/src ./src
COPY mi-frontend/public ./public
COPY mi-frontend/index.html ./
COPY mi-frontend/vite.config.js ./

# Build de la aplicación React
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Instalar gettext para envsubst
RUN apk add --no-cache gettext

# Establecer directorio de trabajo
WORKDIR /app

# Copiar configuración de Nginx
COPY mi-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados del builder
COPY --from=builder /build/dist ./public

# Copiar template de configuración
COPY mi-frontend/public/config.template.js ./config.template.js

# Copiar entrypoint script
COPY mi-frontend/entrypoint.sh ./entrypoint.sh

# Hacer el script ejecutable
RUN chmod +x ./entrypoint.sh

# Exponer puerto
EXPOSE 8080

# Entrypoint que genera config.js dinámicamente
ENTRYPOINT ["./entrypoint.sh"]
