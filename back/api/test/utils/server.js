var async = require('async');
var proxyquire = require('proxyquire');
var supertest = require('supertest');
var Redis = require('ioredis');
var nock = require('nock')


var Server = require('../../server');


module.exports = function(){
  var server;
  var redis
  var options = {
    appname: 'api-particulier-test',
    cafHost: 'https://pep-test.caf.fr',
    svairHost: 'https://cfsmsp.impots.gouv.fr',
    cafSslCertificate: __dirname + '/../resources/server.csr',
    cafSslKey: __dirname + '/../resources/server.key',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      tokensPrefix: 'testTokenAuthorized',
      userPrefix: 'testUser'
    },
    raven: {
      activate: false,
      dsn:''
    },
    es: {
      host: 'http://es.infra.gouv.fr:9203',
      index: 'logstash-apiparticulier-*'
    },
    numeroAllocataire: '1234567',
    codePostal: '75009',
    ban: {
      baseUrl: "http://adresse.data.gouv.local"
    }
  };
  var serverPort = process.env['SERVER_PORT_TEST'];
  var redisHost = process.env['REDIS_PORT_HOST'];
  if(serverPort) {
    options.port = serverPort
  }
  if(redisHost) {
    options.redis.host = redisHost
  }

  nock.enableNetConnect('localhost');


  beforeEach(function (done) {
    server = new Server(options);
    redis = new Redis(options.redis.port, options.redis.host);
    const tokenUser = {
      name: 'test',
      token: '',
      role: 'user'
    }
    const tokenAdmin = {
      name: 'admin',
      token: 'adminToken',
      role: 'admin'
    }
    const user = {
      email: 'tge@octo.com',
      name: 'gery',
      surname: 'Thibaut',
      role: 'user',
      localAuthority: 'Paris',
      keys: ['A', 'B']
    }
    const admin = {
      email: 'tgery@octo.com',
      name: 'gery',
      surname: 'Thibaut',
      role: 'admin',
      localAuthority: 'Paris',
      keys: ['A', 'B']
    }
    async.series([
      server.start,
      (callback) => {
        redis.set(options.redis.tokensPrefix + '::' + tokenUser.token, JSON.stringify(tokenUser), callback)
      },
      (callback) => {
        redis.set(options.redis.tokensPrefix + '::' + tokenAdmin.token, JSON.stringify(tokenAdmin), callback)
      },
      (callback) => {
        redis.set(options.redis.userPrefix + '::' + user.email, JSON.stringify(user), callback)
      },
      (callback) => {
        redis.set(options.redis.userPrefix + '::' + admin.email, JSON.stringify(admin), callback)
      }], done)
  });

  afterEach(function (done) {
    server.stop(function(err) {
      if(err) return done(err);
      redis.keys(options.redis.tokensPrefix +'::*', (err, keys) => {
        if(err) return done(err)
        async.map(keys, (item, callback) => {
          redis.del(item, callback )
        }, (err) => {
          done(err)
        })

      })
    });
  });


  var api = function () {
    return supertest
      .agent('http://localhost:' + server.getPort());
  };
  return {
    api : api
  }
};
