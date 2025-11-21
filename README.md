## TinyLink

TinyLink is a compact bit.ly-style URL shortener built with Next.js 16 (App Router), Prisma, and Postgres. It offers a polished dashboard to create, search, and delete short links, a stats page for each code, redirect tracking, and an operational health endpoint.

### Tech stack
- Next.js 16 App Router + React Server Components
- Prisma + Postgres (Neon friendly)
- Tailwind CSS (v4 preview)
- SWR for realtime UI refresh

---

## Getting Started

### 1. Configure environment
Copy the sample env file and fill in your credentials:

```bash
cp env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Neon/Render/Railway). |
| `NEXT_PUBLIC_SITE_URL` | Base URL for generating full short links (e.g., `tiny-link-self.vercel.app`). |

### 2. Install dependencies

```bash
npm install
```

### 3. Apply migrations

```bash
npm run prisma:migrate -- --name init
```

For production/CI use `npm run prisma:deploy`.

### 4. Run locally

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to access the dashboard.

### 5. Build for production

```bash
npm run build
npm start
```

---

## API Reference

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/healthz` | Returns uptime/version for monitoring. |
| `GET` | `/api/links` | List all links. Optional `?search=` query to filter by code or URL. |
| `POST` | `/api/links` | Create a new short link. Body: `{ url: string, code?: string }`. Returns `409` if code exists. |
| `GET` | `/api/links/:code` | Detailed stats for a specific code. |
| `DELETE` | `/api/links/:code` | Delete a link; redirect stops responding. |
| `GET` | `/code/:code` | Stats page (HTML). |
| `GET` | `/:code` | 302 redirect to the original URL and increments counters. Returns 404 when missing. |

---

## Deployment Notes

1. Provision a Neon (or compatible) Postgres database.
2. Set the `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` variables in your hosting provider (Vercel/Render/Railway).
3. Run `npm run prisma:deploy` or `npx prisma migrate deploy` as part of your deploy script.
4. Deploy the Next.js app (`npm run build`).

