#started from https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
# and changed:
# - starting from node:20-alpine - earlier nodes can't do modules

FROM node:20-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN node --version

RUN npm install

COPY --chown=node:node . .

EXPOSE 3456

CMD [ "node",  "server.js" ]
