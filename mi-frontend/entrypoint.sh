#!/bin/sh
# Entrypoint script para generar la configuración en tiempo de ejecución

# Usar envsubst para procesar el template y generar config.js
export VITE_API_URL="${VITE_API_URL:-http://localhost:8080/api}"
envsubst < /app/config.template.js > /app/public/config.js

# Iniciar nginx
exec nginx -g "daemon off;"
