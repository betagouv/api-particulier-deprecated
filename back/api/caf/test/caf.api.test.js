const expect = require('chai').expect;
const request = require('request');
const serverTest = require('./../../test/utils/server');
const nock = require('nock');
const fs = require('fs');

describe('Caf API', function () {
  const server = serverTest();
  const api = server.api;
  const resourcePath = __dirname + '/../../test/resources'
  const pdfhttpResponse = fs.readFileSync(resourcePath + '/caf/pdf/httpResponse.txt','utf-8');
  const pdfhttpFunctionnalError = fs.readFileSync(resourcePath + '/caf/pdf/httpFunctionnalError.txt','utf-8');
  const xmlHttpResponse = fs.readFileSync(resourcePath + '/caf/xml/httpResponse.txt','utf-8');
  const xmlHttpResponseWithQF0 = fs.readFileSync(resourcePath + '/caf/xml/httpResponseWithQF0.txt','utf-8');
  const xmlHttpFunctionnalError = fs.readFileSync(resourcePath + '/caf/xml/httpFunctionnalError.txt','utf-8');
  const xmlHttpTechError = fs.readFileSync(resourcePath + '/caf/xml/httpTechError.txt','utf-8');

  describe("ping", () => {
    it('replies 200', (done) => {
      nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1')
        .reply(200, xmlHttpResponse);

      api()
        .get('/api/caf/ping')
        //.set("X-API-Key", "badKey")
        .expect("content-type", /json/)
        .expect(200,'"pong"', done)
    });
  })

  describe("When getting the attestation droits", () => {
    describe("without errors", () => {
      it('replies 200', (done) => {

        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, pdfhttpResponse);

        api()
          .get('/api/caf/attestation/droits')
          .expect("content-type", /application\/pdf/)
          .expect(200,done)
      });
    })

    describe("with http error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(400, pdfhttpResponse);

        api()
          .get('/api/caf/attestation/droits')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })

    describe("with functionnal error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, pdfhttpFunctionnalError);

        api()
          .get('/api/caf/attestation/droits')
          .query({ numeroFiscal: 'toto' })
          .expect(404,done)
      });
    })

    describe("with a incorrect token", () => {
      it('replies 403', function (done) {
        api()
          .get('/api/caf/attestation/droits')
          .set('X-API-Key', 'token-nok')
          .expect(401,done)
      });
    })
  });


  describe("When getting the attestation qf", () => {
    describe("without errors", () => {
      it('replies 200', (done) => {

        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, pdfhttpResponse);

        api()
          .get('/api/caf/attestation/qf')
          .expect("content-type", /application\/pdf/)
          .expect(200,done)
      });
      describe("with a incorrect token", () => {
        it('replies 403', function (done) {
          api()
            .get('/api/caf/attestation/qf')
            .set('X-API-Key', 'token-nok')
            .expect(401,done)
        });
      })
    })

    describe("with http error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(400, pdfhttpResponse);

        api()
          .get('/api/caf/attestation/qf')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })
  });

  describe("When getting the qf data", () => {
    describe("without errors", () => {
      it('replies 200', (done) => {

        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpResponse);

        api()
          .get('/api/caf/qf')
          .expect("content-type", /json/)
          .expect(200, (err, res) => {
            if(err) return done(err)
            expect(res.body.quotientFamilial).to.equal(345)
            done()
          })
      });
    })

    describe("when QF is 0", () => {
      it('replies 404', (done) => {

        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpResponseWithQF0);

        api()
          .get('/api/caf/qf')
          .expect("content-type", /json/)
          .expect(404, done)
      });
    })

    describe("with a incorrect token", () => {
      it('replies 403', function (done) {
        api()
          .get('/api/caf/qf')
          .set('X-API-Key', 'token-nok')
          .expect(401,done)
      });
    })

    describe("with http error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(400, xmlHttpResponse);

        api()
          .get('/api/caf/qf')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })
  });

  describe("When getting the adresses data", () => {
    describe("without errors", () => {
      it('replies 200', (done) => {

        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpResponse);

        api()
          .get('/api/caf/adresse')
          .expect("content-type", /json/)
          .expect(200, (err, res) => {
            if(err) return done(err)
            expect(res.body.adresse.identite).to.equal("Madame Marine Martin")
            done()
          })
      });
    })

    describe("with http error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(400, xmlHttpResponse);

        api()
          .get('/api/caf/adresse')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })

    describe("with a incorrect token", () => {
      it('replies 403', function (done) {
        api()
          .get('/api/caf/adresse')
          .set('X-API-Key', 'token-nok')
          .expect(401,done)
      });
    })
  });

  describe("When getting the famille data", () => {
    describe("without errors", () => {
      it('replies 200', (done) => {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpResponse);

        api()
          .get('/api/caf/famille')
          .expect("content-type", /json/)
          .expect(200, (err, res) => {
            if(err) return done(err)
            expect(res.body.enfants[0].nomPrenom).to.equal("Marie Martin")
            done()
          })
      });
    })

    describe("with a incorrect token", () => {
      it('replies 403', function (done) {
        api()
          .get('/api/caf/famille')
          .set('X-API-Key', 'token-nok')
          .expect(401,done)
      });
    })

    describe("with http error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(400, xmlHttpResponse);

        api()
          .get('/api/caf/famille')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })

    describe("with technical error", () => {
      it('replies 400',  (done) => {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpTechError);

        api()
          .get('/api/caf/famille')
          .query({ numeroFiscal: 'toto' })
          .expect(500, done)
      });
    })

    describe("with functional error", () => {
      it('replies 400', (done) => {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, xmlHttpFunctionnalError);

        api()
          .get('/api/caf/famille')
          .query({ numeroFiscal: 'toto' })
          .expect(400, done)
      });
    })
  });
});
