# Ari

**Ari** is an open-source personal CRM focused on **data reliability**, **reliable notifications**, and **long-term trust**.  
It is designed for people who want full control over their personal data, complete change history, and the ability to self-host with 100% privacy.

Ari is an alternative to MonicaHQ, built with a strong emphasis on transparency, auditability, and longevity.

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

- **History-first**  
    All meaningful changes are recorded. Losing context or history is not acceptable.
- **Reliable notifications**  
    Notifications are not a “nice to have” feature. They are part of the core value.
- **Data ownership**  
    You can self-host Ari and keep full control over your data.
- **Open source by default**  
    Transparency builds trust. All core logic is open and auditable.
- **Privacy by design**  
    No tracking, no dark patterns, no data extraction incentives.
- **Monolith first, clean architecture**  
    Simple, understandable systems age better than over-engineered ones.

---
## What exists today (early stage)

Ari is still in an early phase, but it already includes:

- Dockerized development environment
- Backend API built with **PHP 8.5**, **Symfony 7.4**, **API Platform**, and **MariaDB**
- Web client built with **React**, including multi-language support
- Authentication
- Contact domain model:
    - Contacts
    - Names (a contact can have multiple names)
    - Dates (birthdays, anniversaries, custom dates)
- Strong focus on code quality:
    - extensive automated tests
    - static analysis
    - linters and format checkers

This is a foundation, not a finished product.

---
## Architecture at a glance

- **Backend**
    - PHP 8.5
    - Symfony 7.4
    - API Platform
    - MariaDB
- **Frontend**
    - React
    - Multilingual UI
- **Infrastructure**
    - Docker-based local development
    - Self-hosted by design

The architecture favors clarity and maintainability over early optimization.

---
## Project status & expectations

- This is a **solo-developed** project.
- Development happens at a sustainable pace.
- There are **no fixed deadlines**.
- Breaking changes are possible.
- The project is developed publicly, with a strong focus on correctness and trust rather than speed.

If you are looking for a polished, feature-complete CRM today, Ari is probably not for you.  
If you care about long-term data reliability, transparency, and a thoughtful approach to personal data — you might want to follow along.

---
## Screenshots

Here are some screenshots of the project as it currently looks:

![Audit Log](assets/ari_audit.png)
![Contact List](assets/ari_list.png)
