FROM node:19-alpine3.16
RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot
ENV NODE_ENV=production
RUN  npm install -global --ignore-scripts http-server
USER nonroot
RUN mkdir -p /home/nonroot/docker/artifact
COPY dist /home/nonroot/docker/artifact/
CMD [ "http-server", "/home/nonroot/docker/artifact/" ]
