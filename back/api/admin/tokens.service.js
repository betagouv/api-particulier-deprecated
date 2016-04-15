'use strict';

const Redis = require('ioredis')
const async = require('async')

class TokenService {

  constructor(options) {
    this.redis = options.redis.driver
    this.key = options.redis.tokensPrefix;
  }

  getTokens(callback) {
    this.redis.keys(this.key +'::*', (err, keys) => {
      if(err) {
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      async.map(keys, (item, callback) => {
        this.redis.get(item, (err, result) => {
          if(err) return callback(err);
          callback(null, (result))
        } )
      }, (err, results) => {
        if(err) {
          return callback(new StandardError("Impossible to connect to redis", {code: 500}))
        }
        callback(null, results.map(JSON.parse))
      })

    })
  }

  getToken(token, callback) {
    this.redis.get(this.key + '::' + token, (err, result) => {
      if(err) {
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, JSON.parse(result))
    })
  }

  createToken(user, callback) {
    this.redis.set(this.key +'::'+ user.token, JSON.stringify(user), (err) => {
      if(err) {
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, user)
    })
  }

  deleteToken(token, callback) {
    this.redis.del(this.key + '::'+ token, (err, result) => {
      if(err) {
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, result)
    })

  }
}


module.exports = TokenService
