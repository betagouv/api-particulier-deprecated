# Api Particulier

[![CircleCI](https://circleci.com/gh/betagouv/api-particulier.svg?style=svg)](https://circleci.com/gh/betagouv/api-particulier)
[![Coverage Status](https://coveralls.io/repos/github/betagouv/api-particulier/badge.svg?branch=tokenAsConf)](https://coveralls.io/github/betagouv/api-particulier?branch=tokenAsConf)

## Intégrer Api Particulier

Cette partie s'adresse aux développeurs souhaitant intégrer l'API.

Voici quelques liens utiles :

 * [API PARTICULIER](https://api.gouv.fr/api/api-particulier.html)
 * [La documentation](https://api.gouv.fr/api/api-particulier.html#doc_tech) qui permet de tester l'API en live

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
### Update repo submodules
```
git submodule init
git submodule update --recursive
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

- [api-particulier-ansible](https://gitlab.incubateur.net/beta.gouv.fr/api-particulier-ansible)
- [signup-ansible](https://gitlab.incubateur.net/beta.gouv.fr/signup-ansible)
- [api-particulier-web](https://github.com/betagouv/api-particulier-web)
- [api-particulier-auth](https://github.com/betagouv/api-particulier-auth)
- [api-particulier-lib](https://github.com/betagouv/api-particulier-lib)
- [signup-front](https://github.com/betagouv/signup-front)
- [api-auth](https://github.com/betagouv/api-auth)
- [signup-back](https://github.com/betagouv/signup-back)
- [svair-mock](https://github.com/betagouv/svair-mock)
- [kong-delegateAuth](https://github.com/betagouv/kong-delegateAuth)
- [api-caf](https://github.com/betagouv/api-caf)
- [api-avis-imposition](https://github.com/betagouv/api-avis-imposition)
- [api-stats-elk](https://github.com/betagouv/api-stats-elk)

## Misc

Créer un certificat auto-signé :
`cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
cafSslKey: './cert/bourse.sgmap.fr.key'` Voir par exemple : https://devcenter.heroku.com/articles/ssl-certificate-self
