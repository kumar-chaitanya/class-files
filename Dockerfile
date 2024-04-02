FROM node:16.20.2

WORKDIR /usr/src/app

COPY package*.json .

COPY build/ ./build

RUN npm ci

CMD ["npm", "start"]
