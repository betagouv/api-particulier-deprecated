const StandardError = require('standard-error')
const DbTokenService = require('./db-tokens.service')
const FileTokenService = require('./file-tokens.service')

module.exports = Auth

function Auth (options) {
  let fileTokenService, dbTokenService, initializedService

  if (options.tokenService === 'db') {
    dbTokenService = new DbTokenService(options)
    initializedService = dbTokenService.initialize()
  } else {
    fileTokenService = new FileTokenService(options)
    initializedService = fileTokenService.initialize()
  }

  this.canAccessApi = function (req, res, next) {
    const token = req.get('X-API-Key') || ''

    return initializedService.then((service) => {
      return service.getToken(token).then((result) => {
        handleResult(result)
      })
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
