# Docker Development Environment for "ari" CRM

This environment provides a PHP 8.5 developement container optimized for Symfony and WSL 2.

## 1. Build the Docker Image

Run this command from the project root:

```bash
docker build -t ari-dev .
```

## 2. Start the Container

This starts the container in interactive mode with your current directory mounted. 
Ports 8000 (Symfony) and 9000 (Xdebug if needed) can be exposed.

```bash
docker run -it --rm \
    -v $(pwd):/app \
    -p 8000:8000 \
    --name ari-container \
    ari-dev
```

## 3. Setup Project

Inside the container (after running step 2), navigate to the project directory and install dependencies:

```bash
cd core
composer install
```

## 4. Run the Application

Start the Symfony server, ensuring it allows external connections (so you can access it from your browser):

```bash
symfony server:start --port=8000 --no-tls --allow-all-ip
```

Access the app at `http://localhost:8000`.

## 5. Running Commands

Since the project uses Docker, you generally need to run commands inside the container.

To run a single command (e.g., clearing the cache):

```bash
docker exec -it ari-app-1 php /app/core/bin/console cache:clear
```

Or open a shell inside the container:

```bash
docker exec -it ari-app-1 sh
# Then navigate to the project root
cd /app/core
```

## 6. Code Quality

To run PHPStan (static analysis), execute the following command:

```bash
docker exec -it -w /app/core ari-app-1 vendor/bin/phpstan analyse --memory-limit=1G
```

To run Deptrac (architectural analysis), execute:

```bash
docker exec -it -w /app/core ari-app-1 vendor/bin/deptrac
```

To run PHP-CS-Fixer (code style fixer), execute:

```bash
docker exec -it -w /app/core ari-app-1 vendor/bin/php-cs-fixer check
docker exec -it -w /app/core ari-app-1 vendor/bin/php-cs-fixer fix
```

To run Psalm (static analysis), execute:

```bash
docker exec -it -w /app/core ari-app-1 vendor/bin/psalm
```

To run PHPUnit tests (unit/functional), execute:

```bash
docker exec -it -w /app/core ari-app-1 vendor/bin/phpunit
```

## 7. Roadmap

### 🗺️ Planned Features

- [ ] **Analytics**  
  Add analytics system to track application usage

- [ ] **User Statistics**  
  Implement statistics for contact views and user interactions with contacts

