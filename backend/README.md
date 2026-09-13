# HouseForce Backend (Strapi 5 Headless CMS)

The backend service is built on [Strapi 5](https://strapi.io/) with TypeScript, providing headless REST endpoints for the marketing frontend and customer portal, automated email service desk integration, and multi-tenant access control.

---

## Content Types & Schemas

| Content Type | UID | Description | Relations & Roles |
| :--- | :--- | :--- | :--- |
| **Project** | `api::project.project` | Customer renovation, construction, or keyholding project. | Many-to-Many `clients` (`users-permissions.user`), One-to-Many `updates`. |
| **Project Update** | `api::update.update` | Milestone update, site log entry, or timeline event. | Many-to-One `project`, One-to-Many `messages` (`update-message`), Multiple `images` (media). |
| **Update Message** | `api::update-message.update-message` | Threaded discussion reply to an update (from client or staff). | Many-to-One `update`, `authorType: 'staff' \| 'client'`, optional `clientAuthor`. |
| **Post** | `api::post.post` | Public marketing blog articles. | Many-to-Many `categories`. |
| **Category** | `api::category.category` | Service categories and blog tags. | Many-to-Many `posts`. |

---

## Key Modules & Subsystems

1. **Multi-Tenant Access Control**:
   * [`src/api/project/controllers/project.ts`](./src/api/project/controllers/project.ts) and [`src/api/update/controllers/update.ts`](./src/api/update/controllers/update.ts): Overrides `find` and `findOne` to strictly restrict records to the authenticated user (`clients: user.id`).
   * [`src/api/update-message/controllers/update-message.ts`](./src/api/update-message/controllers/update-message.ts): Verifies project ownership before allowing clients to read or post messages.
2. **Email Service Desk ([`src/services/email-service.ts`](./src/services/email-service.ts))**:
   * Outbound emails sent via `@strapi/provider-email-nodemailer` (Postmark SMTP).
   * Generates custom threading headers (`Message-ID`, `In-Reply-To`, `References`, `Reply-To: update-<id>@replies.houseforce.com`).
3. **Inbound Email Webhook ([`src/api/webhook/controllers/inbound-email.ts`](./src/api/webhook/controllers/inbound-email.ts))**:
   * Public webhook endpoint (`POST /webhooks/inbound-email`) receiving incoming Postmark/SendGrid emails.
   * Parses stripped body and appends replies as `update-message` entries.
4. **Media Upload Provider**:
   * Configured with `@strapi/provider-upload-aws-s3` targeting MinIO locally and AWS S3 / DigitalOcean Spaces in production.

---

## Local Development & Testing

```bash
# Typecheck and run all 24 native unit & lifecycle tests
npm test

# Run TypeScript check only
npm run typecheck

# Start Strapi in development mode (requires local PostgreSQL)
npm run develop
```
