FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-only

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
# COPY --from=build-stage /app/src/app.config.json /usr/share/nginx/html/app.config.json

COPY ./eMondrianUtils/Docker/entrypoint.sh /usr/bin/entrypoint.sh

EXPOSE 80
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]