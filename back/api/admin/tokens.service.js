'use strict';

const Redis = require('ioredis')
const async = require('async')

class TokenService {

  constructor(options) {
    this.redis = new Redis(options.redis.port, options.redis.host);
    this.options = options;
    this.logger = options.logger;
    this.key = options.redis.tokensPrefix;
  }

  getTokens(callback) {
    const self = this;
    self.redis.keys(self.key +'::*', (err, keys) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      async.map(keys, (item, callback) => {
        self.redis.get(item, (err, result) => {
          if(err) return callback(err);
          callback(null, (result))
        } )
      }, (err, results) => {
        if(err) {
          self.logger.error(err);
          return callback(new StandardError("Impossible to connect to redis", {code: 500}))
        }
        callback(null, results.map(JSON.parse))
      })

    })
  }

  getToken(token, callback) {
    const self = this;
    self.redis.get(self.key + '::' + token, (err, result) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, JSON.parse(result))
    })
  }

  createToken(user, callback) {
    const self = this;
    self.redis.set(self.key +'::'+ user.token, JSON.stringify(user), (err) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, user)
    })
  }

  deleteToken(token, callback) {
    const self = this;
    self.redis.del(self.key + '::'+ token, (err, result) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, result)
    })

  }
}


module.exports = TokenService
