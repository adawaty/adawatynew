# Neon backend setup (adawatynew)

This project uses **Neon Postgres** for storing submissions from:
- Pricing calculator exports (with a unique serial)
- Contact form messages

## 1) Create tables in Neon

Open your Neon SQL Editor (main branch) and run:

- `neon/schema.sql`

## 2) Environment variables

### Local development
Create `.env.local` (or update it) with:

- `DATABASE_URL=...` (from Neon)
- `ADMIN_TOKEN=...` (any strong secret string)

### Production (Vercel)
Set the same environment variables in your Vercel project settings.

## 3) Admin dashboard

Open:

- `/admin`

Paste `ADMIN_TOKEN` to view submissions.

## 4) GitHub Actions: PR preview branches

Workflow: `.github/workflows/neon-preview-branches.yml`

Add these in GitHub repo settings:

- **Repository variable**: `NEON_PROJECT_ID=calm-moon-05727272`
- **Repository secret**: `NEON_API_KEY=<your neon api key>`

On every PR open/reopen/synchronize, a preview database branch is created.
On PR close, it’s deleted.
