# Adawaty (adawatynew)

Adawaty official site — **Brand → Build → Demand**.

- **Multi-language UI**: `en`, `ar-EG`, `ja`, `es`, `it`, `fr`, `de`
- **Pricing calculator**: categorized estimate + export with a **unique serial number**
- **Backend (Neon Postgres)**: submissions stored in `lead_requests`
- **Admin dashboard**: `/admin` (requires `ADMIN_TOKEN`)

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Neon setup

See **NEON.md**:
- Create tables from `neon/schema.sql`
- Set `DATABASE_URL` + `ADMIN_TOKEN`
- Configure GitHub Actions PR database branches
