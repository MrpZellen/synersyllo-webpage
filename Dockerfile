

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable


COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm i


COPY . ./


RUN pnpm run build



FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output/ ./

ENV PORT=6060
ENV HOST=0.0.0.0

EXPOSE 6060

CMD ["node", "/app/server/index.mjs"]
