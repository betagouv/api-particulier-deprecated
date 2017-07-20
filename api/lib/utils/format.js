const js2xmlparser = require('js2xmlparser')

module.exports = function (req, res, next) {
  let data = res.data
  return res.format({
    'application/json': function () {
      res.json(data)
    },
    'application/xml': function () {
      if (typeof data === 'string') {
        data = {data: data}
      }
      res.send(js2xmlparser('result', data))
    },
    'default': function () {
      res.status(406).send('Not Acceptable')
    }
  })
}
