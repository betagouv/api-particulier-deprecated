const StandardError = require('standard-error')
const Ajv = require('ajv')
const schemas = require('./scopeSchemas')

const validatorsByScope = {
  dgfip_avis_imposition: new Ajv({ removeAdditional: true }).compile(schemas.dgfipAvisDImposition),
  dgfip_adresse: new Ajv({ removeAdditional: true }).compile(schemas.dgfipAdresse),
  cnaf_attestation_droits: new Ajv({ removeAdditional: true }).compile(schemas.cafFamille),
  cnaf_quotient_familial: new Ajv({ removeAdditional: true }).compile(schemas.cafQuotientFamilial)
}

module.exports = function (req, res, next) {
  const detail = []
  for (let scope of req.consumer.scopes) {
    const data = Object.assign({}, res.data)
    if (validatorsByScope[scope](data)) {
      res.data = data
      return next()
    }
    detail.push(validatorsByScope[scope].errors)
  }

  return next(new StandardError('Your scopes are invalid. You are not authorized to access this resource.', {code: 403, detail: detail}))
}
