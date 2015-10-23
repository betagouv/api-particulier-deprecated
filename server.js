var http = require('http');
var express = require('express');
var StandardError = require('standard-error');
var S = require('string');
var emptylogger = require('bunyan-blackhole');
var expressBunyanLogger = require("express-bunyan-logger");
var routes = require('./routes');
var authorizedTokens = require('./authorized-tokens')
var bodyParser = require('body-parser');
var cors = require('cors');
var _ = require('lodash');
var UrlAssembler = require('url-assembler')


var extend = require('extend');

module.exports = Server;

function Server (options) {
  var self = this;
  options = options || {};
  options.port = options.port || 0;
  var logger = options.logger || emptylogger();
  var app = express();
  app.set('port', options.port);
  app.set('json spaces', 2);
  app.set('logger', logger);
  app.set('cafHost',  options.cafHost);
  app.set('cafSslCertificate',  options.cafSslCertificate);
  app.set('cafSslKey',  options.cafSslKey);
  app.disable('x-powered-by');

  app.use(bodyParser.json());
  var corsOptions = {
    exposedHeaders: ['Range', 'Content-Range', 'X-Content-Range'],
    credentials: true,
    origin: function (origin, callback) {
      logger.info('using cors origin', origin);
      callback(null, true);
    }
  };
  app.use(cors(corsOptions));

  app.use(expressBunyanLogger({
    name: "requests",
    logger: logger
  }));

  app.use(function isAuthorized(req, res, next) {
    var token = req.get('X-API-Key') || ""
    if(_.includes(authorizedTokens, token)) {
      logger.debug({
        event: 'authorization'
      }, 'authorized');
      next()
    } else {
      logger.debug({
        event: 'authorization'
      }, 'not authorized');
      next(new StandardError('You are not authorized to use the api', {code: 401}));
    }
  })

  routes.configure(app, options);

  if (options.staticPath) app.use(express.static(options.staticPath));

  app.use(function notFound(req, res, next) {
    next(new StandardError('no route for URL ' + req.url, {code: 404}));
  });

  app.use(function (err, req, res, next) {
    req.log.error({error: err}, err.message);
    if (err.code) {
      if (err instanceof StandardError) {
        return res.status(err.code).json({
          error: S(http.STATUS_CODES[err.code]).underscore().s,
          reason: err.message
        })
      }
    }
    next(err);
  });


  this.getPort = function() {
    return this.port;
  };

  var server = http.createServer(app);
  this.start = function (onStarted) {
    server.listen(app.get('port'), function (error) {
      if (error) {
        logger.error({error: error}, 'Got error while starting server');
        return onStarted(error);
      }
      self.port = server.address().port;
      app.set('port', self.port);
      logger.info({
        event: 'server_started',
        port: self.port
      }, 'Server listening on port', self.port);
      onStarted();
    });
  };

  this.stop = function (onStopped) {
    logger.info({
      event: 'server_stopping'
    }, 'Stopping server');
    server.close(function (error) {
      if (error) {
        logger.error({error: error}, 'Got error while stopping server');
        return onStopped(error);
      }
      logger.info({
        event: 'server_stopped'
      }, 'server stopped');
      onStopped();
    });
  }
}
