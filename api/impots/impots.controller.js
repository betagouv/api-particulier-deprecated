'use strict'

const svair = require('svair-api')
const StandardError = require('standard-error')

function ImpotController (options) {
  options = options || {}

  function sendDataFromSvair (err, result, next, res) {
    if (err && err.message === 'Invalid credentials') {
      next(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404, scope: 'dgfip'}))
    } else if (err) {
      next(new StandardError(err.message, {code: 500, scope: 'dgfip'}))
    } else {
      res.data = result
      return next()
    }
  }

  function formatNumeroFiscal (numeroFiscal) {
    return (numeroFiscal || '').replace(/ /g, '').substring(0, 13)
  }

  function formatReferenceAvis (referenceAvis) {
    return (referenceAvis || '').replace(/ /g, '')
  }

  this.svair = function (req, res, next) {
    var numeroFiscal = formatNumeroFiscal(req.query.numeroFiscal)
    var referenceAvis = formatReferenceAvis(req.query.referenceAvis)
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400, scope: 'dgfip'}))
    } else {
      svair(options.svairHost)(numeroFiscal, referenceAvis, function (err, result) {
        sendDataFromSvair(err, result, next, res)
      })
    }
  }

  this.ping = function (req, res, next) {
    var numeroFiscal = options.numeroFiscal
    var referenceAvis = options.referenceAvis
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}))
    } else {
      svair(options.svairHost)(numeroFiscal, referenceAvis, function (err) {
        sendDataFromSvair(err, 'pong', next, res)
      })
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
            {code: 403}
          )
        )
      }
    } else {
      return next()
    }
  }

  function consumerMatch (req, res) {
    const impotsNames = upcaseImpotsNames(res)
    const consumerName = req.consumer.name.toUpperCase()

    return impotsNames.indexOf(consumerName) !== -1
  }

  function upcaseImpotsNames (res) {
    let names = [
      res.data.declarant1.prenoms.split(' ')[0] + ' ' + res.data.declarant1.nom,
      res.data.declarant2.prenoms.split(' ')[0] + ' ' + res.data.declarant2.nom
    ]
    return names.map((name) => name.toUpperCase())
  }
}

module.exports = ImpotController
