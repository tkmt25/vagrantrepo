# build stage
FROM node:20 AS build

WORKDIR /app
COPY ./ ./
RUN npm install -g typescript \
    && npm install \ 
    && npm run build

# exec stage
FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/webui.conf
COPY --from=build /app/build /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


ENTRYPOINT ["/entrypoint.sh"]
