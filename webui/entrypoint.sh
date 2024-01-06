#!/bin/bash

sed -i "s|basePath : \".*\"|basePath : \"${BASE_PATH}\"|" /usr/share/nginx/html/config.js
sed -i "s|apiUrl: \".*\"|apiUrl: \"${API_URL}\"|" /usr/share/nginx/html/config.js


exec nginx -g 'daemon off;'