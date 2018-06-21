const StandardError = require('standard-error')

module.exports = function (err, req, res, next) {
  if (err instanceof StandardError) {
    if (err.scope && err.scope.match(/cnaf|dgfip/)) {
      if (!req.consumer.scopes.some((e) => e.match(err.scope))) {
        return next(new StandardError('Your scopes are invalid. You are not authorized to access this resource.', {code: 403}))
      }
    }
    return next(err)
  } else {
    next(err)
  }
}
