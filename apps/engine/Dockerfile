FROM node:lts-alpine
RUN apk --no-cache add git

WORKDIR /engine
COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 3000