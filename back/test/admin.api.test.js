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

  describe("When creating the users", function () {

    describe("when not admin", function () {
      it('replies 403', function (done) {
        api()
          .post('/api/admin/users')
          .expect(403,done)
      });
    })

    describe("when you are an admin", function () {
      it('replies 200 with the users', function (done) {

        var user = {
          name: 'tge',
          token: 'wsdulfhsdhf',
          role: 'user'
        }
        api()
          .post('/api/admin/users')
          .set('X-API-Key', 'adminToken')
          .send(user)
          .expect(201, function(err) {
              if(err) return done(err);
              api()
                .get('/api/admin/users')
                .set('X-API-Key', 'adminToken')
                .expect(200,
                  [
                    user,
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
            })
      });
    })

    describe("when you create an user", function () {
      it('replies 200 with the users', function (done) {

        var user = {
          name: 'tge',
          token: 'wsdulfhsdhf',
          role: 'user'
        }
        api()
          .post('/api/admin/users')
          .set('X-API-Key', 'adminToken')
          .send(user)
          .expect(201, function(err) {
              if(err) return done(err);
              api()
                .get('/api/admin/users')
                .set('X-API-Key', 'adminToken')
                .expect(200,
                  [
                    user,
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
            })
      });
    })

    describe("when you delete an user", function () {
      it('replies 204', function (done) {
        api()
          .delete('/api/admin/users/test')
          .set('X-API-Key', 'adminToken')
          .expect(204, function(err) {
              if(err) return done(err);
              api()
                .get('/api/admin/users')
                .set('X-API-Key', 'adminToken')
                .expect(200, [ {
                  name: 'admin',
                  token: 'adminToken',
                  role: 'admin'
                } ], done)
            })
      });
    })
  });
});
