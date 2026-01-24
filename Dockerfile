FROM php:8.5-cli-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    bash \
    icu-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    shadow

# Install PHP extensions
# Install mlocati/php-extension-installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP extensions using the cleaner/more robust installer
RUN install-php-extensions \
    intl \
    apcu \
    pcov \
    gd \
    zip \
    opcache \
    pdo_sqlite \
    pdo_mysql

# Configure PHP
COPY docker/php.ini /usr/local/etc/php/conf.d/99-custom.ini



# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Configure user
RUN groupadd -g 1000 developer \
    && useradd -u 1000 -g developer -m -s /bin/bash developer

# Set working directory permissions
WORKDIR /app
RUN chown -R developer:developer /app

# Setup entrypoint
COPY docker/dev-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

# Switch to user
USER developer

# Create symlink for GiftPlugin (useful for production builds or when volumes are not mounted yet)
# Note: For development with volumes, this symlink will vary effectively be overridden by the volume mount.
RUN mkdir -p /app/core/plugins && \
    ln -s /app/plugins/GiftPlugin /app/core/plugins/GiftPlugin

# Expose port for symfony serve
EXPOSE 8000

# Default command

ENTRYPOINT ["docker-entrypoint"]
CMD ["bash"]
