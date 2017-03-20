const cafRouter = require('api-caf/lib/router')
const impots = require('./../impots')
const system = require('./../system')
const analytics = require('./../analytics')
const fs = require('fs')

exports.configure = function (app, options) {
  app.use('/api', system(options));

  app.use('/api/impots', impots(options));

  app.use('/api/caf', cafRouter({
    serviceParams: {
      host: options.cafHost,
      cert: fs.readFileSync(options.cafSslCertificate),
      key: fs.readFileSync(options.cafSslKey)
    },
    pingParams: options.cafPingParams
  }));

  app.use('/api/analytics', analytics(options));
};
