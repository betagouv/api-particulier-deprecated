const admin = require('./../admin')
const caf = require('./../caf')
const impots = require('./../impots')
const system = require('./../system')
const users = require('./../users')

exports.configure = function (app, options) {
  app.use('/api', system(options));

  app.use('/api/impots', impots(options));

  app.use('/api/admin', admin(options));

  app.use('/api/caf', caf(options));

  app.use('/api/users', users(options));
};
