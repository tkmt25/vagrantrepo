# build stage
FROM node:20 AS build

WORKDIR /app
COPY src ./src
COPY *.json ./
RUN npm install -g typescript \
    && npm install \ 
    && npm run build

# exec stage
FROM node:20-slim

WORKDIR /app
COPY --from=build /app/*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist

CMD ["node", "dist/server.js"]