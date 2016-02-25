module.exports = AdminController;

function AdminController(options) {
  options = options || {};
  logger = options.logger;

  this.getUsers = function(req, res, next) {
    options.usersService.getUsers(function(err, results) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.send(results)
    });
  }

  this.createUser = function(req, res, next) {
    options.usersService.createUser(req.body, function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.status(201);
      res.send(result)
    });
  }

  this.deleteUser = function(req, res, next) {
    options.usersService.deleteUser(req.params.name, function(err, result) {
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
