FROM node:20-slim AS base

WORKDIR /app
COPY package*.json ./

# Install all dependencies (dev + prod) once
RUN npm ci

# ---- Build Stage ----
FROM base AS builder

WORKDIR /app
COPY . .

# Build Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3009

# Copy only required output and runtime deps
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3009

CMD ["npm", "run", "start"]
