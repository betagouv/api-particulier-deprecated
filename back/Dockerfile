FROM node:5.7

RUN mkdir -p /srv/apps

EXPOSE 3004
ADD package.json /srv/apps
WORKDIR /srv/apps
RUN npm install --production

ADD ./ /srv/apps

RUN npm install --production

CMD npm start
