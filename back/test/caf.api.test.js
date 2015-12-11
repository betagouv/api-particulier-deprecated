var expect = require('chai').expect;
var request = require('request');
var serverTest = require('./utils/server');
var nock = require('nock');
var fs = require('fs');


describe('Caf API', function () {
  var server = serverTest();
  var api = server.api;

  describe("When getting the attestation", function () {

    var httpResponse = fs.readFileSync(__dirname + '/resources/httpResponse.txt','utf-8');

    describe("without errors", function() {
      it('replies 200', function (done) {

        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, httpResponse);

        api()
          .get('/api/caf/attestation')
          .expect("content-type", /application\/pdf/)
          .expect(200,done)
      });

      describe("ping", function() {
        it('replies 200', function (done) {

          nock('https://pep-test.caf.fr')
            .post('/sgmap/wswdd/v1')
            .reply(200, httpResponse);

          api()
            .get('/api/ping/caf')
            .expect("content-type", /json/)
            .expect(200,'"pong"', done)
        });
      })
    })

    describe("with  error", function() {
      it('replies 400', function (done) {
        nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(400, httpResponse);

        api()
          .get('/api/caf/attestation')
          .query({ numeroFiscal: 'toto' })
          .expect(500,done)
      });
    })

  });
});
