const { ping, injectClient, fetch } = require('api-caf/lib/components')
const fakeResponse = require('./fake-response')
const fs = require('fs')


function CafController (options) {
  options = options || {}

  this.prepare = function () {
    // is options.cafStub will be used at anytime ?
    if (options.cafStub) {
      return function fakeClient(req, res, next) {
        req.client = {
          getAll(codePostal, numeroAllocataire) {
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

  this.famille = fetch()
}

module.exports = CafController
