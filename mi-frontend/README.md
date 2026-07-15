# Mi Frontend - React + Vite

Frontend React para consumir los endpoints de la aplicación Quarkus OpenShift.

## Características

- **React 18** con Vite como bundler
- **Runtime Configuration**: URL de API inyectada en tiempo de ejecución desde variables de entorno
- **Docker**: Imagen multi-stage optimizada con Nginx
- **Kubernetes/OpenShift**: Manifiestos YAML para deployment
- **Environment Variables**: Configuración flexible sin hardcoding

## Estructura del Proyecto

```
mi-frontend/
├── src/                    # Código fuente React
│   ├── App.jsx            # Componente principal con fetch a Quarkus
│   ├── main.jsx           # Entry point
│   └── assets/            # Imágenes y estilos
├── public/                # Archivos públicos
│   ├── config.js          # Configuración en runtime (generada)
│   └── config.template.js # Template para envsubst
├── .env.local             # Variables de entorno locales
├── env.sample             # Template de variables de entorno
├── Dockerfile             # Multi-stage para production
├── nginx.conf             # Configuración de Nginx
├── entrypoint.sh          # Script para generar config.js dinámicamente
└── package.json           # Dependencias
```

## Desarrollo Local

### Instalación

```bash
cd mi-frontend
npm install
```

### Variables de Entorno

1. Copiar el template:
```bash
cp env.sample .env.local
```

2. Editar `.env.local` con la URL del API:
```
VITE_API_URL=http://localhost:8080/api
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

### Build para producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/`.

## Docker & OpenShift

### Construir la imagen Docker

**Nota**: El Dockerfile debe ejecutarse desde la raíz del proyecto.

```bash
# Desde la raíz del proyecto
docker build -f mi-frontend/Dockerfile -t mi-frontend:latest .
```

### Ejecutar localmente con Docker

```bash
docker run -e VITE_API_URL=http://host.docker.internal:8080/api -p 8080:8080 mi-frontend:latest
```

Acceder a `http://localhost:8080`.

### Configuración en OpenShift

La aplicación usa una estrategia de **Runtime Configuration**:

1. **ConfigMap** (`configmap-frontend.yaml`): Define `VITE_API_URL`
2. **Entrypoint** (`entrypoint.sh`): Genera `public/config.js` usando `envsubst`
3. **Nginx**: Sirve la aplicación React y el archivo `config.js`

#### Variables de Entorno en OpenShift

La variable `VITE_API_URL` se inyecta desde el `ConfigMap` y es procesada por el script `entrypoint.sh` antes de iniciar Nginx.

### Aplicar manifiestos a OpenShift

```bash
# Aplicar todos los manifiestos del frontend
kubectl apply -f k8s/configmap-frontend.yaml
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml
kubectl apply -f k8s/route-frontend.yaml

# O aplicarlos todos a la vez
kubectl apply -f k8s/configmap-frontend.yaml -f k8s/deployment-frontend.yaml -f k8s/service-frontend.yaml -f k8s/route-frontend.yaml
```

## Runtime Configuration Explicado

### El Problema

No queremos hardcodear la URL de la API ni usar valores de build-time (como `.env` de Vite), porque queremos "Build once, deploy anywhere".

### La Solución

1. **Template**: `public/config.template.js` contiene:
   ```javascript
   window.API_CONFIG = {
     apiUrl: '${VITE_API_URL}'
   };
   ```

2. **Entrypoint**: `entrypoint.sh` procesa el template usando `envsubst`:
   ```bash
   envsubst < /app/config.template.js > /app/public/config.js
   ```

3. **Resultado**: En runtime, el navegador carga `config.js` con la URL correcta.

4. **En React**: Se accede a `window.API_CONFIG.apiUrl` en la aplicación.

### Flujo

1. **Build**: `docker build` compila la app React
2. **Deploy**: Se crea un Pod con la variable `VITE_API_URL` desde el ConfigMap
3. **Startup**: El entrypoint genera `public/config.js` con la URL correcta
4. **Runtime**: Nginx sirve la app y el navegador carga `config.js`
5. **App**: React hace fetch a la URL proporcionada

## Endpoints Disponibles

### Saludo (público)
```javascript
fetch(`${window.API_CONFIG.apiUrl}/../hello`)
```

### Sucursales (público)
```javascript
fetch(`${window.API_CONFIG.apiUrl}/middleware/sucursales?buscar=Microcentro`)
```

### SIPAP (requiere JWT)
```javascript
fetch(`${window.API_CONFIG.apiUrl}/middleware/sipap?dominio=motivos-sipap`)
```

## Logs en Kubernetes

```bash
# Ver logs del Pod
kubectl logs -f deployment/mi-frontend

# Ver eventos del Deployment
kubectl describe deployment mi-frontend

# Acceder al Pod
kubectl exec -it <pod-name> -- /bin/sh
```

## Troubleshooting

### "Configuración de API no disponible"

- Verificar que `config.js` se generó correctamente
- Revisar logs del Pod: `kubectl logs deployment/mi-frontend`
- Verificar que la variable `VITE_API_URL` está en el ConfigMap

### Error al conectar con el API

- Verificar que el backend Quarkus está corriendo
- Verificar la URL en el ConfigMap
- Revisar CORS en el backend

### Puerto ya en uso (desarrollo local)

Vite usará el siguiente puerto disponible. Verificar la salida de `npm run dev`.

## Build & Deploy Script

```bash
#!/bin/bash

# Build de la imagen Docker
docker build -f mi-frontend/Dockerfile -t mi-frontend:latest .

# Push a registry (si es necesario)
# docker push <registry>/mi-frontend:latest

# Aplicar manifiestos
kubectl apply -f k8s/configmap-frontend.yaml
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml
kubectl apply -f k8s/route-frontend.yaml

# Verificar
kubectl rollout status deployment/mi-frontend
kubectl get pods -l app=mi-frontend
```

## Referencias

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Nginx](https://nginx.org/)
- [Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [OpenShift Routes](https://docs.openshift.com/container-platform/latest/networking/routes/route-configuration.html)

