FROM        nginx

MAINTAINER  Thibaut Géry

ADD default-vhost /etc/nginx/sites-available/rentree-simplifiee.conf

RUN rm /etc/nginx/conf.d/default.conf

RUN ln -s /etc/nginx/sites-available/rentree-simplifiee.conf /etc/nginx/conf.d/rentree-simplifiee.conf