# MIDAS Stock Broking — Dynamic CMS Architecture & Build Instructions

> **You are an expert Senior Full-Stack Developer specialising in Next.js, MongoDB, and production-grade security.** I need you to build a robust, production-grade Admin CMS for my existing Next.js (App Router) Midas Stock broking website. I have already built the frontend as static Next.js pages using Claude AI. Now I need the full backend + Admin CMS portal to manage all website content dynamically.
>
> **Before writing any code:** Identify any undefined entities referenced in the RBAC table (Services, Settings) and either ask for clarification or scaffold placeholder schemas marked clearly as `// TODO: define fields with client`. Do not silently skip them or invent their structure.

---

## Part 1: System Architecture & Data Schema

```json
{
  "projectTitle": "MIDAS CMS — Dynamic RBAC System",
  "techStack": {
    "frontend": "Next.js 14+ (App Router)",
    "backend": "Next.js API Routes (Serverless on Vercel)",
    "database": "MongoDB Atlas with Mongoose ODM",
    "auth": "NextAuth.js v5 (Credentials Provider + JWT strategy)",
    "media": "Cloudinary (Upload Widget in browser + Admin API for cleanup)",
    "validation": "Zod (shared between frontend forms and backend API routes)",
    "rateLimit": "Upstash Redis + @upstash/ratelimit",
    "logging": "pino + pino-pretty (structured JSON logs, Vercel-compatible)",
    "envValidation": "@t3-oss/env-nextjs (fail-fast at build time on missing secrets)"
  },
  "roles": {
    "SUPER_ADMIN": "Full access: Users, Notices, FAQs, Settings, Services, AuditLog viewer, hard deletes, orphaned-asset cleanup",
    "EDITOR": "Limited access: Create and edit Notices and FAQs only. No delete, no user management, no settings."
  },
  "databaseSchemas": [
    {
      "collection": "users",
      "fields": [
        "name: String (required)",
        "email: String (required, unique, lowercase)",
        "passwordHash: String (bcrypt, min 12 rounds)",
        "role: Enum ['SUPER_ADMIN', 'EDITOR'] (default: EDITOR)",
        "isActive: Boolean (default: true)",
        "lastLoginAt: Date",
        "createdAt: Date (auto)",
        "updatedAt: Date (auto)"
      ]
    },
    {
      "collection": "notices",
      "fields": [
        "title: String (required)",
        "slug: String (unique, auto-generated from title, collision-safe with suffix)",
        "content: String (rich text / markdown)",
        "category: Enum ['General', 'Market', 'Regulatory', 'IPO', 'Dividend'] (extensible)",
        "authorId: ObjectId ref Users (required)",
        "attachmentUrl: String (Cloudinary secure_url)",
        "cloudinaryPublicId: String (for orphan cleanup on delete)",
        "isActive: Boolean (default: true)",
        "publishedAt: Date",
        "createdAt: Date (auto)",
        "updatedAt: Date (auto)"
      ]
    },
    {
      "collection": "faqs",
      "fields": [
        "question: String (required)",
        "answer: String (required)",
        "category: String",
        "order: Number (for drag-and-drop reordering)",
        "isActive: Boolean (default: true)",
        "createdAt: Date (auto)",
        "updatedAt: Date (auto)"
      ]
    },
    {
      "collection": "services",
      "note": "TODO — scaffold with placeholder fields and mark clearly. Confirm field structure with client before implementing CRUD UI.",
      "fields": [
        "title: String (required)",
        "description: String",
        "iconUrl: String (Cloudinary)",
        "cloudinaryPublicId: String",
        "isActive: Boolean (default: true)",
        "order: Number",
        "createdAt: Date (auto)",
        "updatedAt: Date (auto)"
      ]
    },
    {
      "collection": "settings",
      "note": "TODO — singleton document pattern (upsert on _id: 'global'). Confirm keys with client.",
      "fields": [
        "_id: 'global' (singleton)",
        "siteName: String",
        "contactEmail: String",
        "maintenanceMode: Boolean",
        "socialLinks: Object",
        "updatedBy: ObjectId ref Users",
        "updatedAt: Date"
      ]
    },
    {
      "collection": "auditlogs",
      "purpose": "Compliance log — mandatory for a SEBI-regulated broking platform",
      "fields": [
        "userId: ObjectId ref Users (who performed the action)",
        "userEmail: String (denormalised snapshot in case user is deleted)",
        "action: Enum ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGIN_FAILED', 'SETTINGS_CHANGE']",
        "targetCollection: String (e.g. 'notices')",
        "targetId: ObjectId (the affected document)",
        "before: Mixed (JSON snapshot before change — omit passwords)",
        "after: Mixed (JSON snapshot after change — omit passwords)",
        "ipAddress: String",
        "userAgent: String",
        "timestamp: Date (auto, indexed)"
      ]
    },
    {
      "collection": "orphanedassets",
      "purpose": "Dead-letter queue for Cloudinary deletes that fail during record deletion",
      "fields": [
        "cloudinaryPublicId: String (required)",
        "sourceCollection: String (e.g. 'notices')",
        "sourceId: ObjectId",
        "failedAt: Date (auto)",
        "retryCount: Number (default: 0)",
        "lastError: String",
        "resolvedAt: Date (null until manually or automatically cleaned)"
      ]
    }
  ]
}
```

