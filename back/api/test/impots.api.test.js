const expect = require('chai').expect;
const request = require('request');
const serverTest = require('./utils/server');

describe('Impots API', function () {
  const server = serverTest();
  const api = server.api;

  describe("When getting the svair", () => {
    describe("When working with json", () => {
      describe("without numeroFiscal", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/svair')
            .set('Accept', '*/*')
            .query({ referenceAvis: 'toto' })
            .expect("content-type", /json/)
            .expect(400,done)
        });
      })

      describe("without referenceAvis", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/svair')
            .set('Accept', '*/*')
            .query({ numeroFiscal: 'toto' })
            .expect("content-type", /json/)
            .expect(400,done)
        });
      })
    })

    describe("When working with xml", () => {
      describe("without numeroFiscal", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/svair')
            .set('Accept', 'application/xml')
            .query({ referenceAvis: 'toto' })
            .expect("content-type", /xml/)
            .expect(400,done)
        });
      })

      describe("without referenceAvis", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/svair')
            .set('Accept', 'application/xml')
            .query({ numeroFiscal: 'toto' })
            .expect("content-type", /xml/)
            .expect(400,done)
        });
      })
    })


  });

  describe("When getting the svair", () => {
    describe("When working with json", () => {
      describe("without numeroFiscal", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/adress')
            .set('Accept', '*/*')
            .query({ referenceAvis: 'toto' })
            .expect("content-type", /json/)
            .expect(400,done)
        });
      })

      describe("without referenceAvis", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/adress')
            .set('Accept', '*/*')
            .query({ numeroFiscal: 'toto' })
            .expect("content-type", /json/)
            .expect(400,done)
        });
      })
    })

    describe("When working with xml", () => {
      describe("without numeroFiscal", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/adress')
            .set('Accept', 'application/xml')
            .query({ referenceAvis: 'toto' })
            .expect("content-type", /xml/)
            .expect(400,done)
        });
      })

      describe("without referenceAvis", () => {
        it('replies 400', (done) => {
          api()
            .get('/api/impots/adress')
            .set('Accept', 'application/xml')
            .query({ numeroFiscal: 'toto' })
            .expect("content-type", /xml/)
            .expect(400,done)
        });
      })
    })


  });
});
