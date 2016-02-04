FROM ruby:2.2.2

RUN mkdir -p /usr/src/app /var/www/tech
WORKDIR /usr/src/app

RUN gem install rb-inotify && gem install therubyracer

ADD Gemfile /usr/src/app/
ADD Gemfile.lock /usr/src/app/
RUN bundle install

ADD . /usr/src/app

RUN bundle exec middleman build && cp -r build/* /var/www/tech/

VOLUME /var/www/tech
VOLUME /usr/src/app

CMD ["sh"]
