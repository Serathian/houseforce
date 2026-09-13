# HouseForce Customer Portal

The **HouseForce Customer Portal** is an authenticated web application built with Next.js 16 (App Router) and Tailwind CSS v4 that allows clients to monitor the progress of their construction, renovation, and keyholding projects in real time.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Standalone Output)
- **UI & Styling**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Authentication**: NextAuth.js v4 (Google OAuth exchange with Strapi JWT)
- **CMS Backend**: Strapi 5 (Headless REST API with row-level client multi-tenancy)

## Port Mapping

- Development Port: `http://localhost:3001`

## Authentication & Multi-Tenancy Architecture

1. **Invitation-Only Access**:
   - Clients must be pre-registered by HouseForce administrators in the Strapi Admin Panel (`plugin::users-permissions.user`).
   - Strapi defaults new users created without an explicit provider to `google`.
2. **Google OAuth Flow**:
   - Client signs in with Google on `/login`.
   - NextAuth passes Google's `access_token` to Strapi's `/api/auth/google/callback`.
   - Strapi validates the email against registered users and issues a Strapi JWT.
   - The JWT is stored in the encrypted session and used for all subsequent backend queries.
3. **Scoped Multi-Tenancy**:
   - Strapi's `/api/projects` and `/api/updates` endpoints filter records so clients can only view projects they are explicitly linked to.

## Environment Configuration

Create a `.env.local` inside the `portal/` directory (or configure in `docker-compose.local.yml`):

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001
STRAPI_INTERNAL_URL=http://backend:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Running Locally

To run the portal along with the full local stack (Postgres, Strapi, MinIO S3):

```bash
# From repository root
docker compose -f docker-compose.yml -f docker-compose.local.yml up
```
