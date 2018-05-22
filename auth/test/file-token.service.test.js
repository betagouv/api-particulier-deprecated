const path = require('path')
const expect = require('chai').expect
const Service = require('../file-tokens.service')

describe('File Token service', () => {
  const service = new Service({
    tokensPath: path.join(__dirname, './tokens')
  })

  it('gets a token when the token exists', () => {
    const req = {
      get: function (key) {
        const res = {
          'X-API-Key': 'test-token'
        }
        return res[key]
      }
    }
    return service.getConsumer(req).then((token) => {
      expect(token).to.deep.equal({
        'name': 'Jeu de test',
        'mail': 'someone@somewhere.com'
      })
    })
  })

  it('gets null when the token dose not exists', () => {
    const req = {
      get: function (key) {
        const res = {
          'X-API-Key': 'bad-token'
        }
        return res[key]
      }
    }
    return service.getConsumer(req).then((token) => {
      expect(token).to.equal(undefined)
    })
  })
})
