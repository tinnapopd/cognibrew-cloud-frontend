# Stage 0: Build frontend
FROM oven/bun:1 AS build-stage

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

# Stage 1: Serve frontend with Nginx
FROM nginx:1

COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]