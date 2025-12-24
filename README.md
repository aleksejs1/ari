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

## 3. Create a New Symfony 7.4 Project

Inside the container (after running step 2), run:

```bash
# Configure Git (required for Symfony CLI)
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Create new Symfony project
symfony new . --version="7.4.*" --webapp
```

> **Note**: Using `.` creates the project in the current directory (`/app`), which is mounted to your WSL host folder.

## 4. Run the Application

```bash
symfony serve --port=8000 --no-tls
```

Access the app at `http://localhost:8000`.
