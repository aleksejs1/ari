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
    pdo_mysql \
    zip \
    opcache \
    apcu



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

# Switch to user
USER developer

# Expose port for symfony serve
EXPOSE 8000

# Default command
CMD ["bash"]
