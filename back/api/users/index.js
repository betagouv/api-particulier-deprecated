
const express = require('express');
const Controller = require('./users.controller');

const router = express.Router();

module.exports = function(options){
  const userController = new Controller(options);

  router.get('/:user_mail', userController.getProfile);

  return router
}
