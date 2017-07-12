const { ping, injectClient } = require('api-caf/lib/components')
const StandardError = require('standard-error')
const fakeResponse = require('./fake-response')
const { ClientError } = require('api-caf/lib/client')
const format = require('./../lib/utils/format')
const fs = require('fs')

function CafController (options) {
  options = options || {}

  this.prepare = function () {
    if (options.cafStub) {
      return function fakeClient (req, res, next) {
        req.client = {
          getAll (codePostal, numeroAllocataire) {
            if (codePostal === '99148' && numeroAllocataire === '0000354') {
              return Promise.resolve(fakeResponse)
            } else {
              return Promise.reject(new ClientError(133))
            }
          }
        }
        return next()
      }
    } else {
      return injectClient({
        host: options.cafHost,
        cert: fs.readFileSync(options.cafSslCertificate),
        key: fs.readFileSync(options.cafSslKey)
      })
    }
  }

  this.ping = ping(options.cafPingParams)

  // clone from api-caf/lib/components#fetch
  this.famille = function (req, res, next) {
    const { codePostal, numeroAllocataire } = req.query
    if (!codePostal || !numeroAllocataire) {
      return next(
        new StandardError(
          'Les paramètres `codePostal` et `numeroAllocataire` sont obligatoires',
          {code: 400}
        )
      )
    }

    return req.client.getAll(codePostal, numeroAllocataire).then((data) => {
      return format(res, data)
    }).catch((err) => {
      if (err instanceof ClientError) {
        logErrorIfLogger(req, err)
        return next(new StandardError(err.message, { code: err.code }))
      } else {
        return next(err)
      }
    })

    function logErrorIfLogger (req, error) {
      const logger = req.log || req.loggger
      if (logger) {
        logger.error({ error }, error.message)
      }
    }
  }
}

module.exports = CafController
