const StandardError = require('standard-error')
const validate = require('jsonschema').validate
const schemas = require('./scopeSchemas')

module.exports = function (req, res, next) {
  if (dgfipData(res.data)) return scopeRequired('dgfip', req, res, next)
  if (cafData(res.data)) return scopeRequired('caf', req, res, next)
  return next(new StandardError('You are not authorized to use the api', {code: 401}))
}

function dgfipData (data) {
  return validate(data, schemas.impotsSvair).valid ||
    validate(data, schemas.impotsAdresse).valid
}

function cafData (data) {
  return validate(data, schemas.cafFamille).valid
}

function scopeRequired (scope, req, res, next) {
  if (req.consumer.scopes.filter((e) => e === scope)[0]) {
    return next()
  }
  return next(new StandardError('You are not authorized to access this resource.', {code: 403}))
}
