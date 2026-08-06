# EasyFlow — web app (dashboard, OAuth callback, webhook, crons)
# Multi-stage build producing a lean standalone Next.js image for Easypanel.
#
# Migrations are NOT run automatically on boot (running two containers —
# web and worker — that both race to migrate on deploy is asking for
# trouble). Run `npm run db:migrate` once per schema change, from your
# machine or an Easypanel one-off command, against DATABASE_URL. See
# docs/easypanel.md.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
