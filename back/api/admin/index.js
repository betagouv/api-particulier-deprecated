
var express = require('express');
var Controller = require('./admin.controller');

var router = express.Router();

module.exports = function(options){
  var adminController = new Controller(options);

  router.get('/users', adminController.getUsers);
  router.post('/users', adminController.createUser);
  router.delete('/users/:name', adminController.deleteUser);

  return router
}
