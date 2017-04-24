'use strict'

const svair = require('svair-api')
const StandardError = require('standard-error')
const SvairBanService = require('./../ban/svairBan.service')
const format = require('./../lib/utils/format')

function ImpotController (options) {
  options = options || {}
  var svairBanService = new SvairBanService(options)

  this.adress = function (req, res, next) {
    var numeroFiscal = formatNumeroFiscal(req.query.numeroFiscal)
    var referenceAvis = formatReferenceAvis(req.query.referenceAvis)
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}))
    } else {
      svairBanService.getAdress(numeroFiscal, referenceAvis, (err, data) => {
        if (err) return next(err)
        return format(res, data)
      })
    }
  }

  function sendDataFromSvair (err, result, next, res) {
    if (err && err.message === 'Invalid credentials') {
      next(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404}))
    } else if (err) {
      next(new StandardError(err.message, {code: 500}))
    } else {
      return format(res, result)
    }
  }

  function formatNumeroFiscal (numeroFiscal) {
    return (numeroFiscal || '').replace(' ', '').substring(0, 13)
  }

  function formatReferenceAvis (referenceAvis) {
    return (referenceAvis || '').replace(' ', '')
  }

  this.svair = function (req, res, next) {
    var numeroFiscal = formatNumeroFiscal(req.query.numeroFiscal)
    var referenceAvis = formatReferenceAvis(req.query.referenceAvis)
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}))
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
}

module.exports = ImpotController
