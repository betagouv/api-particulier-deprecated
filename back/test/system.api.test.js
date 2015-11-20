var expect = require('chai').expect;
var serverTest = require('./utils/server');


describe('System API', () => {
  var server = serverTest();
  var api = server.api;

  describe("When requesting /api/ping",  () => {
    it('replies json with pong in json', (done) => {
      api()
        .get('/api/ping')
        .expect("content-type", /json/)
        .expect(200,"\"pong\"",done)
    });

    it('replies json with pong in xml', (done) => {
      api()
        .get('/api/ping')
        .set('Accept','application/xml')
        .expect("content-type", /xml/)
        .expect(200,/pong/,done)
    });
  });

  describe("When requesting a bad route", () => {
    it('replies 404', function (done) {
      api()
        .get('/api/not-existing')
        .expect(404,done)
    });
  });


  describe("When requesting a route with a bad token", () => {
    it('replies 403', function (done) {
      api()
        .get('/api/ping')
        .set('X-API-Key', 'token-nok')
        .expect(401,done)
    });
  });
});
