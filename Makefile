
build:
	(docker-compose build)

run:
	(docker-compose up -d)

clean:
	(docker-compose stop && docker-compose rm -f)

install: install-front install-back

install-front:
	(cd front && npm install)

install-back:
	(cd back && npm install)

test: install test-front test-back

test-front:
	 docker-compose -f docker-compose-test.yml run front

test-back:
	 docker-compose -f docker-compose-test.yml run app
