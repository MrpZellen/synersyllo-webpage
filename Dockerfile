ARG NODE_VERSION=18.19.1

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

WORKDIR /src

FROM base as build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

RUN npm run build

FROM base

ENV PORT=$PORT
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb+srv://zellendev:johnuserpass22!@synersyllo.8jeq7ma.mongodb.net/?retryWrites=true&w=majority&appName=SynerSyllo

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]
