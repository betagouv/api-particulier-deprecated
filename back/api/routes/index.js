const caf = require('./../caf')
const impots = require('./../impots')
const system = require('./../system')
const analytics = require('./../analytics')

exports.configure = function (app, options) {
  app.use('/api', system(options));

  app.use('/api/impots', impots(options));

  app.use('/api/caf', caf(options));

  app.use('/api/analytics', analytics(options));
};
