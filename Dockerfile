FROM node:18.14.0-alpine

WORKDIR /home/node/app

# COPY package*.json ./

# RUN npm install

RUN npm install -g @nestjs/cli

# RUN apk add --no-cache bash

USER node