var proxyquire = require('proxyquire')
var supertest = require('supertest')
var nock = require('nock')

var Server = require('../../server')

module.exports = function () {
  var server
  var options = {
    appname: 'api-particulier-test',
    cafHost: 'https://pep-test.caf.fr',
    svairHost: 'https://cfsmsp.impots.gouv.fr',
    cafSslCertificate: __dirname + '/../resources/server.crt',
    cafSslKey: __dirname + '/../resources/server.key',
    cafPingParams: { codePostal: '00000', numeroAllocataire: '0000000' },
    tokensPath: __dirname + '/tokens',
    raven: {
      activate: false,
      dsn: ''
    },
    es: {
      host: 'http://es.infra.gouv.fr:9203',
      index: 'logstash-apiparticulier-*'
    },
    numeroAllocataire: '1234567',
    codePostal: '75009',
    ban: {
      baseUrl: 'http://adresse.data.gouv.local'
    }
  }
  var serverPort = process.env['SERVER_PORT_TEST']
  if (serverPort) {
    options.port = serverPort
  }

  nock.enableNetConnect('localhost')

  beforeEach((done) => {
    server = new Server(options)
    server.start(done)
  })
  afterEach((done) => {
    server.stop(done)
  })

  var api = function () {
    return supertest
      .agent('http://localhost:' + server.getPort())
  }
  return {
    api: api
  }
}
