# Docker local build stage
FROM node:16.20.2 as local
WORKDIR /usr/src/app
COPY package*.json .
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]

# Docker production build stage
FROM node:16-alpine as production
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev
COPY --from=local /usr/src/app/build .
CMD ["node", "app.js"]