#!/bin/sh
# Generate /config.js from environment variables at container startup.
# This lets K8s ConfigMaps / env vars reach the static frontend.

cat <<EOF > /usr/share/nginx/html/config.js
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL:-}",
  VITE_EMBED_URL: "${VITE_EMBED_URL:-}",
};
EOF

echo "[entrypoint] config.js written with VITE_API_URL=${VITE_API_URL:-<empty>}"

# Hand off to nginx
exec nginx -g 'daemon off;'
