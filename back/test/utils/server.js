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
    cafSslCertificate: __dirname + '/../resources/server.csr',
    cafSslKey: __dirname + '/../resources/server.key',
    redis: {
      host: '127.0.0.1',
      port: 6379,
      tokensPrefix: 'testTokenAuthorized'
    },
    raven: {
      activate: false,
      dsn:''
    },
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
    server.start(function(err) {
      if(err) return done(err);
      var user = {
        name: 'test',
        token: '',
        role: 'user'
      }
      var admin = {
        name: 'admin',
        token: 'adminToken',
        role: 'admin'
      }
      redis.set(options.redis.tokensPrefix + '::' + user.token, JSON.stringify(user), function(err) {
        if(err) return done(err);
        redis.set(options.redis.tokensPrefix  + '::' + admin.token, JSON.stringify(admin), done)
      })
    });
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
