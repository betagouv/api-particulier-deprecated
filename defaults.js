module.exports = {
  PORT: 3004,
  nbWorkers: 1,
  cafStub: false,
  outgoingHttpMaxSockets: 5,
  appname: 'api-particulier',
  franceConnectHost: 'fcp.integ01.dev-franceconnect.fr',
  cafHost: 'https://pep-test.caf.fr',
  svairHost: 'https://cfsmsp.impots.gouv.fr',
  cafSslCertificate: './cert/bourse.sgmap.fr.bundle.crt',
  cafSslKey: './cert/bourse.sgmap.fr.key',
  log: {
    level: 'info',
    format: 'simple'
  },
  referenceAvis: '',
  numeroFiscal: '',
  numeroAllocataire: '0000354',
  codePostal: '99148',
  raven: {
    activate: false,
    dsn: ''
  },
  tokensPath: './tokens',
  logginPath: '/var/log/api-particulier/api-particulier.log'
}
