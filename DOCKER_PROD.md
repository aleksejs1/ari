# Ari CRM: Production Deployment Guide (Docker)

This guide explains how to deploy Ari CRM in a production-ready environment, such as a personal NAS (Synology, QNAP, Unraid) or a VPS, using the optimized **FrankenPHP** setup.

## Prerequisites

- **Docker** and **Docker Compose** installed.
- **Port 8080** (or your chosen port) available.
- **MariaDB/MySQL** (included in the compose file).

---

## 1. Prepare Environment Variables

## 1. Prepare Environment Variables

## 1. Prepare Environment Variables

Since `compose.prod.yaml` is part of the code repository, you should **not** put your real passwords in it. Instead, use a `.env` file on your NAS.

**Option A: Automatic Setup (Recommended)**
Run the helper script to generate a `.env` file with secure random passwords:

```bash
./setup_prod.sh
```

**Option B: Manual Setup**
1. Create a file named `.env` in the same folder as `compose.prod.yaml`.
2. Copy the contents of `.env.prod.example` into it.
3. Change the passwords to your own secure values.

---

---

## 2. Build and Start the Containers

Run the following command from the project root:

```bash
docker compose -f compose.prod.yaml up -d --build
```

### What happens automatically:
- **JWT Keys**: Generated on the first run.
- **Database**: Migrations are applied automatically.
- **Frontend/Backend**: Served via FrankenPHP on the configured port.

---

## 3. Access the Application

Open your browser and navigate to:
`http://<your-nas-ip>:8080` (or your custom port)

If this is your first time, you can register a new account.

---

## Maintenance and Updates

### Pulling Updates
To update the application to the latest version:
```bash
git pull
docker compose -f compose.prod.yaml up -d --build
```
The application will automatically detect new migrations and apply them on restart.

### Viewing Logs
```bash
docker compose -f compose.prod.yaml logs -f app
# Or directly by container name:
# docker logs -f ari-prod-app
```

### Backup
Everything is stored in:
- `database_data` volume (scoped to `ari-prod` project).
- The `core/var` directory inside the container (though it's mostly logs and cache, ensure critical user data like uploads, if any, are handled).

---

## Background Tasks

The application runs periodic tasks via `cron` inside the main application container.

### Included Tasks:
- **Notification Generation**: Runs every minute.
- **Notification Processing**: Runs every minute.

### Monitoring Tasks:
You can check the cron logs inside the app container:
```bash
docker exec ari-prod-app tail -f /app/core/var/log/cron.log
```
Or check if `crond` is running:
```bash
docker exec ari-prod-app ps aux | grep crond
```
