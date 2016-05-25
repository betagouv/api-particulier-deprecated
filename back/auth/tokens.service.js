'use strict';

const async = require('async')
const StandardError = require('standard-error');
const tokens = require('./tokens')

class TokenService {
  constructor(options) {
    console.log('load tokensPath', options.tokensPath)
    this.tokens = require(options.tokensPath)
  }
  getToken(token) {
    return this.tokens[token]
  }
}


module.exports = TokenService
