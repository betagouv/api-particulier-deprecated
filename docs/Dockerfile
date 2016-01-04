FROM        node:4.2-wheezy

MAINTAINER  Thibaut Géry

RUN mkdir -p /var/www/docs

COPY ./ /var/www/docs

WORKDIR /var/www/docs

RUN npm install --production

VOLUME /var/www/docs

CMD ["sh"]
