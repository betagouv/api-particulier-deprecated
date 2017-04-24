const path = require('path')
const expect = require('chai').expect
const Service = require('../tokens.service')

describe('Token service', () => {
  const service = new Service({
    tokensPath: path.join(__dirname, '../tokens')
  })
  describe('when the token exist', () => {
    it('return the user', () => {
      expect(service.getToken('test-token')).to.deep.equal({
        'name': 'Jeu de test',
        'mail': 'someone@somewhere.com'
      })
    })
  })

  describe('when the token doesn\'t exist', () => {
    it('return undefined', () => {
      expect(service.getToken('te-token')).to.be.undefined
    })
  })
})
