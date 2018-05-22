const StandardError = require('standard-error')
const DbTokenService = require('./db-tokens.service')
const FileTokenService = require('./file-tokens.service')
const ExportedTokenService = require('./exported-token.service')
const FranceConnectService = require('./france-connect.service')

module.exports = Auth

function Auth (options) {
  let fileTokenService, dbTokenService, exportedTokenService, initializedService

  const franceConnectService = new FranceConnectService(options)

  if (options.tokenService === 'db') {
    dbTokenService = new DbTokenService(options)
    initializedService = dbTokenService.initialize()
  } else if (options.tokenService === 'file') {
    fileTokenService = new FileTokenService(options)
    initializedService = fileTokenService.initialize()
  } else if (options.tokenService === 'exported') {
    exportedTokenService = new ExportedTokenService(options)
    initializedService = exportedTokenService.initialize()
  }

  this.canAccessApi = function (req, res, next) {
    const bearer = req.get('Authorization')

    if (bearer) {
      return franceConnectService.userinfo(bearer).then((info) => {
        req.authType = 'FranceConnect'
        handleResult({name: [info.given_name, info.family_name].join(' '), email: info.email})
      }).catch(() => handleResult(null))
    }

    return initializedService.then((service) => {
      return service.getConsumer(req).then((result) => {
        handleResult(result)
      }).catch(() => handleResult(null))
    })

    function handleResult (result) {
      if (result) {
        req.logger.debug({ event: 'authorization' }, result.name + ' is authorized (' + result.role + ')')
        req.consumer = result
        next()
      } else {
        req.logger.debug({ event: 'authorization' }, 'not authorized')
        req.consumer = {}
        next(new StandardError('You are not authorized to use the api', {code: 401}))
      }
    }
  }
}
