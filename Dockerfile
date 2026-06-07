# Frontend (TanStack Start SSR) on Cloud Run — scale-to-zero, free tier
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Reads VITE_API_URL from the .env.production file in the repo root
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server-node.mjs ./server-node.mjs
EXPOSE 8080
CMD ["node", "server-node.mjs"]
