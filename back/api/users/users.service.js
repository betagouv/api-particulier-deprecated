'use strict';
const StandardError = require('standard-error');

class UserService {

  constructor(options) {
    this.redis = options.redis.driver
    this.key = options.redis.userPrefix;
  }

  getUser(email, callback) {
    this.redis.get(this.key + '::' + email, (err, result) => {
      if(err) {
        return callback(new StandardError('Impossible to connect to redis', {code: 500}))
      }
      callback(null, JSON.parse(result))
    })
  }

  setUser(user, callback) {
    this.redis.set(this.key +'::'+ user.email, JSON.stringify(user), (err) => {
      if(err) {
        return callback(new StandardError('Impossible to connect to redis', {code: 500}))
      }
      callback(null, user)
    })
  }

  deleteUser(email, callback) {
    this.redis.del(this.key + '::'+ email, (err, result) => {
      if(err) {
        return callback(new StandardError('Impossible to connect to redis', {code: 500}))
      }
      callback(null, result)
    })

  }
}


module.exports = UserService
