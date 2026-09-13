# HouseForce Marketing Website

The **HouseForce Marketing Website** is the public web presence for HouseForce, presenting residential construction, renovation, and property keyholding services to prospective clients.

---

## Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Standalone Output)
* **UI & Animation**: React 19, Tailwind CSS, Framer Motion, Lucide Icons
* **View Transitions**: `next-view-transitions`
* **Content Source**: Strapi 5 Headless CMS (Blog posts and categories via REST API)

---

## Site Pages & Routes

* `/`: Interactive landing page with the dual-service interactive spinning wheel and company value proposition.
* `/services/construction`: Construction and renovation services catalog.
* `/services/keyholding`: Property management and keyholding packages.
* `/about`: Team member bios and company background.
* `/blog`: Blog index and articles fetched from Strapi's `/api/posts`.
* `/contact`: Consultation request form and location details.

---

## Local Development & Commands

```bash
# From repository root:
npm run dev:frontend       # Run Next.js marketing development server on port 3000
npm run build:frontend     # Build production standalone package
npm run lint:frontend      # Run ESLint on frontend
npm run typecheck:frontend # Check TypeScript types

# From frontend/ directory:
npm run dev                # Run standalone frontend on port 3000
npm run build              # Build production standalone package
npm run lint               # Run ESLint
npm run typecheck          # Run TypeScript check
```
