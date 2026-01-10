# Ari CRM: Production Deployment Guide (Docker)

This guide explains how to deploy Ari CRM in a production-ready environment, such as a personal NAS (Synology, QNAP, Unraid) or a VPS, using the optimized **FrankenPHP** setup.

## Prerequisites

- **Docker** and **Docker Compose** installed.
- **Port 8080** (or your chosen port) available.
- **MariaDB/MySQL** (included in the compose file).

---

## 1. Prepare Environment Variables

## 1. Prepare Environment Variables

Since `compose.prod.yaml` is part of the code repository, you should **not** put your real passwords in it. Instead, use a `.env` file on your NAS.

1. Create a file named `.env` in the same folder as `compose.prod.yaml`.
2. Copy the contents of `.env.prod.example` into it.
3. Change the passwords to your own secure values.

Example `.env` file content:
```ini
APP_SECRET=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
JWT_PASSPHRASE=d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb821815
MARIADB_PASSWORD=MySecretDbPassword
MARIADB_ROOT_PASSWORD=MySecretRootPassword
MARIADB_USER=ari_user
MARIADB_DB=ari_db
APP_PORT=8080
```

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
```

### Backup
Everything is stored in:
- `database_data` volume (MariaDB data).
- The `core/var` directory inside the container (though it's mostly logs and cache, ensure critical user data like uploads, if any, are handled).
