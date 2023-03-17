FROM node:alpine
RUN mkdir -p /usr/src
WORKDIR /usr/src
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml /usr/src/
RUN pnpm install
COPY . /usr/src
RUN pnpm run build
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production
CMD node dist/server/entry.mjs
