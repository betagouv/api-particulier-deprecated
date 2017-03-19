'use strict';

const StandardError = require('standard-error');
const compose = require('composable-middleware');
const TokenService = require('./tokens.service')

module.exports = Auth

function Auth(options) {
  const tokenService = new TokenService(options)

  this.canAccessApi = function(req, res, next) {
    var token = req.get('X-API-Key') || ""

    const result = tokenService.getToken(token);
    if(result) {
     req.logger.debug({ event: 'authorization' }, result.name + ' is authorized ('+ result.role+')');
     req.consumer = result;
     next()
    } else {
     req.logger.debug({ event: 'authorization' }, 'not authorized');
     req.consumer= {}
     next(new StandardError('You are not authorized to use the api', {code: 401}));
    }

  }
}
