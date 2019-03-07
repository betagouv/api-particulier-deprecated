const serverTest = require('./../../test/utils/server')

describe('Impots API', function () {
  const server = serverTest()
  const api = server.api

  describe('When getting the svair', () => {
    describe('With headers X-User-Id X-User-Name X-User-Scopes', () => {
      it('replies 403 if invalid scope', () => {
        return api()
          .get('/api/impots/svair')
          .set('Accept', '*/*')
          .set('X-User-Id', 'test')
          .set('X-User-Name', 'test')
          .set('X-User-Scopes', 'cnaf_quotient_familial')
          .query({ referenceAvis: 'toto' })
          .expect('content-type', /json/)
          .expect(403)
      })

      describe('with dgfip_avis_imposition scope', () => {
        describe('When working with json', () => {
          describe('without numeroFiscal', () => {
            it('replies 400', () => {
              return api()
                .get('/api/impots/svair')
                .set('Accept', '*/*')
                .set('X-User-Id', 'test')
                .set('X-User-Name', 'test')
                .set('X-User-Scopes', 'dgfip_avis_imposition')
                .query({ referenceAvis: 'toto' })
                .expect('content-type', /json/)
                .expect(400)
            })

            describe('without referenceAvis', () => {
              it('replies 400', () => {
                return api()
                  .get('/api/impots/svair')
                  .set('Accept', '*/*')
                  .set('X-User-Id', 'test')
                  .set('X-User-Name', 'test')
                  .set('X-User-Scopes', 'dgfip_avis_imposition')
                  .query({ numeroFiscal: 'toto' })
                  .expect('content-type', /json/)
                  .expect(400)
              })
            })
          })
        })

        describe('When working with xml', () => {
          describe('without numeroFiscal', () => {
            it('replies 400', () => {
              return api()
                .get('/api/impots/svair')
                .set('Accept', 'application/xml')
                .set('X-User-Id', 'test')
                .set('X-User-Name', 'test')
                .set('X-User-Scopes', 'dgfip_avis_imposition')
                .query({ referenceAvis: 'toto' })
                .expect('content-type', /xml/)
                .expect(400)
            })
          })

          describe('without referenceAvis', () => {
            it('replies 400', () => {
              return api()
                .get('/api/impots/svair')
                .set('Accept', 'application/xml')
                .set('X-User-Id', 'test')
                .set('X-User-Name', 'test')
                .set('X-User-Scopes', 'dgfip_avis_imposition')
                .query({ numeroFiscal: 'toto' })
                .expect('content-type', /xml/)
                .expect(400)
            })
          })
        })
      })
    })
  })
})
