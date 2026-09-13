# Shared Types Agent Guidelines: `@houseforce/shared-types`

This guide outlines rules for maintaining and modifying the shared TypeScript interfaces within **HouseForce**.

---

## 1. Scope & Purpose

* This package (`@houseforce/shared-types`) serves as the single source of truth for entity types shared across `frontend`, `portal`, and `backend`.
* It defines contract schemas for Strapi models (e.g. `Post`, `Category`, `Project`, `Update`, `UpdateMessage`) and related API responses.

---

## 2. Development Conventions

* **No Heavy Dependencies**: Keep this package purely type-oriented. Avoid adding heavy runtime dependencies unless strictly necessary (e.g. Zod for runtime schema validation).
* **Backwards Compatibility**: When adding or updating shared types, ensure changes are backwards-compatible with existing consumers in `frontend` and `portal`.
* **Exporting**: All shared types must be exported from [`index.ts`](./index.ts).

---

## 3. Verification Commands

* Run type checking for shared types:
  ```bash
  # From repository root
  npm run typecheck -w @houseforce/shared-types
  ```
