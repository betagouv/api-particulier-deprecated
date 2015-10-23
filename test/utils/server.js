var async = require('async');
var proxyquire = require('proxyquire');
var supertest = require('supertest');


var Server = require('../../server');


module.exports = function(){
  var server;
  var options = {
    appname: 'api-particulier-test',
    cafHost: 'https://pep-test.caf.fr',
    cafSslCertificate: __dirname + '/../resources/server.csr',
    cafSslKey: __dirname + '/../resources/server.key'
  };
  var serverPort = process.env['SERVER_PORT_TEST'];
  if(serverPort) {
    options.port = serverPort
  }

  beforeEach(function (done) {
    server = new Server(options);
    server.start(done);
  });

  afterEach(function (done) {
    server.stop(done);
  });


  var api = function () {
    return supertest
      .agent('http://localhost:' + server.getPort());
  };
  return {
    api : api
  }
};
