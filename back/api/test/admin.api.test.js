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
          .expect(200, (err, result) => {
            if(err) return done(err);
            var body = result.body;
            expect(body).to.include(
              {
                name: 'test',
                token: '',
                role: 'user'
              })
              expect(body).to.include(
                {
                  name: 'admin',
                  token: 'adminToken',
                  role: 'admin'
                })

            expect(body).to.have.length(2)
            done()
        })
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
                .expect(200, (err, result) => {
                  if(err) return done(err);
                  var body = result.body;
                  expect(body).to.include(user)
                  expect(body).to.have.length(3)
                  done()
              })
            })
      });
    })
  })

  describe("when you delete an user", function () {
    var user = {
      name: 'tge',
      token: 'wsdulfhsdhf',
      role: 'user'
    }
    beforeEach(function(done) {
      api()
        .post('/api/admin/users')
        .set('X-API-Key', 'adminToken')
        .send(user)
        .expect(201, done)
    })

    it('replies 204', function (done) {
      api()
        .delete('/api/admin/users/'+ user.token)
        .set('X-API-Key', 'adminToken')
        .expect(204, function(err) {
            if(err) return done(err);
            api()
              .get('/api/admin/users')
              .set('X-API-Key', 'adminToken')
              .expect(200, (err, result) => {
                if(err) return done(err);
                var body = result.body;
                expect(body).to.not.include(user)
                expect(body).to.have.length(2)
                done()
            })
          })
    });

  });
});
