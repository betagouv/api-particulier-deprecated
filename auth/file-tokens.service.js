'use strict'

class TokenService {
  constructor (options) {
    if (options.logger) {
      options.logger.debug('load tokensPath', options.tokensPath)
    }
    this.tokens = require(options.tokensPath)
  }

  initialize() {
    return Promise.resolve(this)
  }
  getToken (token) {
    return Promise.resolve(this.tokens[token])
  }
}

module.exports = TokenService
