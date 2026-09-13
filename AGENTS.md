# Agent Guidelines: HouseForce Monorepo

Welcome, AI agent! This document contains the operational principles, architecture contracts, and development practices required when working on the **HouseForce Monorepo**.

---

## 1. Monorepo Structure & Sibling Guides

Each subproject has a specialized `AGENTS.md` with domain-specific rules:

* **[`backend/AGENTS.md`](./backend/AGENTS.md)**: Strapi 5 headless CMS, schemas, lifecycles, email service desk, and test suite.
* **[`portal/AGENTS.md`](./portal/AGENTS.md)**: Customer portal (Next.js 16 App Router), NextAuth OAuth & JWT session handling, timeline, and `UpdateThread`.
* **[`frontend/AGENTS.md`](./frontend/AGENTS.md)**: Marketing website (Next.js), brand styling, Tailwind CSS v4, Framer Motion animations.
* **[`shared-types/AGENTS.md`](./shared-types/AGENTS.md)**: Shared TypeScript contracts and interfaces (`@houseforce/shared-types`).
* **[`bruno/AGENTS.md`](./bruno/AGENTS.md)**: Bruno API test collections and automated webhook simulation.

---

## 2. Core Architectural Principles

### NPM Workspaces Strategy
* The repository is configured as an npm workspace managing `backend`, `frontend`, `portal`, and `shared-types`.
* **Dependency Hoisting & Isolation**:
  * Shared dependencies are hoisted to root `node_modules/`.
  * Version-specific dependencies (e.g. React 18 in Strapi backend vs React 19 in Next.js portal/frontend) are nested in subpackage `node_modules/`.
  * Always install new packages using workspace flags:
    ```bash
    npm install <package> -w <workspace-name>
    # Example: npm install zod -w portal
    ```
* **Unified & Scoped Commands**:
  * Monorepo tasks can be run globally (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`) or scoped (`npm run dev:portal`, `npm run build:frontend`, `npm test -w backend`).

### Security & Secrets Hygiene
* **Never commit `.env` or `.env*.local`**: Always preserve the root `.gitignore`. Environment templates belong in `.env.example` or `portal/.env.example` with placeholder values only.
* **Preserve Multi-Tenant Isolation**: Customers must NEVER see or write to projects, updates, or update messages belonging to other clients.
  * In Strapi controllers, always scope queries via `clients: user.id`.
  * Always short-circuit empty result sets: if `allowedProjects.length === 0`, return `{ data: [], meta: { pagination: { total: 0 } } }` immediately to avoid SQL `WHERE id IN ()` syntax errors.

### Docker & Environment Strategy
* **Unified Development Compose**:
  * [`docker-compose.yml`](./docker-compose.yml): Local development stack containing PostgreSQL (`db`), MinIO local S3 (`minio`), Strapi backend, Next.js marketing site (`frontend`), and Customer Portal (`portal`) with live code bind mounts, hot reloading, and dev flags (`SEED_TEST_DATA`, `NEXT_PUBLIC_ENABLE_DEV_LOGIN`).
* **Starting the Stack Locally**:
  ```bash
  npm run dev
  # Or: docker compose up
  ```
* **Test and Production Orchestration**:
  * Infrastructure, Traefik ingress, Let's Encrypt SSL, Watchtower CD, and production environments are strictly isolated in the sibling `houseforce-infra` repository.

### Authentication & Provider Handshake
* Production customer portal accounts are **invitation-only**: Strapi admin creates the user with email; the lifecycle hook sets `provider = provider || 'google'`.
* NextAuth authenticates with Google -> exchanges Google token at Strapi's `/api/auth/google/callback` -> receives Strapi JWT.
* Local development includes a credentials provider (`client@example.com` / `password123`) enabled when `NEXT_PUBLIC_ENABLE_DEV_LOGIN=true`.

---

## 3. Verification & Testing Commands

Before completing any task or proposing commits:

1. **Backend Tests**: Run `npm test` (or `npm test -w backend`).
2. **Typecheck**: Run `npm run typecheck` across all workspaces.
3. **Lint**: Run `npm run lint` across all workspaces.
4. **Compose Validation**: Run `docker compose config --quiet`.
5. **Git Hygiene**: Run `git status` to ensure no temporary scratch files or untracked `.env` files are left behind.
