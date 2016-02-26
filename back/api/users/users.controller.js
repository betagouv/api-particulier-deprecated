module.exports = UserController;

function UserController(options) {
  options = options || {};
  logger = options.logger;

  this.getProfile = function(req, res, next) {
    res.json({})
  }
}
