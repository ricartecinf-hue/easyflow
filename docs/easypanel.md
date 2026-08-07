# Deploy on Easypanel

Alternative to the Vercel + Railway split in [setup.md](setup.md). Everything
runs on your own Easypanel instance instead: one Postgres service, one Redis
service, and two app services built from this repo (`Dockerfile` for the web
app, `Dockerfile.worker` for the worker), plus three cron jobs.

The Meta app setup (Steps 4–9 in [setup.md](setup.md)) is identical regardless
of host — do that part from there. This page only replaces the "Hosting and
your domain" / Railway / Vercel sections.

## 1. Postgres and Redis

In your Easypanel project:

1. **+ Service → Postgres.** Name it `easyflow-db`. Note the internal
   connection string Easypanel shows you (something like
   `postgres://postgres:<password>@easyflow-db:5432/postgres`).
2. **+ Service → Redis.** Name it `easyflow-redis`. Note its internal URL
   (`redis://easyflow-redis:6379`).

Both are only reachable from other services inside the same Easypanel
project — that's fine, the web app and worker live there too.

## 2. Web app service

**+ Service → App**, source: this GitHub repo (`ricartecinf-hue/easyflow`),
branch `main`, build method **Dockerfile**, path `Dockerfile`.

Set the domain first (Easypanel gives you a free `*.easypanel.host` subdomain,
or attach your own domain) — you need it for `NEXTAUTH_URL` below and for the
Meta OAuth/webhook URLs later.

Environment variables (Service → Environment):

| Variable | Value |
| --- | --- |
| `NEXTAUTH_URL` | Your Easypanel domain, e.g. `https://easyflow.yourdomain.com` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `CRON_SECRET` | `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | `openssl rand -hex 32` — **must match the worker's value exactly** |
| `DATABASE_URL` | `postgres://postgres:<password>@easyflow-db:5432/postgres` |
| `REDIS_URL` | `redis://easyflow-redis:6379` |
| `RESEND_API_KEY` | From Resend |
| `EMAIL_FROM` | A sender on your verified Resend domain |
| `META_GRAPH_API_VERSION` | e.g. `v25.0` |
| `INSTAGRAM_APP_ID` | From the Meta app (setup.md Step 5) |
| `INSTAGRAM_APP_SECRET` | From the Meta app |
| `FACEBOOK_APP_SECRET` | From the Meta app |
| `WEBHOOK_VERIFY_TOKEN` | Any random string, reused in Meta's webhook config |

Health check path: `/api/health` (port `3000`).

Deploy. Easypanel builds the Dockerfile and starts `node server.js`.

## 3. Worker service

**+ Service → App**, same repo/branch, build method **Dockerfile**, path
`Dockerfile.worker`. No domain needed — this process only talks to Postgres
and Redis.

Environment variables: the **same** `DATABASE_URL`, `REDIS_URL`,
`ENCRYPTION_KEY`, and `NEXTAUTH_URL` as the web app (tracked links in DMs are
built from `NEXTAUTH_URL`, so it has to match). `ENCRYPTION_KEY` mismatch
between the two services means every send fails to decrypt the stored
Instagram token — double-check it's pasted identically in both.

Optional tuning vars (`COMMENT_POLL_INTERVAL_MS`, `COMMENT_POLL_MAX_PER_SWEEP`,
`COMMENT_POLL_LOOKBACK_HOURS`) — defaults are fine to start, see setup.md.

Deploy. This container has no HTTP port; it just needs to stay running. Check
`node server.js`... actually check the logs for `[DM Worker] Started`.

## 4. Run the database migration

Do this once before the first deploy takes traffic, and again after any deploy
that adds a Prisma migration. The images intentionally don't run
`prisma migrate deploy` on boot — with two containers (web + worker) both
starting at once, having both race to migrate the same database on every
deploy is how you get a corrupted migration history.

From your machine, using Easypanel's public/external Postgres connection
string (Postgres service → Connect tab; internal `easyflow-db` hostnames only
resolve inside the Easypanel project's network):

```bash
cd /Users/ricardopereira/Sistemas/EasyFlow
DATABASE_URL="postgres://postgres:<password>@<public-host>:<port>/postgres" npm run db:migrate
```

Alternatively, use Easypanel's built-in terminal/console on the **worker**
service (not the web service — the web image is a pruned `standalone` build
without the Prisma CLI; the worker image has full `node_modules`, migration
CLI included) and run `npm run db:migrate` there. It already has the correct
internal `DATABASE_URL`.

## 5. Cron jobs

`vercel.json`'s crons don't run on Easypanel. Recreate the same three
schedules as Easypanel **Cron Jobs** (project-level, not tied to a specific
app service), each running `curlimages/curl` against the web app's internal
address:

| Schedule | Command |
| --- | --- |
| `0 5 * * *` | `curl -sf -H "Authorization: Bearer $CRON_SECRET" http://easyflow-web:3000/api/cron/refresh-tokens` |
| `0 6 * * *` | `curl -sf -H "Authorization: Bearer $CRON_SECRET" http://easyflow-web:3000/api/cron/attach-next-reel` |
| `0 7 * * *` | `curl -sf -H "Authorization: Bearer $CRON_SECRET" http://easyflow-web:3000/api/cron/snapshot-followers` |

Replace `easyflow-web` with whatever you actually named the web service, and
set `CRON_SECRET` in the cron job's own environment to the same value as the
web app's `CRON_SECRET`.

## 6. Meta app + go live

Continue from **Step 4** in [setup.md](setup.md), using your Easypanel domain
everywhere it says "Vercel domain":

- OAuth redirect: `https://easyflow.yourdomain.com/api/instagram/callback`
- Webhook callback: `https://easyflow.yourdomain.com/api/webhook`
- Privacy/terms/data-deletion URLs for Publish: same domain, `/privacy`,
  `/terms`, `/data-deletion`

## 7. Verify

Hit `https://easyflow.yourdomain.com/api/health`. `database`, `redis`, and
`queue` should be `ok`, and `worker.healthy` should be `true` once the worker
container has sent its first heartbeat (up to 30s after it starts). If
`worker.healthy` stays `false`, check the worker service's logs and confirm
it has the same `REDIS_URL` as the web app.
