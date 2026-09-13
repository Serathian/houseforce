# Frontend Agent Guidelines: Marketing Website

This guide outlines rules and architectural patterns for agents modifying or extending the **HouseForce Marketing Website** (`frontend/`).

---

## 1. Design System & Brand Aesthetics

* **Color Palette**:
  * Construction Blue: `text-blue-900`, `bg-blue-950`
  * Keyholding Teal: `text-teal-600`, `bg-teal-700`
  * Accent Amber: `text-amber-500`, `bg-amber-400`
  * Neutral: `bg-slate-50`, `text-slate-800`
* **Navigation & Links**:
  * Header links in [`src/components/Header.tsx`](./src/components/Header.tsx) use `Link` from `next-view-transitions`.
  * Active route indicators use `underline underline-offset-4 decoration-2 decoration-blue-900`.
* **Animations**:
  * Leverages `framer-motion` for page transitions, the spinning service wheel, and interactive hover effects. Keep spring transitions responsive.

---

## 2. Strapi Integration

* **Endpoints**:
  * Blog posts and categories are retrieved from Strapi via `/api/posts?populate=*`.
* **Environment Variables**:
  * Server-side data fetching uses `process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'`.
  * Client-side requests must use `process.env.NEXT_PUBLIC_STRAPI_URL`.
  * Fallbacks must be provided so the static landing pages render gracefully even if the Strapi backend is not currently running.
