# Adapted from https://dev.to/code42cate/how-to-dockerize-vite-44d3

# Build frontend from scratch
FROM node:23.3.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Copy built frontend to serve from minimal server setup and minimize image size
FROM busybox:1.37 AS runner
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]