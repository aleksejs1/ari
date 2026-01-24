<p align="center">
  <img src="assets/ari_avatar.png" alt="Ari Avatar" width="100" />
</p>

<h1 align="center">Ari - Personal CRM</h1>

<p align="center">
  <a href="https://personal-ari.com/">Website</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://app.personal-ari.com/">App</a>
  &nbsp;&nbsp;&bull;&nbsp;&nbsp;
  <a href="https://docs.personal-ari.com/">Documentation</a>
</p>

<p align="center">
  <strong>Ari</strong> is a self-hosted personal CRM built around <strong>immutable history and reliable notifications</strong>.
</p>

<p align="center">
  It is designed for people who want full control over their personal data, complete change history, and the ability to self-host with 100% privacy.
</p>

---

## Table of contents

- [Quick Start (Docker)](#quick-start-docker)
- [Why this exists](#why-this-exists)
- [Core principles](#core-principles)
- [What exists today](#what-exists-today)
- [Architecture at a glance](#architecture-at-a-glance)
- [Project status & expectations](#project-status--expectations)

---
## Quick Start (Docker)

You can run Ari immediately without cloning the code, using the official Docker image.

**Option 1: Docker Run**
```bash
docker run -d \
  --name ari \
  --restart unless-stopped \
  -p 8080:8080 \
  -e APP_ENV=prod \
  -v $(pwd)/data:/app/core/var \
  aleksejs0/ari-app:latest
```

**Option 2: Docker Compose**
```yaml
services:
  ari:
    image: aleksejs0/ari-app:latest
    container_name: ari
    restart: unless-stopped
    environment:
      - APP_ENV=prod
    volumes:
      - ./data:/app/core/var
    ports:
      - "8080:8080"
```

👉 [Full Installation Guide](docs/docs/01-getting-started/installation.md)

---
## Why this exists

This project started from a very practical frustration.

I used **MonicaHQ** for a long time. One of my favorite features was email notifications for important dates, like birthdays. Over time, the project felt stagnant, but it still worked well enough — until one day it didn’t.

On my self-hosted Monica instance, something went wrong. Part of the notification data disappeared from the database. Fixing it meant digging into internals and re-configuring everything from scratch. I didn’t. I simply stopped using the product.

Later, I experimented with managing contacts in **Obsidian**, treating them as notes. I even built my own plugin to sync Google Contacts. This worked well for data ownership and flexibility, but it still lacked one crucial thing: **reliable, cross-platform notifications**.

At that point, it became clear that I wanted something different:
- a system where **data history is never silently lost**
- a system where **notifications are treated as first-class, reliable features**
- a system I can **fully trust**, inspect, and self-host

That is how Ari started.

---
## Core principles

- **History-first** All meaningful changes are recorded. Losing context or history is not acceptable.
- **Reliable notifications** Notifications are not a “nice to have” feature. They are part of the core value.
- **Data ownership** You can self-host Ari and keep full control over your data.
- **Open source by default** Transparency builds trust. All core logic is open and auditable.
- **Privacy by design** No tracking, no dark patterns, no data extraction incentives.
- **Monolith first, clean architecture** Start simple. Optimize and split only when the system proves it needs it.

---
## What exists today

Ari has moved beyond a technical prototype into a **functional system** with a stable domain model.

### Core features

- **Dashboard**:
    - Widget for upcoming anniversaries (sorted by date)
    - Recent system activity stream
    - Quick access to contact groups
- **Contact Management**:
    - **Rich Data**: Multiple names, emails, phone numbers, addresses, and organizations.
    - **Relationships**: Bidirectional relationships between contacts (e.g., Parent ↔ Child) with duplicate prevention.
    - **Grouping**: Tagging system with dedicated filtering pages and sidebar navigation.
    - **Inline Editing**: Quick updates for fields directly on the contact card.
    - **Similar Contacts**: Automatic detection of potential family members or duplicates.
- **Audit log**:
    - Full history of the contact lifecycle (Create, Update, Delete).
    - Human-readable timelines showing exactly *what* changed and *who* changed it.
    - "Time travel" visibility into deleted data.
- **Notification system**:
    - Configurable notification channels (currently Telegram).
    - Date-based subscriptions.
- **Settings**:
    - Multi-language support (English/Russian).
    - Configurable date formats (MM/DD/YYYY vs DD.MM.YYYY).
    - Custom "Favorites" group configuration.

### Integrations

- **Google Contacts import**:
    - Imports core details, phones, emails, and addresses.
    - Uses external IDs to prevent duplication on re-import.

### Web client

- **React-based UI** with TanStack tooling for performance.
- **Pagination** and **Search** for managing larger contact lists.
- **Favorites** system for quick access to important people.

### Platform & quality

- Dockerized development environment.
- Fully documented API (OpenAPI).
- Extensive automated tests (backend and frontend).
- Strict static analysis (SonarJS, Knip) to ensure maintainability.

This is an **early but usable system**, still evolving. 
Workflows are being polished, and parts of the system are intentionally over-engineered for correctness (history, consistency) rather than just UX speed.

---
## Architecture at a glance

### Backend

- **PHP 8.5**
- **Symfony 7.4**
- **API Platform** (OpenAPI-first)
- **MariaDB / SQLite**
- Token-based authentication
- Strict user data isolation at the Doctrine level
- Audit logging via Doctrine event subscribers

### Frontend

- **React**
- **TanStack Query / Router**
- Multilingual UI
- Typed API client generated from OpenAPI

### Infrastructure

- Docker-based development environment
- Cron-based background jobs (notifications)
- Designed for self-hosting from day one

### Extensibility (Plugins)

The system now supports a **Plugin-Oriented Architecture** on both Backend and Frontend. This allows extending functionality without modifying the core codebase.

- **Proof of Concept**: A full plugin system is implemented and functional.
- **Documentation**: See [Plugin Development Overview](docs/docs/05-developer/plugins.md) for details on creating plugins for both layers.

---
## Project status & expectations

Ari is in an **active stabilization phase**.

- The core architecture and data model are in place and expanding.
- Key features (Contacts, Relations, History, Notifications) are functional.
- The UI is becoming more coherent with the addition of dashboards, settings, and inline editing.

However, Ari is **not production-ready yet**:
- Performance optimization for large datasets is ongoing.
- Import queues are needed for massive Google Contact lists.
- Breaking changes are still possible as the domain model matures.

If you care about **data reliability, transparent history, and trustworthy notifications**, and are comfortable with an evolving system — Ari is worth following.