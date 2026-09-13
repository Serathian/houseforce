# Portal Agent Guidelines: Customer Portal (Next.js 16)

This guide outlines rules and architectural patterns for agents modifying or extending the **HouseForce Customer Portal** (`portal/`).

---

## 1. Authentication & Session Handling

* **Dual Authentication Modes**:
  * **Production (Google OAuth)**: Handled in [`src/lib/auth.ts`](./src/lib/auth.ts). NextAuth authenticates with Google, forwards the access token to Strapi's `/api/auth/google/callback`, and stores the resulting Strapi JWT in the JWT and session tokens (`session.strapiToken`).
  * **Local Development (Credentials)**: Active when `NEXT_PUBLIC_ENABLE_DEV_LOGIN=true`. Uses `CredentialsProvider` calling Strapi's `/api/auth/local`. The `/login` page renders a 1-click login button for `client@example.com` (`password123`).
* **Route Protection**:
  * Always maintain [`src/middleware.ts`](./src/middleware.ts). Do not rename this file. It ensures all dashboard routes require an active NextAuth session.
  * In server components, always verify `session?.strapiToken`. If invalid or expired (HTTP 401 from Strapi), redirect to `/login?error=SessionExpired`.

---

## 2. Media & Timeline Population

* **Strapi Deep Population**:
  * In [`src/app/(dashboard)/projects/[documentId]/page.tsx`](./src/app/(dashboard)/projects/[documentId]/page.tsx), both media and messages must be deeply populated:
    ```ts
    ?filters[documentId][$eq]=${documentId}&populate[updates][populate][0]=images&populate[updates][populate][1]=messages
    ```
* **Media URL Resolution**:
  * Always use `resolveMediaUrl()` when rendering images:
    * Replaces internal Docker MinIO URLs (`http://minio:9000`) with browser-accessible `http://localhost:9000`.
    * Prefixes relative Strapi paths (`/uploads/...`) with `NEXT_PUBLIC_STRAPI_URL`.
  * Support both inline rich-text images via custom `ReactMarkdown` components (`img: ({ src, alt }) => <img ... />`) and attached photo galleries (`update.images`).

---

## 3. UI & Styling Guidelines

* **Tailwind CSS v4**: Uses `@tailwindcss/postcss` with modern utility classes and `@tailwindcss/typography` (`prose prose-slate`).
* **Interactive Threads ([`src/components/UpdateThread.tsx`](./src/components/UpdateThread.tsx))**:
  * Includes `Cmd+Enter` / `Ctrl+Enter` keydown listeners on the textarea.
  * Always display user-facing error banners if a message fails to submit.
* **Support CTA ([`src/components/SupportCTA.tsx`](./src/components/SupportCTA.tsx))**:
  * The modal popup dialog must remain mountable for logged-in users when opened via [`SupportTriggerButton`](./src/components/SupportTriggerButton.tsx) on the dashboard empty state.
  * The persistent floating launcher button ("Need Help?") is only shown when unauthenticated to prevent overlapping the mobile navigation pill.
