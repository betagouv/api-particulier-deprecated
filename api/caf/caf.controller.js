const { ping, injectClient } = require('api-caf/lib/components')
const StandardError = require('standard-error')
const defaultfakeResponses = require('./fake-responses')
const antsFakeResponses = require('./data/ants-fake-response')
const fakeResponses = defaultfakeResponses.concat(antsFakeResponses)
const { ClientError } = require('api-caf/lib/client')
const fs = require('fs')

function CafController (options) {
  options = options || {}

  this.prepare = function () {
    if (options.cafStub) {
      return function fakeClient (req, res, next) {
        req.client = {
          getAll (codePostal, numeroAllocataire) {
            const fakeResponse = fakeResponses.filter((fakeResponse) => {
              return fakeResponse.numeroAllocataire === numeroAllocataire &&
                fakeResponse.codePostal === codePostal
            })[0]
            if (fakeResponse) {
              return Promise.resolve(fakeResponse.response)
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
          {code: 400, scope: 'cnaf'}
        )
      )
    }

    return req.client.getAll(codePostal, numeroAllocataire).then((data) => {
      res.data = data
      next()
    }).catch((err) => {
      if (err instanceof ClientError) {
        logErrorIfLogger(req, err)
        return next(new StandardError(err.message, { code: err.code, scope: 'caf' }))
      } else {
        err.scope = 'caf'
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

  this.authorize = function (req, res, next) {
    if (req.authType === 'FranceConnect') {
      if (consumerMatch(req, res)) {
        return next()
      } else {
        return next(
          new StandardError(
            'You are forbidden to access this resource',
            {code: 403, scope: 'caf'}
          )
        )
      }
    } else {
      return next()
    }
  }

  function consumerMatch (req, res) {
    const cafNames = upcaseCafNames(res)
    const consumerName = req.consumer.name.toUpperCase()
    return cafNames.indexOf(consumerName) !== -1
  }

  function upcaseCafNames (res) {
    let names = []
    names = names.concat(
      res.data.allocataires.map((allocataire) => allocataire.nomPrenom)
    )
    names = names.concat(
      res.data.enfants.map((allocataire) => allocataire.nomPrenom)
    )
    return names.map((name) => name.toUpperCase())
  }
}

module.exports = CafController
