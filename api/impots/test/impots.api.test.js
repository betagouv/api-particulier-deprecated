const serverTest = require('./../../test/utils/server')

describe('Impots API', function () {
  const server = serverTest()
  const api = server.api

  describe('When getting the svair', () => {
    describe('When working with json', () => {
      describe('without numeroFiscal', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/svair')
            .set('Accept', '*/*')
            .query({ referenceAvis: 'toto' })
            .expect('content-type', /json/)
            .expect(400)
        })
      })

      describe('without referenceAvis', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/svair')
            .set('Accept', '*/*')
            .query({ numeroFiscal: 'toto' })
            .expect('content-type', /json/)
            .expect(400)
        })
      })
    })

    describe('When working with xml', () => {
      describe('without numeroFiscal', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/svair')
            .set('Accept', 'application/xml')
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
            .query({ numeroFiscal: 'toto' })
            .expect('content-type', /xml/)
            .expect(400)
        })
      })
    })

    describe('with a incorrect token', () => {
      describe('when getting the svair', () => {
        it('replies 403', function () {
          return api()
            .get('/api/impots/svair')
            .set('X-API-Key', 'token-nok')
            .expect(401)
        })
      })
    })
  })

  describe('When getting the adress', () => {
    describe('When working with json', () => {
      describe('without numeroFiscal', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/adress')
            .set('Accept', '*/*')
            .query({ referenceAvis: 'toto' })
            .expect('content-type', /json/)
            .expect(400)
        })
      })

      describe('without referenceAvis', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/adress')
            .set('Accept', '*/*')
            .query({ numeroFiscal: 'toto' })
            .expect('content-type', /json/)
            .expect(400)
        })
      })
    })

    describe('When working with xml', () => {
      describe('without numeroFiscal', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/adress')
            .set('Accept', 'application/xml')
            .query({ referenceAvis: 'toto' })
            .expect('content-type', /xml/)
            .expect(400)
        })
      })

      describe('without referenceAvis', () => {
        it('replies 400', () => {
          return api()
            .get('/api/impots/adress')
            .set('Accept', 'application/xml')
            .query({ numeroFiscal: 'toto' })
            .expect('content-type', /xml/)
            .expect(400)
        })
      })
    })

    describe('with a incorrect token', () => {
      describe('when getting the adress', () => {
        it('replies 403', function () {
          return api()
            .get('/api/impots/adress')
            .set('X-API-Key', 'token-nok')
            .expect(401)
        })
      })
    })
  })
})
