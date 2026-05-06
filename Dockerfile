# syntax=docker/dockerfile:1
# Dockerfile for gaqno-shop (Next.js)
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./
ARG NPM_TOKEN=""
RUN --mount=type=secret,id=npm_token,required=false \
    SECRET=$(cat /run/secrets/npm_token 2>/dev/null || true) && \
    TOK="${NPM_TOKEN:-$SECRET}" && \
    if [ -z "$TOK" ] || [ "$TOK" = "REPLACE_WITH_NPM_TOKEN" ]; then \
    echo "ERROR: NPM_TOKEN must be set (Dokploy build args or buildkit secret id=npm_token, env=NPM_TOKEN)."; exit 1; \
    fi && \
    printf '%s\n' "@gaqno-development:registry=https://npm.pkg.github.com" "//npm.pkg.github.com/:_authToken=$TOK" > .npmrc && \
    npm install && \
    rm -f .npmrc

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3015

ENV PORT=3015
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
