FROM node:20.4.0-alpine AS builder
WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com

COPY package.json ./
RUN yarn install --production=false \
    && yarn cache clean

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80