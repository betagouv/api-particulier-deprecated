FROM node:4

RUN mkdir -p /srv/apps

EXPOSE 3004
ENV tokensPath /srv/apps/tokens

ADD package.json /srv/apps
WORKDIR /srv/apps
RUN npm install --production

ADD ./ /srv/apps

RUN npm install --production

VOLUME /srv/apps/tokens.json

CMD npm start
