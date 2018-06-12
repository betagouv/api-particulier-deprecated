# Api Particulier

[![CircleCI](https://circleci.com/gh/sgmap/api-particulier.svg?style=svg)](https://circleci.com/gh/sgmap/api-particulier)
[![Coverage Status](https://coveralls.io/repos/github/sgmap/api-particulier/badge.svg?branch=tokenAsConf)](https://coveralls.io/github/sgmap/api-particulier?branch=tokenAsConf)

## Intégrer Api Particulier

Cette partie s'adresse aux développeurs souhaitant intégrer l'API.

Voici quelques liens utiles :

 * [API PARTICULIER](https://api.gouv.fr/api/api-particulier.html)
 * [La documentation](https://betagouv.github.io/api-particulier-slate/) qui est permet de tester l'API en live : il
 vous faudra un Token ainsi que des identifiants valides (les votres ?)

## Development dependencies

- Node 8.11.2

## Install

### Dependencies setup

Install node v8.11.2 with nvm:

```bash
nvm install v8.11.2
nvm alias default v8.11.2
nvm use v8.11.2
```

> Note that version v6.14.2 is still used in production.

### Npm dependencies setup

```bash
npm install
```

### Tests

```bash
npm run test
```

### Run the server locally

```bash
npm run start
```

## Related projects

- [api-particulier-ansible](https://gitlab.incubateur.net/pkn/api-particulier-ansible)
- [api-particulier-monitoring-ansible](https://gitlab.incubateur.net/pkn/api-particulier-monitoring-ansible)
- [api-particulier-courtier-ansible](https://gitlab.incubateur.net/pkn/api-particulier-courtier-ansible)
- [api-particulier-admin](https://github.com/betagouv/api-particulier-admin)
- [api-particulier-slate](https://github.com/betagouv/api-particulier-slate)
- [api-particulier-web](https://github.com/betagouv/api-particulier-web)
- [api-particulier-auth](https://github.com/betagouv/api-particulier-auth)
- [signup.api.gouv.fr](https://github.com/betagouv/signup.api.gouv.fr)
- [signup.api.gouv.fr-oauth](https://github.com/betagouv/signup.api.gouv.fr-oauth)
- [signup.api.gouv.fr-back](https://github.com/betagouv/signup.api.gouv.fr-back)
- [signup.api.gouv.fr-docker](https://github.com/betagouv/signup.api.gouv.fr-docker)
- [svair-mock](https://github.com/betagouv/svair-mock)
- [kong-delegateAuth](https://github.com/pknoth/kong-delegateAuth)
- [api-caf](https://github.com/betagouv/api-caf)
- [api-avis-imposition](https://github.com/betagouv/api-avis-imposition)
- [api-stats-elk](https://github.com/betagouv/api-stats-elk)

## Misc

Créer un certificat auto-signé :
`cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
cafSslKey: './cert/bourse.sgmap.fr.key'` Voir par exemple : https://devcenter.heroku.com/articles/ssl-certificate-self
