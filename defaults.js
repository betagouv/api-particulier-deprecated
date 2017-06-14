var path = require('path');

module.exports = {
  PORT: 3004,
  nbWorkers: 1,
  outgoingHttpMaxSockets: 5,
  appname: 'api-particulier',
  cafHost: 'https://pep-test.caf.fr',
  svairHost: 'https://cfsmsp.impots.gouv.fr',
  cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
  cafSslKey: './cert/bourse.sgmap.fr.key',
  log: {
    level: 'info',
    format: 'simple'
  },
  es: {
    host: null,
    indexPattern: '[logstash-apiparticulier-]YYYY.MM.DD',
    index: 'logstash-apiparticulier-*'
  },
  referenceAvis: '',
  numeroFiscal: '',
  numeroAllocataire: '0000354',
  codePostal: '99148',
  raven: {
    activate: false,
    dsn:''
  },
  tokensPath: './tokens',
  ban: {
    baseUrl: 'https://api-adresse.data.gouv.fr'
  }
};
