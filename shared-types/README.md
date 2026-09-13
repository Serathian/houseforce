# `@houseforce/shared-types`

This package contains shared TypeScript interfaces and models used across the HouseForce monorepo services (`frontend`, `portal`, and `backend`).

---

## Installation & Consumption

As part of the NPM workspace, sibling packages consume this package directly:

```json
{
  "dependencies": {
    "@houseforce/shared-types": "*"
  }
}
```

```ts
import type { Post, Category } from "@houseforce/shared-types";
```

---

## Scripts

```bash
# Typecheck shared definitions
npm run typecheck
```
