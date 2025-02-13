FROM node:20.4.0-alpine
WORKDIR /app

RUN yarn config set registry https://registry.npmmirror.com

COPY package.json yarn.lock ./
RUN yarn install --production=true \
    && yarn cache clean

COPY . .
EXPOSE 5173

CMD ["yarn", "dev"]