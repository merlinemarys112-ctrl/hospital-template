# Marline — split multi-tenant clinic & hospital platform

Payload CMS backend and Next.js frontend deploy on **separate servers** and communicate via one API URL.

## Apps

| App | Path | Default URL | Role |
|-----|------|-------------|------|
| Backend | `apps/backend` | http://localhost:3000 | Payload Admin + REST/GraphQL API |
| Frontend | `apps/frontend` | http://localhost:3001 | Public `/clinics/[slug]` and `/hospitals/[slug]` |
| Shared | `packages/shared` | — | Tenant enums + shared contracts |

## Quick start

```bash
pnpm install
cp .env.example apps/backend/.env   # then edit
cp .env.example apps/frontend/.env  # keep NEXT_PUBLIC_API_URL
docker compose up -d                # Postgres
pnpm dev:backend                    # terminal 1
pnpm dev:frontend                   # terminal 2
```

- Admin: http://localhost:3000/admin  
- Frontend: http://localhost:3001  

## Environment

Frontend must set:

```bash
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

Backend must set `DATABASE_URL`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `FRONTEND_URL`, `CORS_ORIGINS`, and matching `REVALIDATE_SECRET`.

## Tenancy

- `tenants` collection with `type: clinic | hospital`
- `@payloadcms/plugin-multi-tenant` scopes content + media
- Frontend always resolves tenant then queries with `where[tenant][equals]=id`

## Deploy

1. Deploy `apps/backend` to server A  
2. Deploy `apps/frontend` to server B with `NEXT_PUBLIC_API_URL` pointing at A  
3. Allow CORS/CSRF from the frontend origin on the backend  
