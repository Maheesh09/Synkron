# Frontend (TanStack Start SSR) on Cloud Run
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Reads VITE_API_URL from .env.production in the repo root
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Copy built output
COPY --from=build /app/dist ./dist
COPY --from=build /app/server-node.mjs ./server-node.mjs
# Install production dependencies — the SSR bundle imports h3-v2,
# @tanstack/router-core etc. as external packages, so they must exist here
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev --no-audit --no-fund
EXPOSE 8080
CMD ["node", "server-node.mjs"]