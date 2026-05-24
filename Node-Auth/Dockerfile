FROM node:26.2.0-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json server.ts ./
COPY src ./src
RUN npm run build

FROM node:26.2.0-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]
