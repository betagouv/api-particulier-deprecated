
var express = require('express');
var Controller = require('./analytics.controller');

var router = express.Router();

module.exports = function(options){
  var analyticsController = new Controller(options);

  router.get('/requestsLast30days', analyticsController.requestsLast30days);

  return router
}
