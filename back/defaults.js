var path = require('path');

module.exports = {
  port: 3004,
  appname: 'api-particulier',
  cafHost: 'https://pep-test.caf.fr',
  cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
  cafSslKey: './cert/bourse.sgmap.fr.key',
  log: {
    level: 'debug',
    format: 'simple'
  },
  redis: {
    port: 6379,
    host:'127.0.0.1',
    tokensAuthorizedName: 'token_authorized'
  },
  ban: {
    baseUrl: 'http://api-adresse.data.gouv.fr'
  }
};
