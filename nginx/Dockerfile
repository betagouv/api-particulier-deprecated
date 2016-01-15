FROM        nginx

MAINTAINER  Thibaut Géry

ADD apiparticulier.vhost /etc/nginx/sites-available/apiparticulier.conf

ADD apiparticulier-mock.vhost /etc/nginx/sites-available/apiparticulier-mock.conf


ADD nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

RUN ln -s /etc/nginx/sites-available/apiparticulier.conf /etc/nginx/conf.d/apiparticulier.conf

RUN ln -s /etc/nginx/sites-available/apiparticulier-mock.conf /etc/nginx/conf.d/apiparticulier-mock.conf
