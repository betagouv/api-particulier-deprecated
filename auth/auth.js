const StandardError = require('standard-error')

module.exports = Auth

function Auth (options) {
  function getConsumer (req) {
    const id = req.get('X-User-Id')
    const name = req.get('X-User-Name')
    let scopes = req.get('X-User-Scopes')
    if (scopes) scopes = scopes.split(' ')

    if (!(id && name && scopes)) {
      return Promise.reject(new StandardError('request headers are not set', {code: 401}))
    }

    return Promise.resolve({
      _id: id,
      name,
      scopes
    })
  }

  this.canAccessApi = function (req, res, next) {
    return getConsumer(req).then((user) => {
      req.logger.debug({ event: 'authorization' }, user.name + ' is authorized (' + user.scopes.join(' ') + ')')
      req.consumer = user
      return next()
    }).catch((error) => {
      req.logger.debug({ event: 'authorization' }, 'not authorized')
      req.consumer = {}
      next(error)
    })
  }
}