---

## Part 2: Core Architecture Requirements

### 2.1 Database — Mongoose Singleton & Connection Hardening

- Create `src/lib/mongodb.js` using the **Mongoose Singleton pattern** to ensure only one connection pool is reused across Vercel Serverless cold starts.
- Set explicit connection options: `serverSelectionTimeoutMS: 5000`, `socketTimeoutMS: 30000`, `maxPoolSize: 10`.
- If the connection fails at startup, log a structured error with `pino` and throw — do not silently swallow the error.
- Create `src/lib/logger.js` exporting a configured `pino` instance with `level: process.env.LOG_LEVEL ?? 'info'` and serializers for `req`, `res`, and `err`. Use this logger in every API route instead of `console.log`.

### 2.2 Environment Variable Validation

- Use `@t3-oss/env-nextjs` to define and validate all required environment variables in `src/env.js`.
- Required server vars: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
- Required client (public) vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- The build **must fail** if any required variable is missing. This prevents silent misconfiguration on Vercel.

### 2.3 Validation — Zod Shared Schemas

- Create `src/lib/validations/` with individual schema files: `notice.schema.js`, `faq.schema.js`, `user.schema.js`, `service.schema.js`.
- Each file exports both a **base Zod schema** (used on the backend API) and a **form schema** (used in react-hook-form, may strip server-only fields like `authorId`).
- Never duplicate validation logic between frontend and backend — import from the shared schema files.

---

## Part 3: Authentication & RBAC

### 3.1 NextAuth.js Setup

- Configure NextAuth with a **Credentials Provider** in `src/lib/auth.js` (the `authOptions` object).
- Use **JWT strategy** (not database sessions) for Vercel compatibility — store `id`, `email`, `name`, and `role` in the JWT payload.
- In the `jwt` callback, attach the user's `role` from the database lookup.
- In the `session` callback, expose `session.user.role` to the client.
- On every successful login, update `user.lastLoginAt` and write an `AuditLog` entry with action `LOGIN` and the client's IP from request headers (`x-forwarded-for`).
- On failed login (wrong password / unknown email), write an `AuditLog` entry with action `LOGIN_FAILED` — do **not** expose which field was wrong in the API response (return generic "Invalid credentials").

### 3.2 Server-Side Role Guard (apply to every protected API route)

Create a reusable helper `src/lib/withAuth.js`:

```js
// Usage in any API route:
// const session = await requireRole(req, ['SUPER_ADMIN', 'EDITOR']);
// If unauthorised, it throws and returns a 401/403 JSON response automatically.
```

