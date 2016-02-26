module.exports = AdminController;

function AdminController(options) {
  options = options || {};
  logger = options.logger;

  this.getTokens = function(req, res, next) {
    options.tokenService.getTokens(function(err, results) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.send(results)
    });
  }

  this.createToken = function(req, res, next) {
    options.tokenService.createToken(req.body, function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.status(201);
      res.send(result)
    });
  }

  this.deleteToken = function(req, res, next) {
    options.tokenService.deleteToken(req.params.name, function(err, result) {
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
