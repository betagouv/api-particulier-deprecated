'use strict'

class TokenService {
  constructor (options) {
    if (options.logger) {
      options.logger.debug('load tokensPath', options.tokensPath)
    }
    this.tokens = require(options.tokensPath)
  }

  initialize () {
    return Promise.resolve(this)
  }
  getToken (req) {
    let token = req.get('X-API-Key')
    // set defaults
    if (token === null || typeof token === 'undefined') {
      token = ''
    }

    return Promise.resolve(this.tokens[token])
  }
}

module.exports = TokenService
