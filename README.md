# Api-particulier
[![CircleCI](https://circleci.com/gh/sgmap/api-particulier.svg?style=svg)](https://circleci.com/gh/sgmap/api-particulier)
[![Coverage Status](https://coveralls.io/repos/github/sgmap/api-particulier/badge.svg?branch=tokenAsConf)](https://coveralls.io/github/sgmap/api-particulier?branch=tokenAsConf)

## Intégrateur

Cette partie s'adresse aux développeurs souhaitant intégrer l'API.

Voici quelques liens utiles :

 * [API PARTICULIER](https://apiparticulier.sgmap.fr)
 * [La documentation](https://apiparticulier.sgmap.fr/docs) qui est permet de
 tester l'API en live : il vous faudra un Token ainsi que des identifiants
 valides (les votres ?)
 * [L'environnement de test](https://apiparticulier-mock.sgmap.fr/api/ping) et
 sa [documentation exécutable](https://apiparticulier-mock.sgmap.fr/docs) dans
 laquelle il est possible d'utiliser tous les ids et token possibles.


## Pré-requis

* [node.js](http://nodejs.org)
* [mongodb](http://www.mongodb.com)
* [openssl](http://www.openssl.org)

Créer un certificat auto-signé :
`cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
cafSslKey: './cert/bourse.sgmap.fr.key'` Voir par exemple : https://devcenter.heroku.com/articles/ssl-certificate-self


## Installation des modules

    `npm install`

## Tests

    lancer mongodb
    `npm run test`

## Lancer le serveur

    `npm run start`
