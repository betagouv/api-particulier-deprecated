"use strict";

var Redis = require('ioredis')

class UserService {

  constructor(options) {
    this.redis = new Redis(options.redis.port, options.redis.host);
    this.options = options;
    this.logger = options.logger;
  }

  getUsers(callback) {
    const self = this;
    self.redis.lrange(self.options.redis.tokensAuthorizedName, 0, -1, (err, results) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      results = results.map(function(result) { return JSON.parse(result)})
      callback(null, results)
    })
  }

  createUser(user, callback) {
    const self = this;
    self.redis.lpush(self.options.redis.tokensAuthorizedName, user, (err) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, user)
    })
  }

}


module.exports = UserService
