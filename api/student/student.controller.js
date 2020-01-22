'use strict'

const StandardError = require('standard-error')
const axios = require('axios')

class StudentController {
  constructor (options) {
    this.options = options || {}
    this.baseUrl = options.supdataHost
    this.apiKey = options.supdataApiKey
    this.authorize = this.authorize.bind(this)
    this.ping = this.ping.bind(this)
    this.student = this.student.bind(this)
    this.consumerMatch = this.consumerMatch.bind(this)
  }

  authorize (req, res, next) {
    return next()
  }

  async ping (req, res, next) {
    try {
      await axios.get(
        `${this.baseUrl}/ping`, {timeout: 3000}
      )
      return res.send('pong')
    } catch (error) {
      if (!error.response) {
        return next(new StandardError(error.message, {code: 503, scope: 'etudiant'}))
      }
      return next(
        new StandardError(error.message, { code: 500, scope: 'etudiant' })
      )
    }
  }

  async student (req, res, next) {
    var ine = req.query.ine
    if (!ine) {
      return next(
        new StandardError(
          'Le paramètre ine doit être fourni dans la requête.',
          { code: 400, scope: 'etudiant' }
        )
      )
    }
    try {
      const { data: student } = await axios.get(
        `${this.baseUrl}/etudiantParIne`,
        {
          params: {
            INE: ine
          },
          headers: {
            'X-API-Key': this.apiKey
          },
          timeout: 3000
        }
      )
      res.data = student
      return next()
    } catch (error) {
      if (!error.response) {
        return next(new StandardError(error.message, {code: 503, scope: 'etudiant'}))
      }
      return next(
        new StandardError(error.message, {
          code: error.response.status,
          scope: 'etudiant'
        })
      )
    }
  }

  consumerMatch (req, res) {
    return req.query.ine && req.query.ine === res.data.ine
  }
}

module.exports = StudentController
