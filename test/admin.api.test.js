var expect = require('chai').expect;
var request = require('request');
var serverTest = require('./utils/server');
var nock = require('nock');
var fs = require('fs');


describe('Admin API', function () {
  var server = serverTest();
  var api = server.api;

  describe("When getting the users", function () {

    describe("when not admin", function () {
      it('replies 403', function (done) {
        api()
          .get('/api/admin/users')
          .expect(403,done)
      });
    })

    describe("when you are an admin", function () {
      it('replies 200 with the users', function (done) {
        api()
          .get('/api/admin/users')
          .set('X-API-Key', 'adminToken')
          .expect(200,
            [
              {
                name: 'admin',
                token: 'adminToken',
                role: 'admin'
              },
              {
                name: 'test',
                token: '',
                role: 'user'
              }
            ], done)
      });
    })
  });
});
