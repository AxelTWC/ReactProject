# FitTrack Web

This project runs on PostgreSQL only (Azure Database for PostgreSQL compatible).

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment in `.env`:

```env
DATABASE_URL="postgresql://ece1724admin:<password>@ece1724-postgresql-server.postgres.database.azure.com:5432/postgres?schema=public&sslmode=require"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AZURE_STORAGE_CONNECTION_STRING="<your-azure-storage-connection-string>"
AZURE_STORAGE_CONTAINER_NAME="fittrack-uploads"
```

## Run locally

Use the normal dev command:

```bash
npm run dev
```

What `npm run dev` does:
- `prisma generate`
- `prisma db push`
- `next dev`

No mode flag is required.

## Useful DB commands

```bash
npm run db:generate
npm run db:push
```

## Notes

- If your PostgreSQL password contains URL-reserved characters (`@`, `#`, `%`, `/`, `:`), URL-encode it in `DATABASE_URL`.
- For Azure PostgreSQL, `sslmode=require` is usually enough.
