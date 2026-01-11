# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/web-client
COPY web-client/package*.json ./
RUN npm install
COPY web-client/ ./
RUN npm run build

# Stage 2: Build Backend
FROM php:8.5-alpine AS backend-builder
WORKDIR /app/core
COPY core/ ./
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN apk add --no-cache \
    icu-dev \
    libzip-dev \
    zip \
    unzip
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Stage 3: Final Runner Image
FROM dunglas/frankenphp:1-php8.5-alpine AS runner

# Install system dependencies (only runtime)
RUN apk add --no-cache \
    mariadb-client \
    openssl

# Install PHP extensions
RUN install-php-extensions \
    intl \
    pdo_mysql \
    zip \
    opcache \
    apcu

# Configure PHP
COPY docker/php.ini $PHP_INI_DIR/conf.d/app.ini

# Set working directory
WORKDIR /app

# Copy Backend files and vendor from builder
COPY --from=backend-builder /app/core /app/core

# Create directory for JWT keys (to be safe)
RUN mkdir -p config/jwt && chown -R www-data:www-data config/jwt

# Create empty .env file to satisfy Symfony Runtime
RUN touch .env

# Copy Frontend build to Caddy's public directory
COPY --from=frontend-builder /app/web-client/dist /app/public

# Copy Caddy configuration
COPY docker/Caddyfile /etc/caddy/Caddyfile

# Entrypoint for automation (JWT keys, migrations)
COPY docker/entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

# Add crontab file
COPY docker/crontab /etc/crontabs/www-data
RUN chmod 0600 /etc/crontabs/www-data

# Final permissions and cleanup
RUN mkdir -p /app/core/var/cache /app/core/var/log \
    && chown -R www-data:www-data /app \
    && chmod -R 777 /app/core/var

# Expose port (from Caddyfile)
EXPOSE 8080

ENTRYPOINT ["docker-entrypoint"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

