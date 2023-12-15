#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# # Replace env vars in JavaScript files
# echo "Replacing env constants in JS"
# ls $ROOT_DIR
# for file in $ROOT_DIR/assets/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js $ROOT_DIR/auth.config.json;
# do
#   echo "Processing $file ...";

#   sed -i 's|VITE_BE_BASE_PATH|'${VITE_BE_BASE_PATH}'|g' $file 
#   sed -i 's|VITE_KEYCLOAK_AUTH_ENABLED|'${VITE_KEYCLOAK_AUTH_ENABLED}'|g' $file 
#   sed -i 's|VITE_KEYCLOAK_AUTH_BASE_PATH|'${VITE_KEYCLOAK_AUTH_BASE_PATH}'|g' $file 
#   sed -i 's|VITE_KEYCLOAK_AUTH_REALM|'${VITE_KEYCLOAK_AUTH_REALM}'|g' $file 
#   sed -i 's|VITE_KEYCLOAK_AUTH_CLIENT_ID|'${VITE_KEYCLOAK_AUTH_CLIENT_ID}'|g' $file 

# done

echo "Starting Nginx"
nginx -g 'daemon off;'