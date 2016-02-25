
var express = require('express');
var Controller = require('./impots.controller');

var router = express.Router();

module.exports = function(options){
  var impotsController = new Controller(options);

  router.get('/svair', impotsController.svair);
  router.get('/ping', impotsController.ping);
  router.get('/adress', impotsController.adress);

  return router
}
