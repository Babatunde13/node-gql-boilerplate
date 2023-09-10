FROM node:18-alpine as build-stage

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./

ENV NODE_ENV=development

RUN npm install

COPY . .

RUN npm run build --if-present

CMD [ "npm", "start" ]

FROM node:16.14.0-alpine as production-stage

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install --only=production

COPY --from=build-stage /app/dist ./dist

CMD [ "npm", "start" ]
