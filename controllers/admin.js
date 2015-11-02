var StandardError = require('standard-error');
var Redis = require('ioredis');


module.exports = CafController;

function CafController(options) {
  options = options || {};
  logger = options.logger;

  this.getUsers = function(req, res, next) {
    if(req.userConnected.role && req.userConnected.role !== 'admin') {
      return next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    }
    options.redisClient.lrange(options.tokensAuthorizedName, 0, -1, function (err, results) {
      if(err) {
        logger.error(err);
        return next(new StandardError("Impossible to connect to redis", {code: 500}))
      }
      results = results.map(function(result) { return JSON.parse(result)})
      res.send(results)
    });
  }
}
