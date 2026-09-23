# Kindling — Vercel + Supabase

This is the cloud-ready version of Kindling.

- Frontend: static `index.html`
- API: Vercel Functions under `api/`
- Persistence: Supabase Postgres
- Public reading: no login
- Contributing: login required
- Admin deletion: admin accounts only
- No signup flow

## Supabase setup

1. Create/open a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Supabase Settings → API Keys, copy the Project URL and the **Secret key** (`sb_secret_...`). Keep the secret key server-side only.

## Vercel environment variables

Add these to the Vercel project:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SECRET_KEY` = your Supabase secret key

Do not put the secret key in `index.html`, GitHub, or any `NEXT_PUBLIC_*` variable.

## Deploy

Import the GitHub repository into Vercel. No build command is required for the static page/API setup. Vercel will deploy `index.html` and the `api/` functions.

## Demo accounts

- alvin / Alvin123 — admin
- yasha / Yasha123 — admin
- brittney / Brittney123 — contributor
- marcus / Marcus123 — contributor
- priya / Priya123 — contributor
