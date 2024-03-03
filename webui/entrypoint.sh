#!/bin/bash

BUILD_FOLDER="/usr/share/nginx/html"

# replace config.ts 
find $BUILD_FOLDER -type f -name "*.js" -exec sed -i 's|__BASEPATH__|'"${BASE_PATH}"'|g' {} \;
find $BUILD_FOLDER -type f -name "*.js" -exec sed -i 's|__APIURL__|'"${API_URL}"'|g' {} \;

exec nginx -g 'daemon off;'