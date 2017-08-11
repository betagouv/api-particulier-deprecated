const caf = require('../caf')
const impots = require('../impots')
const system = require('../system')

exports.configure = function (app, options) {
  app.use('/api', system(options))

  app.use('/api/impots', impots(options))

  app.use('/api/caf', caf(options))
}
