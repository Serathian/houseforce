# HouseForce Stack

HouseForce is an integrated platform for residential construction, renovation, and property keyholding services. This repository is organized as a multi-service monorepo containing the public marketing website, an authenticated client customer portal, a headless CMS backend, automated API tests, and local Docker orchestration.

---

## Architecture Overview

```
                          ┌───────────────────────────┐
                          │   HouseForce Monorepo     │
                          └─────────────┬─────────────┘
                                        │
        ┌───────────────────┬───────────┴───────────┬───────────────────┐
        ▼                   ▼                       ▼                   ▼
┌───────────────┐   ┌───────────────┐       ┌───────────────┐   ┌───────────────┐
│   frontend    │   │    portal     │       │    backend    │   │     bruno     │
│ Next.js App   │   │ Next.js 16    │       │ Strapi 5 Headless││ API Test      │
│ (Port 3000)   │   │ (Port 3001)   │       │ CMS (Port 1337│   │ Collection    │
│ Marketing Web │   │ Customer Hub  │       │ + Postmark    │   │               │
└───────┬───────┘   └───────┬───────┘       └───────┬───────┘   └───────────────┘
        │                   │                       │
        │                   └───────────┬───────────┘
        ▼                               ▼
┌───────────────┐               ┌───────────────┐
│ Strapi REST   │               │  PostgreSQL   │
│ & Public API  │               │   + MinIO S3  │
└───────────────┘               └───────────────┘
```

---

## Services & Applications

| Service | Path | Tech Stack | Port | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | [`backend/`](./backend/) | Strapi 5, TypeScript, Node.js 20/22, Knex | `1337` | Headless REST API, RBAC multi-tenancy, S3/MinIO upload provider, Postmark email service desk. |
| **Customer Portal** | [`portal/`](./portal/) | Next.js 16, React 19, Tailwind CSS v4, NextAuth.js | `3001` | Authenticated client portal for real-time project progress, milestone logs, photo galleries, and discussions. |
| **Marketing Site** | [`frontend/`](./frontend/) | Next.js, React 19, Tailwind CSS, Framer Motion | `3000` | Public-facing website showcasing construction, renovation, and keyholding services, blog, and inquiries. |
| **API Test Suite** | [`bruno/`](./bruno/) | Bruno CLI | — | Complete automated test collection covering inbound email webhooks and portal REST endpoints. |
| **Local Object Store** | `minio` (Docker) | MinIO (S3-compatible) | `9000` / `9001` | S3-compatible local bucket storage for project photos, blueprints, and update media. |
| **Database** | `db` (Docker) | PostgreSQL 16 Alpine | `5432` | Primary relational database for Strapi CMS. |

---

## Getting Started (Local Development)

### 1. Prerequisites
* [Docker](https://docs.docker.com/get-docker/) & Docker Compose
* [Node.js 20+](https://nodejs.org/) (for running tests or local scripts)

### 2. Environment Setup
Copy the example environment files:
```bash
# Root Strapi & MinIO keys
cp .env.example .env

# Customer Portal Google OAuth keys (optional for local dev)
cp portal/.env.example portal/.env.local
```

### 3. Launch the Stack
Use the explicit local development Compose override:
```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

Once running:
* **Customer Portal**: [http://localhost:3001](http://localhost:3001)
  * Use the **"1-Click Login (client@example.com)"** button in local mode.
* **Strapi Admin Panel**: [http://localhost:1337/admin](http://localhost:1337/admin)
  * Default seeded admin: `staff@houseforce.com` / `AdminPassword123!`
* **Marketing Website**: [http://localhost:3000](http://localhost:3000)
* **MinIO Console**: [http://localhost:9001](http://localhost:9001) (`minioadmin` / `minioadminpassword`)

---

## Testing & Quality Assurance

```bash
# Run backend TypeScript checks and unit/lifecycle tests (24 native tests)
npm --prefix backend test

# Run Bruno API integration test collection (requires running backend)
npm --prefix backend run test:api
```

---

## Production Deployment

In production, cloud-managed PostgreSQL and S3/DigitalOcean Spaces are used instead of local containers. Run:
```bash
docker compose up -d --build
```
This builds and runs production standalone runners for `backend`, `frontend`, and `portal` using environment variables supplied by the production host.
