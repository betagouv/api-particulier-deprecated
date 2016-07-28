FROM node:4

MAINTAINER  Thibaut Géry

RUN mkdir -p /var/www/docs

COPY ./ /var/www/docs

WORKDIR /var/www/docs

RUN npm install --production

COPY ./api-particulier.yaml /var/www/docs/api-particulier.yaml

VOLUME /var/www/docs

CMD ["sh"]
