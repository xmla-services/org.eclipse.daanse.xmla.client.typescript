FROM node:19-alpine3.16
ENV NODE_ENV=production
RUN mkdir -p /docker/artifact
COPY ../dist /docker/artifact/
RUN  npm install --global http-server
CMD [ "http-server", "/docker/artifact/" ]
