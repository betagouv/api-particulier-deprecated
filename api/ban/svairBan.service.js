'use strict';


const BanService = require('./../ban/ban.service')
const Svair = require('svair-api')
const StandardError = require('standard-error');


class SvairBanService {

  constructor(options) {
    this.banService = new BanService(options)
    this.svair = new Svair(options.svairHost)
  }

  getAdress(numeroFiscal, referenceAvis, callback) {
    this.svair(numeroFiscal, referenceAvis, (err, svairResult) => {
      if (err && err.message === 'Invalid credentials') {
        callback(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404}));
      } else if (err) {
        callback(new StandardError(err.message, {code: 500}));
      } else {
        this.banService.getAdress(svairResult.foyerFiscal.adresse, (err, banResult) => {
          if(err) return callback(new StandardError('Impossible d\'enrichir l\'adresse', {code: 500}));
          const result = {
            adresses : banResult,
            declarant1: svairResult.declarant1,
            declarant2: svairResult.declarant2,
            foyerFiscal: svairResult.foyerFiscal
          }
          callback(null, result)
        })
      }
    });
  }
}

module.exports = SvairBanService
