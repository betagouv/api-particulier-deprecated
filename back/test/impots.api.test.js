var expect = require('chai').expect;
var request = require('request');
var serverTest = require('./utils/server');

describe('Impots API', function () {
  var server = serverTest();
  var api = server.api;

  describe("When getting the svair", function () {

    describe("without numeroFiscal", function() {
      it('replies 400', function (done) {
        api()
          .get('/api/impots/svair')
          .query({ referenceAvis: 'toto' })
          .expect("content-type", /json/)
          .expect(400,done)
      });
    })

    describe("without referenceAvis", function() {
      it('replies 400', function (done) {
        api()
          .get('/api/impots/svair')
          .query({ numeroFiscal: 'toto' })
          .expect("content-type", /json/)
          .expect(400,done)
      });
    })

  });
});
