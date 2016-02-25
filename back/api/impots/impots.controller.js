"use strict";

const svair = require('svair-api')
const StandardError = require('standard-error');
const SvairBanService = require('./../ban/svairBan.service')
const format = require('./../lib/utils/format')
const js2xmlparser = require('js2xmlparser')

function ImpotController(options) {
  var options = options || {}
  var svairBanService = new SvairBanService(options)

  this.adress = function(req, res, next) {
    var numeroFiscal = req.query.numeroFiscal;
    var referenceAvis = req.query.referenceAvis;
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}));
    } else {
      svairBanService.getAdress(numeroFiscal, referenceAvis, (err, data) => {
        if(err) return next(err)
        return format(res, data)
      })

    }
  }

  function sendDataFromSvair(err, result, next, res) {
    if (err && err.message === 'Invalid credentials') {
      next(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404}));
    } else if (err) {
      next(new StandardError(err.message, {code: 500}));
    } else {
      return format(res, result)
    }
  }

  this.svair = function(req, res, next) {
    var numeroFiscal = req.query.numeroFiscal;
    var referenceAvis = req.query.referenceAvis;
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}));
    } else {
      svair(options.svairHost)(numeroFiscal, referenceAvis, function(err, result) {
        sendDataFromSvair(err, result, next, res)
      });
    }
  }

  this.ping = function(req, res, next) {
    var numeroFiscal = options.numeroFiscal;
    var referenceAvis = options.referenceAvis;
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}));
    } else {
      svair(options.svairHost)(numeroFiscal, referenceAvis, function(err, result) {
        sendDataFromSvair(err, 'pong', next, res)
      });
    }
  }
}

module.exports = ImpotController;
