FROM        node:4.2-wheezy

MAINTAINER  Thibaut Géry

RUN mkdir -p /var/www/app && mkdir -p /root/front

ADD package.json /root/front

WORKDIR /root/front

RUN npm install --production

COPY ./ /root/front

RUN npm install --production && npm run build

RUN cp -r /root/front/dist/* /var/www/app/

VOLUME /var/www/app

CMD ["sh"]
