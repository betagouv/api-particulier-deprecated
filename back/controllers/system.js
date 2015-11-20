"use strict";

const js2xmlparser = require("js2xmlparser");


class SystemController {

  constructor(options) {
    this.options = options
  }
  ping(req, res) {
    let result = "pong"
    return res.format({
      'application/json': function(){
         res.json(result)
      },
      'application/xml': function(){
        res.send(js2xmlparser("result", { ping: result}))
      },
      'default': function() {
        res.send(result);
      }
    });
  }

}

module.exports = SystemController;
