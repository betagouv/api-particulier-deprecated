const expect = require('chai').expect;
const request = require('request');
const serverTest = require('./../../test/utils/server');
const nock = require('nock');
const fs = require('fs');


describe('Admin API', () => {
  var server = serverTest();
  var api = server.api;

  describe("When getting the users", () => {

    describe("when not admin", () => {
      it('replies 403', function (done) {
        api()
          .get('/api/admin/users')
          .expect(403,done)
      });
    })

    describe("when you are an admin", () => {
      it('replies 200 with the users', (done) => {
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

  describe("When creating the users", () => {

    describe("when not admin", () => {
      it('replies 403', (done) => {
        api()
          .post('/api/admin/users')
          .expect(403,done)
      });
    })

    describe("when you are an admin", () => {
      it('replies 200 with the users', (done) => {

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

  describe("when you delete an user", () => {
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
