var expect = require('chai').expect;
var request = require('request');
var serverTest = require('./utils/server');

describe('System API', function () {
  var server = serverTest();
  var api = server.api;

  describe("When requesting /api/ping", function () {
    it('replies json with pong', function (done) {
      api()
        .get('/api/ping')
        .expect("content-type", /json/)
        .expect(200,"\"pong\"",done)
    });
  });

  describe("When requesting a bad route", function () {
    it('replies 404', function (done) {
      api()
        .get('/api/not-existing')
        .expect(404,done)
    });
  });


  describe("When requesting a route with a bad token", function () {
    it('replies 403', function (done) {
      api()
        .get('/api/ping')
        .set('X-API-Key', 'token-nok')
        .expect(401,done)
    });
  });
});
