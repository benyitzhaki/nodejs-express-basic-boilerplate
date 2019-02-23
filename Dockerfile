FROM node:8-slim

WORKDIR /app

COPY . ./

RUN ls
RUN npm run --prefix server

EXPOSE 5000

CMD node /app/server/index.js