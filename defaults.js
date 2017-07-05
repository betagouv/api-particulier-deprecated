var path = require('path')

module.exports = {
  PORT: 3004,
  nbWorkers: 1,
  cafStub: true,
  outgoingHttpMaxSockets: 5,
  appname: 'api-particulier',
  mongoDbUrl: 'mongodb://localhost:27017/api-particulier',
  tokenService: 'db',
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
    indexPattern: '[logstash-api-particulier-]YYYY.MM.DD',
    index: 'logstash-api-particulier-*'
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