- Every API route inside `/app/api/admin/...` **must** call this helper as its first operation.
- Never rely solely on UI hiding for access control.
- `EDITOR` role attempting a `DELETE` or accessing `/api/admin/users` must receive `403 Forbidden`.

### 3.3 Middleware

- Create `src/middleware.js` to protect all `/admin` routes.
- Redirect unauthenticated users to `/admin/login?callbackUrl=<original-path>`.
- After successful login, redirect back to the `callbackUrl`.
- Exclude `/admin/login` from the middleware matcher.

### 3.4 Rate Limiting (brute-force protection)

- Install `@upstash/ratelimit` and `@upstash/redis`.
- Apply rate limiting **specifically** to `POST /api/auth/callback/credentials` (the NextAuth login endpoint) using a sliding window: **10 attempts per IP per 15 minutes**.
- Return `429 Too Many Requests` with a `Retry-After` header when the limit is exceeded.
- Also apply a general rate limit (100 req/min per IP) to all `/api/admin/...` routes via the `withAuth` helper.

---

## Part 4: Media Strategy — Cloudinary

### 4.1 Upload (Client-Side Widget)

- Use the **Cloudinary Upload Widget** directly in the browser to bypass Vercel's 10-second serverless execution limit.
- Configure the widget using `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- The upload preset **must be created server-side in the Cloudinary dashboard** as an **unsigned preset** with restricted file types (`jpg, jpeg, png, pdf, webp`) and a max file size of `10 MB`. Never expose `CLOUDINARY_API_SECRET` to the browser.
- After a successful upload, the widget returns `{ secure_url, public_id }`. Send **only these two values** to the API — the API stores them in the document.
- Validate file type and size client-side before opening the widget to give immediate feedback.

### 4.2 Cleanup — Orphan Prevention (Critical)

When a Notice (or Service) is deleted via the API:

1. Attempt to call the Cloudinary Admin API to delete the asset by `public_id`.
2. **If the Cloudinary delete succeeds:** proceed to delete the MongoDB document. Log the operation via `pino`.
3. **If the Cloudinary delete fails:** do **not** abort the MongoDB deletion (the record is the source of truth). Instead, write the `public_id`, `sourceCollection`, `sourceId`, error message, and timestamp to the `orphanedassets` collection as a dead-letter queue entry. Alert via log so the failure is visible in Vercel logs.
4. SUPER_ADMIN dashboard must include an **"Orphaned Assets"** tab that lists unresolved entries and provides a "Retry Cleanup" button that re-attempts the Cloudinary delete.

---

## Part 5: Admin UI Dashboard (`/admin`)

### 5.1 Tech Stack

- **Styling:** Tailwind CSS + shadcn/ui components (Table, Dialog, Form, Button, Badge, Tabs, Skeleton, Toaster).
- **Forms:** `react-hook-form` + `@hookform/resolvers/zod` using the shared Zod schemas.
- **Notifications:** `sonner` for success/error toasts.
- **Icons:** `lucide-react`.

### 5.2 Layout & Navigation

Create a persistent sidebar layout at `src/app/admin/layout.jsx`:

| Sidebar Item      | Visible to         | Route                  |
|-------------------|--------------------|------------------------|
| Dashboard         | All                | `/admin`               |
| Notices           | All                | `/admin/notices`       |
| FAQs              | All                | `/admin/faqs`          |
| Services          | All                | `/admin/services`      |
| Users             | SUPER_ADMIN only   | `/admin/users`         |
| Settings          | SUPER_ADMIN only   | `/admin/settings`      |
| Audit Log         | SUPER_ADMIN only   | `/admin/audit-log`     |
| Orphaned Assets   | SUPER_ADMIN only   | `/admin/orphaned-assets` |

- Show the current user's name and role in the sidebar footer.
- Sidebar items not permitted for the current role must be hidden (UI) **and** blocked server-side (RBAC).

### 5.3 Data Tables (Notices, FAQs, Services)

Each table must include:

- **Pagination:** Server-side, offset-based (page + limit query params). Default: 20 rows per page.
- **Search:** `?search=` query param hitting a MongoDB text index on `title` + `content` for Notices, `question` + `answer` for FAQs.
- **Filters:** Filter by `category` (Notices) and `isActive` status (all collections).
- **Sort:** Sortable columns with `?sort=createdAt&order=desc` query params.
- **Columns:** Title, Category, Status (Active/Inactive badge), Author, Date, Actions (Edit / Delete).
- **Delete confirmation:** Always use a shadcn `AlertDialog` — never a browser `confirm()`.

### 5.4 Forms & UX

- **Optimistic UI:** On create/edit/delete, update the local state immediately before the API response confirms. Roll back on error with a toast notification.
- **Loading states:** All submit buttons must show a spinner and be disabled during API calls to prevent double-submission. Use debouncing (300 ms) on search inputs.
- **Slug preview:** On the Notice creation form, show a live preview of the auto-generated slug as the user types the title (replicated client-side from the server slug logic).
- **Rich text / Markdown:** Use a lightweight editor (e.g. `@uiw/react-md-editor` or `react-quill`) for Notice content. Store as Markdown.

### 5.5 Dashboard Home (`/admin`)

Show summary cards: total Notices, total FAQs, total Services, total Users, and count of Orphaned Assets requiring attention. Fetch via a single `/api/admin/dashboard/stats` endpoint.

---

## Part 6: API Route Design

All routes under `/app/api/admin/` follow this pattern:

```
GET    /api/admin/notices          → list (paginated, search, filter, sort)
POST   /api/admin/notices          → create (EDITOR+)
GET    /api/admin/notices/:id      → single record
PUT    /api/admin/notices/:id      → update (EDITOR+, write AuditLog before+after)
DELETE /api/admin/notices/:id      → delete + Cloudinary cleanup (SUPER_ADMIN only)

