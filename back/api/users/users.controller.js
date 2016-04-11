module.exports = UserController;

function UserController(options) {
  options = options || {};

  this.getProfile = function(req, res) {
    res.json({})
  }
}
