# Backend Agent Guidelines: Strapi 5 Headless CMS

This guide outlines rules and architectural patterns for agents modifying or extending the **HouseForce Backend**.

---

## 1. Multi-Tenancy & Authorization Rules

* **Row-Level Security in Controllers**: Default Strapi REST controllers expose all published records to any user with `find` permission. In this codebase, **all client-facing content types must be scoped**:
  * Check `ctx.state.user`. If absent, return `ctx.unauthorized()`.
  * Resolve allowed IDs using `strapi.db.query(...).findMany(...)`.
  * **CRITICAL**: If `allowed.length === 0`, return `{ data: [], meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } } }` immediately. Never pass `id: { $in: [] }` into the query builder as it creates invalid SQL syntax in PostgreSQL.
* **Update Messages Ownership**: In `update-message.ts`, always verify that `ctx.request.body.data.update` belongs to a project where `clients: user.id` before allowing creation.

---

## 2. Strapi 5 Architecture & Document Service

* **Draft & Publish Relational Linking**:
  * In Strapi 5, entities with Draft & Publish enabled maintain separate draft and published rows sharing a common `documentId`.
  * When linking relations programmatically (such as attaching discussion messages to updates in `update-message/lifecycles.ts`), ensure the relation links across all update versions in `update_messages_update_lnk` so messages are visible in both the Strapi Admin Content Manager and the customer portal.
* **User Authentication Providers**:
  * The lifecycle subscriber in `src/index.ts` enforces `provider = provider || 'google'`. Never hardcode `provider = 'google'` unconditionally, as it breaks local dev credentials login and Bruno API test suites.

---

## 3. Email Service Desk ([`src/services/email-service.ts`](./src/services/email-service.ts))

* Outbound emails are sent via `strapi.plugin('email').service('email').send(...)`.
* Always use `replyTo: update-<id>@${getEmailDomain()}` for threading.
* Avoid HTML injection: wrap dynamic variables with `escapeHtml()` when generating email HTML.
* In inbound email webhooks ([`src/api/webhook/controllers/inbound-email.ts`](./src/api/webhook/controllers/inbound-email.ts)), verify that incoming sender emails match active Strapi Admin staff before creating project updates, and match registered project clients before creating thread replies.

---

## 4. Testing & Verification

* Always run `npm test` (or `npm test -w backend` from monorepo root) before concluding your changes.
* Tests run using Node's native test runner (`node --test tests/*.test.ts`) with `--import ./tests/register-loader.mjs`.
* Run `npm run typecheck -w backend` to ensure no TypeScript compilation issues.
* When adding new service methods or controllers, add corresponding unit tests in `tests/` leveraging the lightweight `mock-strapi.ts` fixture.
