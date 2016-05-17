FROM        nginx

MAINTAINER  Thibaut Géry

ADD sgmap.vhost /etc/nginx/sites-available/sgmap.conf

ADD sgmap-mock.vhost /etc/nginx/sites-available/sgmap-mock.conf

ADD api.gouv.vhost /etc/nginx/sites-available/api.gouv.conf

ADD api.gouv-mock.vhost /etc/nginx/sites-available/api.gouv-mock.conf


ADD nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

RUN ln -s /etc/nginx/sites-available/sgmap.conf /etc/nginx/conf.d/sgmap.conf

RUN ln -s /etc/nginx/sites-available/sgmap-mock.conf /etc/nginx/conf.d/sgmap-mock.conf

RUN ln -s /etc/nginx/sites-available/api.gouv.conf /etc/nginx/conf.d/api.gouv.conf

RUN ln -s /etc/nginx/sites-available/api.gouv-mock.conf /etc/nginx/conf.d/api.gouv-mock.conf
