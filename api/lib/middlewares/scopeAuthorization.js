const StandardError = require('standard-error')
const scopeToProperties = require('./scopeToProperties')
const _ = require('lodash')
const pickExtended = require('../utils/pickExtended')

module.exports = function (req, res, next) {
  const authorizedScopes = Object.keys(scopeToProperties)

  const filteringScopes = _.intersection(authorizedScopes, req.consumer.scopes)

  if (filteringScopes.length < 1) {
    return next(new StandardError('Your scopes are invalid. You are not authorized to access this resource.', {code: 403}))
  }

  const propertiesToReturn = _(filteringScopes)
    // ['dgfip_avis_imposition', 'dgfip_adresse']
    .map(scope => scopeToProperties[scope])
    // [['nombreParts', ..., 'revenuFiscalReference'], ['nombreParts']]
    .flatten()
    // ['nombreParts', ..., 'revenuFiscalReference', 'nombreParts']
    .uniq()
    // ['nombreParts', ..., 'revenuFiscalReference']
    .value()

  // This will return the properties in res.data listed in the propertiesToReturn array
  res.data = pickExtended(res.data, propertiesToReturn)

  next()
}
