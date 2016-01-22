var expect = require('chai').expect;
var request = require('request');
var serverTest = require('./utils/server');
var nock = require('nock');
var fs = require('fs');


describe('Caf API', function () {
  const server = serverTest();
  const api = server.api;
  const httpResponse = fs.readFileSync(__dirname + '/resources/httpResponse.txt','utf-8');

  describe("ping", () => {
    it('replies 200', (done) => {
      nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1')
        .reply(200, httpResponse);

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
          .reply(200, httpResponse);

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
          .reply(400, httpResponse);

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
          .reply(200, httpResponse);

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
          .reply(400, httpResponse);

        api()
          .get('/api/caf/attestation/qf')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })
  });
});
