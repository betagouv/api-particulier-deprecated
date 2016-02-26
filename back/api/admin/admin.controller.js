module.exports = AdminController;

const TokenService = require('./tokens.service')

function AdminController(options) {
  options = options || {};
  const logger = options.logger;
  const tokenService = new TokenService(options)

  this.getTokens = function(req, res, next) {
    tokenService.getTokens(function(err, results) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.send(results)
    });
  }

  this.createToken = function(req, res, next) {
    tokenService.createToken(req.body, function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.status(201);
      res.send(result)
    });
  }

  this.deleteToken = function(req, res, next) {
    tokenService.deleteToken(req.params.name, function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      if(result) {
        res.status(204);
      } else {
        res.status(404);
      }
      res.end();
    });
  }
}
