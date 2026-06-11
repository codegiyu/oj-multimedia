FROM node:22-slim AS deps

WORKDIR /app
COPY package*.json ./

# Install all dependencies (dev + prod) once
RUN npm ci

# ---- Build Stage ----
FROM deps AS builder

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_SERVER_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_SERVER_BASE_URL=$NEXT_SERVER_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

WORKDIR /app
COPY . .

# Build Next.js app
RUN npm run build

# ---- Production Dependencies Stage ----
FROM node:22-slim AS prod-deps

WORKDIR /app
COPY package*.json ./

# Install only production dependencies for runtime image
RUN npm ci --omit=dev

# ---- Production Stage ----
FROM node:22-slim AS runner

# Apply Debian security updates (reduces OS-layer CVEs reported by image scanners)
RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3009

# Copy only required output and runtime deps
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
# next.config.ts imports ./lib/config/imageRemotePatterns at runtime (next start)
COPY --from=builder /app/lib/config ./lib/config
COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3009

CMD ["npm", "run", "start"]
