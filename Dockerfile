FROM node:alpine as BUILD
WORKDIR /build
COPY package.json pnpm-lock.yaml ./
RUN npm install -fg corepack@latest && corepack enable && pnpm install
COPY ./ ./
RUN pnpm build

FROM node:alpine
WORKDIR /app
EXPOSE 3000
COPY --from=BUILD /build/.output /app
CMD ["node", "./server/index.mjs"]
