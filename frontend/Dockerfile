# Adapted from https://dev.to/code42cate/how-to-dockerize-vite-44d3

# Build frontend from scratch
FROM node:23.3.0 AS builder
WORKDIR /app
# First only copy package.json and package-lock.json to leverage Docker's layer caching in case they do not change
COPY package.json package-lock.json ./
RUN npm install --omit=dev
# Only then copies all remaining files (exclusions defined in .dockerignore)
COPY . .
RUN npm run build

# Copy built frontend to serve from minimal server setup to minimize image size
FROM busybox:1.37 AS runner
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["busybox", "httpd", "-f", "-v", "-p", "8080"]