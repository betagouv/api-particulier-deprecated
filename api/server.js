'use strict'

const http = require('http')
const express = require('express')
const StandardError = require('standard-error')
const emptylogger = require('bunyan-blackhole')
const expressBunyanLogger = require('express-bunyan-logger')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')
const raven = require('raven')
const formatFromUrl = require('./lib/middlewares/formatFromUrl')
const getApiKeyFromQueryParam = require('./lib/middlewares/getApiKeyFromQueryParam')
const identifyUser = require('./lib/middlewares/identifyUser')
const loggerProperties = require('./lib/middlewares/logger')
const formatError = require('./lib/middlewares/formatError')
const errorScopeAuthorization = require('./lib/middlewares/errorScopeAuthorization')

module.exports = Server

function Server (options) {
  var self = this
  options = options || {}
  options.port = options.port || 0
  options.logger = options.logger || emptylogger()

  var logger = options.logger
  var app = express()
  app.set('port', options.port)
  app.set('json spaces', 2)
  app.set('logger', logger)
  app.set('cafHost', options.cafHost)
  app.set('cafSslCertificate', options.cafSslCertificate)
  app.set('cafSslKey', options.cafSslKey)
  app.disable('x-powered-by')
  app.use(express.static('public'))
  app.use(bodyParser.json())
  var corsOptions = {
    exposedHeaders: ['Range', 'Content-Range', 'X-Content-Range'],
    credentials: true,
    origin: function (origin, callback) {
      logger.info('using cors origin', origin)
      callback(null, true)
    }
  }
  app.use(cors(corsOptions))

  app.use(expressBunyanLogger({
    name: 'requests',
    logger: logger,
    excludes: loggerProperties.excludes,
    includesFn: loggerProperties.includesFn,
    format: '":remote-address :incoming :method HTTP/:http-version :status-code :res-headers[content-length] :referer :user-agent[family] :user-agent[major].:user-agent[minor] :user-agent[os] :response-time ms";'
  }))

  app.use((req, res, next) => {
    req.logger = logger
    next()
  })

  if (options.raven.activate) {
    app.use(raven.middleware.express(options.raven.dsn))
  }

  app.use(getApiKeyFromQueryParam)
  app.use(identifyUser)

  app.use(formatFromUrl)

  routes.configure(app, options)

  if (options.staticPath) app.use(express.static(options.staticPath))

  app.use(function notFound (req, res, next) {
    next(new StandardError('no route for URL ' + req.url, {code: 404}))
  })

  app.use(errorScopeAuthorization)
  app.use(formatError)

  this.getPort = function () {
    return this.port
  }

  var server = http.createServer(app)
  this.start = function (onStarted) {
    server.listen(app.get('port'), function (error) {
      if (error) {
        logger.error({error: error}, 'Got error while starting server')
        return onStarted(error)
      }
      self.port = server.address().port
      app.set('port', self.port)
      logger.info({
        event: 'server_started',
        port: self.port
      }, 'Server listening on port', self.port)
      onStarted()
    })
  }

  this.stop = function (onStopped) {
    logger.info({
      event: 'server_stopping'
    }, 'Stopping server')
    server.close(function (error) {
      if (error) {
        logger.error({error: error}, 'Got error while stopping server')
        return onStopped(error)
      }
      logger.info({
        event: 'server_stopped'
      }, 'server stopped')
      onStopped()
    })
  }
}
