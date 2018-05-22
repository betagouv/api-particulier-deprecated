const expect = require('chai').expect
const ExportedTokenService = require('../exported-token.service')
const service = new ExportedTokenService()

describe('Exported Token Service', () => {
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

    return service.getConsumer(req).then((token) => {
      expect(token).to.equal(null)
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

    return service.getConsumer(req).then((token) => {
      expect(token).to.equal(null)
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

    return service.getConsumer(req).then((token) => {
      expect(token).to.equal(null)
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

    return service.getConsumer(req).then((token) => {
      expect(token).to.deep.equal({
        _id: 'test',
        name: 'test',
        scopes: ['test']
      })
    })
  })
})
