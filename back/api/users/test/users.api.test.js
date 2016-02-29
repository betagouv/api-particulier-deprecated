const expect = require('chai').expect;
const request = require('request');
const serverTest = require('./../../test/utils/server');

describe('User API', function () {
  const server = serverTest();
  const api = server.api;

  describe("When getting the profile", () => {

    it('replies with json and 200', (done) => {
      api()
        .get('/api/users/tge@octo.com')
        .expect("content-type", /json/)
        .expect(200,done)
    });
  });
});
