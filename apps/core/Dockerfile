FROM node:lts-alpine
RUN apk --no-cache add git

WORKDIR /wallet
COPY package.json .
COPY yarn.lock .

RUN yarn install

EXPOSE 3000