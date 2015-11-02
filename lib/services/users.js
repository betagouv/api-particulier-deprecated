var Redis = require('ioredis')


module.exports = function (options) {
  this.redis = new Redis(options.redis.port, options.redis.host);
  this.options = options;
  logger = options.logger;

  this.getUsers = function(callback) {
    var self = this;
    self.redis.lrange(self.options.redis.tokensAuthorizedName, 0, -1, function (err, results) {
      if(err) {
        self.options.logger.error(err);
        return callback(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      results = results.map(function(result) { return JSON.parse(result)})
      callback(null, results)
    })
  }
}
