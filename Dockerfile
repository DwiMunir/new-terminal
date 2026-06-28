# Lean production image for Next.js (standalone) + Payload + SQLite.
# node:22-slim (glibc) so sharp & @libsql/client prebuilt binaries work reliably.
# syntax=docker/dockerfile:1

############ base ############
FROM node:22-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=/pnpm:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

############ deps (cached) ############
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

############ builder ############
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dummy values just to satisfy the build; real ones are injected at runtime.
# The "/" page is force-dynamic, so the build never touches the database.
ENV PAYLOAD_SECRET=build-placeholder
ENV DATABASE_URI=file:/tmp/build.db
RUN pnpm build

############ runner ############
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# uid 1001 owns /app + the data dir (sqlite db + media uploads live in /app/data).
RUN useradd -m -u 1001 nodeapp && mkdir -p /app/data/media && chown -R nodeapp:nodeapp /app
COPY --from=builder --chown=nodeapp:nodeapp /app/public ./public
COPY --from=builder --chown=nodeapp:nodeapp /app/.next/standalone ./
COPY --from=builder --chown=nodeapp:nodeapp /app/.next/static ./.next/static
USER nodeapp
EXPOSE 3000
CMD ["node", "server.js"]
