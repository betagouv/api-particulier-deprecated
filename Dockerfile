FROM node:4.2.1

RUN mkdir -p /srv/apps



RUN npm install -g pm2
RUN pm2 dump
# dump will start pm2 daemon and create everything needed

EXPOSE 3004

ADD ./ /srv/apps


WORKDIR /srv/apps

CMD ["pm2", "start", "/srv/apps/apps.json", "--no-daemon"]
