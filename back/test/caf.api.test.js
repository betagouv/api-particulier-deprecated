const expect = require('chai').expect;
const request = require('request');
const serverTest = require('./utils/server');
const nock = require('nock');
const fs = require('fs');

describe('Caf API', function () {
  const server = serverTest();
  const api = server.api;
  const pdfhttpResponse = fs.readFileSync(__dirname + '/resources/caf/pdf/httpResponse.txt','utf-8');
  const xmlHttpResponse = fs.readFileSync(__dirname + '/resources/caf/xml/httpResponse.txt','utf-8');

  describe("ping", () => {
    it('replies 200', (done) => {
      nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1')
        .reply(200, pdfhttpResponse);

      api()
        .get('/api/ping/caf')
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

    describe("with  error", function() {
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
    })

    describe("with  error", function() {
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

    describe("with  error", function() {
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
            expect(res.body.libelles[0]).to.equal("Madame Marine Martin")
            done()
          })
      });
    })

    describe("with  error", function() {
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
  });
});