GET    /api/admin/faqs             → list
POST   /api/admin/faqs             → create (EDITOR+)
PUT    /api/admin/faqs/:id         → update (EDITOR+)
PUT    /api/admin/faqs/reorder     → bulk order update (EDITOR+)
DELETE /api/admin/faqs/:id         → delete (SUPER_ADMIN only)

GET    /api/admin/users            → list (SUPER_ADMIN only)
POST   /api/admin/users            → create new admin user (SUPER_ADMIN only)
PUT    /api/admin/users/:id        → update role / isActive (SUPER_ADMIN only)
DELETE /api/admin/users/:id        → soft-delete / deactivate (SUPER_ADMIN only, cannot delete self)

GET    /api/admin/settings         → fetch singleton (SUPER_ADMIN only)
PUT    /api/admin/settings         → upsert singleton (SUPER_ADMIN only, write AuditLog)

GET    /api/admin/audit-log        → paginated, filterable by action/user/date (SUPER_ADMIN only)

GET    /api/admin/orphaned-assets  → list unresolved (SUPER_ADMIN only)
POST   /api/admin/orphaned-assets/:id/retry → retry Cloudinary delete (SUPER_ADMIN only)

GET    /api/admin/dashboard/stats  → aggregate counts (all roles)
```

Every mutating endpoint (`POST`, `PUT`, `DELETE`) must:
1. Call `requireRole()` first.
2. Validate request body with Zod — return `400` with field-level errors on failure.
3. Write to `AuditLog` with before/after snapshots.
4. Call `revalidatePath()` and/or `revalidateTag()` to purge Next.js cache for the affected public page.
5. Return structured JSON: `{ success: true, data: {...} }` or `{ success: false, error: '...' }`.

---

## Part 7: Public-Facing Page Integration

- Replace all static data on public-facing pages (`/notices`, `/faqs`, `/services`) with **server-side fetches** to the MongoDB collections via internal API or direct Mongoose calls in Server Components.
- Use `fetch` with `{ next: { tags: ['notices'] } }` so `revalidateTag('notices')` in the CMS API instantly purges the public page cache.
- ISR fallback: set `revalidate = 3600` (1 hour) as a safety net in addition to on-demand revalidation.
- Public pages must only return documents where `isActive === true`.

---

## Part 8: System Integrity & Edge Cases

| Concern | Implementation |
|---|---|
| Slug collision | Append `-2`, `-3`, etc. Check uniqueness with a DB query before saving. |
| Atomic updates | Use Mongoose `findByIdAndUpdate` with `{ new: true, runValidators: true }`. Never fetch-then-save. |
| Cloudinary orphan on failed delete | Write to `orphanedassets` dead-letter collection (see §4.2). |
| Double-submission | Button disabled + spinner during API call. Idempotency key optional for creates. |
| EDITOR attempting SUPER_ADMIN action | `requireRole()` returns `403` before any DB query runs. |
| User deleting own account | Backend check: if `session.user.id === targetId`, return `400 "Cannot delete your own account"`. |
| MongoDB "Too Many Connections" | Mongoose singleton in `src/lib/mongodb.js` — one pool reused across all serverless invocations. |
| Missing env vars | `@t3-oss/env-nextjs` schema fails the build before deployment. |
| Brute-force login | Upstash rate limit: 10 attempts / 15 min per IP on the auth endpoint. |
| Sensitive data in AuditLog | Strip `passwordHash` from all before/after snapshots before writing to AuditLog. |
| Pagination cursor drift | Use `skip/limit` with a stable `sort: { createdAt: -1, _id: -1 }` to prevent drift when records are added during browsing. |

---

## Part 9: Deployment Checklist (Vercel + MongoDB Atlas)

- **MongoDB Atlas:** Whitelist `0.0.0.0/0` for Vercel dynamic IPs. Enable Atlas audit logging. Use a dedicated DB user with least-privilege (readWrite on the app DB only).
- **Vercel Environment Groups:** Separate `MONGODB_URI`, `CLOUDINARY_*`, and `UPSTASH_*` values for `preview` and `production` environments.
- **Cloudinary:** Create separate upload presets for dev and prod. Never share a production preset with development.
- **Upstash Redis:** Create separate Redis databases for preview and production to avoid rate-limit pollution during testing.
- **Health check:** Expose `GET /api/health` → `{ status: 'ok', db: 'connected' }` (checks Mongoose connection state, no auth required). Used by Vercel uptime monitoring.

---

## Part 10: Build Order (Follow Strictly)

1. `src/env.js` — env validation schema (fail fast on missing vars).
2. `src/lib/logger.js` — pino logger instance.
3. `src/lib/mongodb.js` — Mongoose singleton.
4. `src/models/` — all Mongoose schemas (User, Notice, FAQ, Service, Settings, AuditLog, OrphanedAsset).
5. `src/lib/validations/` — all shared Zod schemas.
6. `src/lib/auth.js` + `src/app/api/auth/[...nextauth]/route.js` — NextAuth with role-aware JWT.
7. `src/middleware.js` — route protection + redirect.
8. `src/lib/withAuth.js` — reusable role-guard helper + rate limiter.
9. `src/lib/cloudinary.js` — Cloudinary Admin SDK helper (delete by public_id, orphan fallback).
10. API routes — in order: notices → faqs → services → users → settings → audit-log → orphaned-assets → dashboard/stats → health.
11. Admin UI — layout → dashboard → notices CRUD → faqs CRUD → services CRUD → users → settings → audit log → orphaned assets.
12. Public page integration — replace static data with DB-backed Server Components + revalidateTag.
13. End-to-end test: login → create notice → verify public page updates → delete notice → verify Cloudinary cleanup (or orphan queue entry).