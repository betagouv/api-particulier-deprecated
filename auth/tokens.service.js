'use strict'

class TokenService {
  constructor (options) {
    if (options.logger) {
      options.logger.debug('load tokensPath', options.tokensPath)
    }
    this.tokens = require(options.tokensPath)
  }
  getToken (token) {
    return this.tokens[token]
  }
}

module.exports = TokenService
