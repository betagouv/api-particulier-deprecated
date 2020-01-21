const path = require('path')
var supertest = require('supertest')
var nock = require('nock')

var Server = require('../../server')

module.exports = function () {
  var server
  var options = {
    appname: 'api-particulier-test',
    cafStub: true,
    cafHost: 'https://pep-test.caf.fr',
    svairHost: 'https://cfsmsp.impots.gouv.fr',
    supdataHost: 'http://sup.data/api/rest.php',
    supdataApiKey: 'georges-moustaki',
    cafSslCertificate: path.join(__dirname, '../resources/server.crt'),
    cafSslKey: path.join(__dirname, '../resources/server.key'),
    cafPingParams: { codePostal: '99148', numeroAllocataire: '0000354' },
    tokensPath: path.join(__dirname, 'tokens'),
    raven: {
      activate: false,
      dsn: ''
    },
    numeroAllocataire: '1234567',
    codePostal: '75009'
  }
  var serverPort = process.env['SERVER_PORT_TEST']
  if (serverPort) {
    options.port = serverPort
  }

  nock.enableNetConnect('localhost')

  before(done => {
    server = new Server(options)
    server.start(done)
  })
  after(done => {
    server.stop(done)
  })

  var api = function () {
    return supertest.agent('http://localhost:' + server.getPort())
  }
  return {
    api: api
  }
}
