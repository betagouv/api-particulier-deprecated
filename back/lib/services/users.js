"use strict";

var Redis = require('ioredis')

class UserService {

  constructor(options) {
    this.redis = new Redis(options.redis.port, options.redis.host);
    this.options = options;
    this.logger = options.logger;
    this.key = options.redis.tokensPrefix;
  }

  getUsers(callback) {
    const self = this;
    self.redis.lrange(self.key, 0, -1, (err, results) => {
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
    self.redis.lpush(self.key, user, (err) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      callback(null, user)
    })
  }

  deleteUser(userName, callback) {
    const self = this;
    self.redis.lrange(self.key, 0, -1, (err, results) => {
      if(err) {
        self.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      const names = results
                  .map((result) => { return JSON.parse(result)})
                  .map((user) => {user.name})
      const index = names.indexOf(userName)
      self.redis.lset(self.key, index, '{name:"deleted"}', (err) => {
        if(err) {
          self.logger.error(err);
          return callback(new StandardError("Impossible to connect to redis", {code: 500}))
        }
        self.redis.lrem(self.key, 0, '{name:"deleted"}', (err, results) => {
          if(err) {
            self.logger.error(err);
            return callback(new StandardError("Impossible to connect to redis", {code: 500}))
          }
          callback();
        })
      })


      callback(null, results)
    })
  }
}


module.exports = UserService
