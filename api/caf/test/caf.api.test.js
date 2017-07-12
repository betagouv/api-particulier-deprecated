const serverTest = require('./../../test/utils/server')
const {expect} = require('chai')
const fakeQuery = {codePostal: '99148', numeroAllocataire: '0000354'}
const fakeResponse = require('../fake-response')

describe('CAF API', function () {
  const server = serverTest()
  const api = server.api

  describe('Ping', () => {
    it('replies a 200', () => {
      return api()
        .get('/api/caf/ping')
        .expect(200)
    })
  })

  describe('When getting CAF informations', () => {
    describe('Without query parameters', () => {
      it('replies a 400', () => {
        return api()
          .get('/api/caf/famille')
          .set('Accept', '*/*')
          .expect(400)
      })
    })

    describe('With query parameters', (done) => {
      it('replies 200', () => {
        return api()
          .get('/api/caf/famille')
          .query(fakeQuery)
          .expect(200)
      })

      it('replies the good json response', () => {
        return api()
          .get('/api/caf/famille')
          .query(fakeQuery)
          .then((res) => {
            expect(res.body).to.deep.equal(fakeResponse)
          })
      })

      it('replies as xml when asked', () => {
        return api()
          .get('/api/caf/famille')
          .query(fakeQuery)
          .set('Accept', 'application/xml')
          .expect('content-type', /xml/)
      })
    })
  })
})
