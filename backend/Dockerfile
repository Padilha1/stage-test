FROM node:22-alpine3.22 AS deps

WORKDIR /app

RUN apk upgrade --no-cache

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

FROM deps AS build

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine3.22 AS runner

WORKDIR /app

RUN apk upgrade --no-cache \
	&& addgroup -S app \
	&& adduser -S app -G app

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

USER app

EXPOSE 3000

CMD ["node", "dist/server.js"]
