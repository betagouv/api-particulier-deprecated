var path = require('path');

module.exports = {
  port: 3004,
  appname: 'api-particulier',
  cafHost: 'https://pep-test.caf.fr',
  svairHost: 'https://cfsmsp.impots.gouv.fr',
  cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
  cafSslKey: './cert/bourse.sgmap.fr.key',
  log: {
    level: 'debug',
    format: 'simple'
  },
  referenceAvis: '',
  numeroFiscal: '',
  raven: {
    activate: false,
    dsn:''
  },
  redis: {
    port: 6379,
    host:'127.0.0.1',
    tokensPrefix: 'token_authorized'
  },
  ban: {
    baseUrl: 'https://api-adresse.data.gouv.fr'
  }
};
