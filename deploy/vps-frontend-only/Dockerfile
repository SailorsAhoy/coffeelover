# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json bun.lockb ./
RUN npm install -g bun && bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine

COPY deploy/vps-frontend-only/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
