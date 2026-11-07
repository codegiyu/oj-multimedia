FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
# Build tools such as @tailwindcss/postcss are dev dependencies. Explicitly
# include them because the build environment may set NODE_ENV=production.
RUN --mount=type=cache,id=oj-multimedia-npm,target=/root/.npm \
    npm ci --include=dev

# ---- Build Stage ----
FROM deps AS builder

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_SERVER_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_SERVER_BASE_URL=$NEXT_SERVER_BASE_URL \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

WORKDIR /app
COPY . .

RUN npm run build

# ---- Production Stage ----
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3009 \
    HOSTNAME=0.0.0.0

# standalone output is self-contained: no node_modules copy needed
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3009

CMD ["node", "server.js"]
