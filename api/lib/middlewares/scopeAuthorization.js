const StandardError = require('standard-error')
const Ajv = require('ajv')
const schemas = require('./scopeSchemas')

const validators = {
  impotsSvair: new Ajv({ removeAdditional: true }).compile(schemas.impotsSvair),
  impotsAdresse: new Ajv({ removeAdditional: true }).compile(schemas.impotsAdresse),
  dgfipAdresse:  new Ajv({ removeAdditional: true }).compile(schemas.dgfipAdresse),
  cafFamille: new Ajv({ removeAdditional: true }).compile(schemas.cafFamille),
  cafQuotientFamilial: new Ajv({ removeAdditional: true }).compile(schemas.cafQuotientFamilial)
}

const dataDefinitionByScope = {
  dgfip_avis_imposition: ['impotsSvair', 'impotsAdresse'],
  dgfip_adresse: ['dgfipAdresse'],
  cnaf_attestation_droits: ['cafFamille'],
  cnaf_quotient_familial: ['cafQuotientFamilial']
}

module.exports = function (req, res, next) {
  const detail = []
  for (let scope of req.consumer.scopes) {
    for (let dataDefinition of dataDefinitionByScope[scope] || []) {
      const data = Object.assign({}, res.data)
      if (validators[dataDefinition](data)) {
        res.data = data
        return next()
      }
      detail.push(validators[dataDefinition].errors)
    }
  }

  return next(new StandardError('Your scopes are invalid. You are not authorized to access this resource.', {code: 403, detail: detail}))
}
