const caf = require('../caf')
const impots = require('../impots')
const student = require('../student')
const system = require('../system')

exports.configure = function (app, options) {
  app.use('/api', system(options))

  app.use('/api/impots', impots(options))

  app.use('/api/caf', caf(options))

  app.use('/api/etudiant', student(options))
}
