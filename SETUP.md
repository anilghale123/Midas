# MIDAS CMS — Setup Guide

This guide walks you through everything needed to run the MIDAS Stock Broking CMS locally and in production. Follow the steps in order — later steps depend on earlier ones.

---

## 0. Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Node.js | **20.6+** | The seed script uses Node's built-in `--env-file` flag. |
| npm | 10+ | Comes with Node 20. |
| Git | any | Optional, for cloning. |

You also need accounts for three external services (all have free tiers):

1. **MongoDB Atlas** — database
2. **Cloudinary** — file uploads (PDFs, images on notices)
3. **Upstash Redis** — login rate limiting

---

## 1. Install dependencies

```bash
npm install
```

This installs Mongoose, NextAuth v5, Cloudinary SDK, Upstash, Zod, pino, and the admin UI deps.

---

## 2. External service setup

### 2.1 MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Under **Database Access**, create a user (e.g. `midas-app`) with **readWrite** on a single database. **Do NOT** give it `atlasAdmin` — least privilege.
3. Under **Network Access**, add `0.0.0.0/0` (required for Vercel's dynamic IPs).
4. Under **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://midas-app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with the real password.

### 2.2 Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. From the **Dashboard**, copy these three values: `Cloud name`, `API Key`, `API Secret`.
3. Go to **Settings → Upload → Upload presets → Add upload preset**.
4. Configure the preset as follows:
   - **Preset name:** `midas_unsigned`
   - **Signing mode:** **Unsigned** (required — the browser uploads directly)
   - **Folder:** `midas/notices` (optional, keeps things organized)
   - **Allowed formats:** `jpg, jpeg, png, pdf, webp`
   - **Max file size:** `10000000` (10 MB)
5. Save the preset.

> **Security:** The browser uses `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` only. The `API_SECRET` is server-side (used for deletion) and **must never** be exposed to the browser.

### 2.3 Upstash Redis

1. Sign up at [upstash.com](https://upstash.com).
2. Create a new **Redis** database. Choose the region closest to your users.
3. From the database page, copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

> Create **separate Redis databases** for `development` and `production`. Sharing them pollutes rate-limit counters during testing.

---

## 3. Environment variables

1. Copy the example file:

   ```bash
   cp .env.example .env.local
   ```

2. Generate a strong `NEXTAUTH_SECRET` (48+ chars):

   ```bash
   # macOS / Linux
   openssl rand -base64 48

   # Windows PowerShell
   [Convert]::ToBase64String((1..36 | % {Get-Random -Max 256}))
   ```

3. Fill in `.env.local`:

   ```dotenv
   NODE_ENV=development
   LOG_LEVEL=info

   MONGODB_URI=mongodb+srv://midas-app:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB_NAME=midas

   NEXTAUTH_SECRET=PASTE_THE_OPENSSL_OUTPUT_HERE
   NEXTAUTH_URL=http://localhost:3000

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=midas_unsigned

   UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token

   # First admin user (used by the seed script)
   SEED_SUPERADMIN_EMAIL=admin@yourdomain.com
   SEED_SUPERADMIN_PASSWORD=use-a-strong-password-min-12-chars
   SEED_SUPERADMIN_NAME=Your Name
   ```

> **Never commit `.env.local`.** It's already gitignored.

---

## 4. Seed the first admin user

Run the seed script — it creates (or upgrades) one `SUPER_ADMIN` user using the `SEED_SUPERADMIN_*` values from `.env.local`.

```bash
npm run seed:admin
```

Expected output:
```
Created SUPER_ADMIN: admin@yourdomain.com
```

If the user already exists, it will say `Updated existing SUPER_ADMIN`.

> The password is hashed with bcrypt (12 rounds) — it is never stored as plaintext.

---

## 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public site loads as before.

### Verify the admin works

1. Visit [http://localhost:3000/admin](http://localhost:3000/admin).
   You should be redirected to `/admin/login?callbackUrl=%2Fadmin`.
2. Log in with the credentials you put in `SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD`.
3. You should land on the admin dashboard with stat cards (Notices, FAQs, Services, Users, Orphaned Assets).
4. Go to **Notices → New notice**.
5. Fill in a title, pick a category, write some Markdown content, optionally upload a PDF, click **Create notice**.
6. Open a new tab and visit [http://localhost:3000/notices](http://localhost:3000/notices) — your new notice appears. Cache is purged on every mutation via `revalidateTag('notices')`.
7. Click the notice to view it at `/notices/[slug]`.

### Check the health endpoint

```bash
curl http://localhost:3000/api/health
# {"status":"ok","db":"connected"}
```

---

## 6. Build for production

```bash
npm run build
```

`@t3-oss/env-nextjs` validates **all** environment variables at build time. If anything is missing, the build fails fast with a clear error — by design.

```bash
npm run start
```

Serves the production build on port 3000.

---

## 7. Deploying to Vercel

1. Push to GitHub.
2. In Vercel, **Import** the repo.
3. Under **Settings → Environment Variables**, add every key from `.env.local`. Create **separate values** for `Production` and `Preview`:
   - Use **separate Cloudinary upload presets** for prod/preview.
   - Use **separate Upstash Redis databases** for prod/preview.
   - Update `NEXTAUTH_URL` to your real domain (e.g. `https://midas.com.np`).
4. Deploy.
5. Run the seed script **once** against the production DB to create the admin:
   ```bash
   # Locally, with prod MONGODB_URI temporarily in .env.local:
   npm run seed:admin
   ```

> **Vercel uptime monitoring:** point it at `/api/health`. The endpoint requires no auth and checks the Mongo connection.

---

## 8. Project structure

```
src/
├── env.js                           # Fail-fast env validation (t3-env)
├── proxy.js                         # Next 16's renamed middleware — auth gate for /admin
├── app/
│   ├── admin/                       # Admin CMS (RBAC-gated)
│   │   ├── layout.js
│   │   ├── page.js                  # Dashboard
│   │   ├── login/
│   │   └── notices/
│   ├── api/
│   │   ├── admin/notices/           # Notices CRUD API
│   │   ├── auth/[...nextauth]/      # NextAuth route handler
│   │   └── health/                  # Health check
│   └── notices/                     # Public DB-backed pages (ISR + on-demand tag revalidation)
├── components/admin/                # Admin UI components
├── lib/
│   ├── auth.js                      # NextAuth — Node, full config with Credentials
│   ├── auth.config.js               # Edge-safe config (used by proxy.js)
│   ├── mongodb.js                   # Mongoose singleton
│   ├── withAuth.js                  # requireRole + handleApi + rate limit
│   ├── ratelimit.js                 # Upstash sliding-window limiters
│   ├── cloudinary.js                # Delete + orphan-asset dead-letter
│   ├── audit.js                     # Audit log writer (strips passwords)
│   ├── slug.js                      # Collision-safe slug generator
│   ├── enums.js                     # Shared enums (kept Mongoose-free for client use)
│   ├── logger.js                    # pino instance
│   └── validations/                 # Shared Zod schemas (front + back)
├── models/                          # Mongoose schemas
└── scripts/
    └── seed-admin.mjs               # First SUPER_ADMIN bootstrap
```

---

## 9. Roles

| Role | Capabilities |
|---|---|
| **SUPER_ADMIN** | Full access: Users, Settings, hard deletes, Audit Log viewer, Orphaned Asset cleanup, all CRUD |
| **EDITOR** | Create + edit Notices and FAQs only. No delete, no user/settings access. |

RBAC is enforced **server-side** in every `/api/admin/*` route via `requireRole()`. Hiding sidebar items is for UX only — never trust the UI for auth.

---

## 10. Troubleshooting

**Build fails with `Invalid environment variables`**
Some env var in `.env.local` is missing or malformed. Read the error — it tells you exactly which key.

**`MongooseError: Operation buffering timed out`**
Either `MONGODB_URI` is wrong, or your Atlas Network Access doesn't include the IP you're calling from. Add `0.0.0.0/0`.

**`signIn` returns `error` with valid credentials**
Check `NEXTAUTH_SECRET` is at least 32 chars and `NEXTAUTH_URL` matches the URL you're hitting (no trailing slash). Restart the dev server after changing either.

**Cloudinary upload widget does nothing**
Open the browser console. Common issues:
- Upload preset name typo (must be `midas_unsigned`, signing mode = **Unsigned**)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` not set or wrong

**`429 Too Many Requests` on login**
You hit the 10-attempts-per-15-min rate limit. Wait 15 min, or flush the Upstash key in the Upstash dashboard.

**Public `/notices` page is empty after creating a notice**
The `revalidateTag('notices')` call should purge the cache instantly. If stale, hard-refresh the page. After 1 hour the ISR safety net kicks in either way.

---

## 11. What's built vs. what's pending

**Built (this pass):**
- Foundation: env, logger, Mongo singleton, all 7 models, all Zod schemas
- Auth: NextAuth v5 + Credentials + JWT + RBAC + login rate limit + audit logs
- Notices end-to-end: API, admin UI (list/create/edit/delete), Cloudinary upload + cleanup, public DB-backed pages
- Health endpoint, seed script

**Pending (per the spec, not yet built):**
- FAQs CRUD
- Services CRUD
- User management page
- Settings page (singleton)
- Audit Log viewer page
- Orphaned Assets viewer + retry UI
- `/api/admin/dashboard/stats` endpoint (the dashboard reads DB directly for now)

Each follows the same pattern as Notices — copy the structure, swap the model and Zod schema.
