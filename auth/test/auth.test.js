const {expect} = require('chai')
const sinon = require('sinon')

describe('Auth service', () => {
  describe('Exported Auth', () => {
    const Auth = require('../auth')
    const service = new Auth()

    it('should not let pass if there is no X-User-Id header', () => {
      const req = {
        get: function (params) {
          const res = {
            'X-User-Name': 'test',
            'X-User-Scopes': 'test'
          }
          return res[params]
        },
        logger: {
          debug: function (params) {}
        }
      }
      const nextSpy = sinon.spy()

      return service.canAccessApi(req, {}, nextSpy).then(() => {
        expect(nextSpy.lastCall.args[0].code).to.equal(401)
      })
    })

    it('should not let pass if there is no X-User-Name header', () => {
      const req = {
        get: function (params) {
          const res = {
            'X-User-Id': 'test',
            'X-User-Scopes': 'test'
          }
          return res[params]
        },
        logger: {
          debug: function (params) {}
        }
      }
      const nextSpy = sinon.spy()

      return service.canAccessApi(req, {}, nextSpy).then(() => {
        expect(nextSpy.lastCall.args[0].code).to.equal(401)
      })
    })

    it('should not let pass if there is no X-User-Scopes header', () => {
      const req = {
        get: function (params) {
          const res = {
            'X-User-Id': 'test',
            'X-User-Name': 'test'
          }
          return res[params]
        },
        logger: {
          debug: function (params) {}
        }
      }
      const nextSpy = sinon.spy()

      return service.canAccessApi(req, {}, nextSpy).then(() => {
        expect(nextSpy.lastCall.args[0].code).to.equal(401)
      })
    })

    it('should let pass if headers set', () => {
      const req = {
        get: function (params) {
          const res = {
            'X-User-Id': 'test',
            'X-User-Name': 'test',
            'X-User-Scopes': 'test'
          }
          return res[params]
        },
        logger: {
          debug: function (params) {}
        }
      }
      const nextSpy = sinon.spy()

      return service.canAccessApi(req, {}, nextSpy).then(() => {
        expect(req.consumer).to.deep.equal({
          _id: 'test',
          name: 'test',
          scopes: ['test']
        })
      })
    })
  })
})
