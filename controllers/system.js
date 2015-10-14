module.exports = SystemController;

function SystemController(options) {
  options = options || {};

  this.ping = function(req, res) {
    return res.json("pong");
  }

}
