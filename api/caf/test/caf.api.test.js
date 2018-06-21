const serverTest = require('./../../test/utils/server')
const {expect} = require('chai')
const fakeQuery = {codePostal: '99148', numeroAllocataire: '0000354'}
const fakeResponse = require('../fake-responses')[0].response

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
    describe('With headers X-User-Id X-User-Name X-User-Scopes', () => {
      it('replies a 403 if invalid scope', () => {
        return api()
          .get('/api/caf/famille')
          .set('Accept', '*/*')
          .set('X-User-Id', 'test')
          .set('X-User-Name', 'test')
          .set('X-User-Scopes', 'dgfip_avis_imposition')
          .expect(403)
      })

      describe('with cnaf_attestation_droits scope', () => {
        describe('Without query parameters', () => {
          it('replies a 400', () => {
            return api()
              .get('/api/caf/famille')
              .set('Accept', '*/*')
              .set('X-User-Id', 'test')
              .set('X-User-Name', 'test')
              .set('X-User-Scopes', 'cnaf_attestation_droits')
              .expect(400)
          })
        })

        describe('With query parameters', (done) => {
          it('replies 200', () => {
            return api()
              .get('/api/caf/famille')
              .set('Accept', '*/*')
              .set('X-User-Id', 'test')
              .set('X-User-Name', 'test')
              .set('X-User-Scopes', 'cnaf_attestation_droits')
              .query(fakeQuery)
              .expect(200)
          })

          it('replies the good json response', () => {
            return api()
              .get('/api/caf/famille')
              .set('Accept', '*/*')
              .set('X-User-Id', 'test')
              .set('X-User-Name', 'test')
              .set('X-User-Scopes', 'cnaf_attestation_droits')
              .query(fakeQuery)
              .then((res) => {
                expect(res.body).to.deep.equal(fakeResponse)
              })
          })

          it('replies as xml when asked', () => {
            return api()
              .get('/api/caf/famille')
              .set('Accept', 'application/xml')
              .set('X-User-Id', 'test')
              .set('X-User-Name', 'test')
              .set('X-User-Scopes', 'cnaf_attestation_droits')
              .query(fakeQuery)
              .expect('content-type', /xml/)
          })
        })
      })
    })
  })
})
