FROM node:lts-alpine

WORKDIR /wallet
COPY package.json .
COPY yarn.lock .

RUN yarn install

EXPOSE 3000