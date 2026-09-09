# Hookpost production image.
#
# Derivative work of Postiz (AGPL-3.0) -- see NOTICE.
#
# Single runtime image containing the Next.js frontend (:4200), the NestJS
# backend (:3000) and the Temporal orchestrator, fronted by nginx. pm2
# supervises the node processes. This mirrors upstream's topology so the
# published docker-compose stays compatible.
FROM node:22.20-bookworm-slim

ARG NEXT_PUBLIC_VERSION=1.0.0
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION
ENV NODE_ENV=production

# Next.js inlines NEXT_PUBLIC_* into the client bundle at BUILD time, so these
# must be present now -- setting them only at runtime has no effect on the
# already-compiled frontend. Note NEXT_PUBLIC_RAZORPAY_KEY_ID is a publishable
# key and is meant to be visible in the browser; the secret never appears here.
ARG NEXT_PUBLIC_BACKEND_URL=""
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID=""
ARG NEXT_PUBLIC_BILLING_CURRENCY="INR"
# Left empty so pricing.ts's own default currency symbol applies.
ARG NEXT_PUBLIC_BILLING_CURRENCY_SYMBOL=""
ARG NEXT_PUBLIC_UPLOAD_DIRECTORY="/uploads"
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID \
    NEXT_PUBLIC_BILLING_CURRENCY=$NEXT_PUBLIC_BILLING_CURRENCY \
    NEXT_PUBLIC_BILLING_CURRENCY_SYMBOL=$NEXT_PUBLIC_BILLING_CURRENCY_SYMBOL \
    NEXT_PUBLIC_UPLOAD_DIRECTORY=$NEXT_PUBLIC_UPLOAD_DIRECTORY

RUN apt-get update && apt-get install -y --no-install-recommends \
      g++ \
      make \
      python3-pip \
      bash \
      nginx \
      gettext-base \
      curl \
 && rm -rf /var/lib/apt/lists/*

RUN addgroup --system www \
 && adduser --system --ingroup www --home /www --shell /usr/sbin/nologin www \
 && mkdir -p /www \
 && chown -R www:www /www /var/lib/nginx

RUN npm --no-update-notifier --no-fund --global install pnpm@10.6.1 pm2

WORKDIR /app

# Copy manifests first so dependency layers cache independently of source edits.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/orchestrator/package.json ./apps/orchestrator/
COPY apps/extension/package.json ./apps/extension/
COPY apps/commands/package.json ./apps/commands/
COPY apps/sdk/package.json ./apps/sdk/
COPY libraries ./libraries
# The frontend's postinstall runs scripts/fetch-gtm.mjs, so that script has to
# be in the context before install -- not just its package.json.
COPY apps/frontend/scripts ./apps/frontend/scripts

# The root postinstall runs prisma generate, which needs the schema in libraries/.
RUN pnpm install --frozen-lockfile

COPY . /app

RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

RUN mkdir -p /uploads && chown -R www:www /uploads

# Documents the VM default; Cloud Run overrides via $PORT.
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD curl -fsS "http://localhost:${PORT:-5000}/" >/dev/null || exit 1

ENTRYPOINT ["/app/var/docker/entrypoint.sh"]
