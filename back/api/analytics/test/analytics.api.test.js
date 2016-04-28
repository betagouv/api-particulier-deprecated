const expect = require('chai').expect;
const serverTest = require('./../../test/utils/server');


describe('Analytics API', () => {
  var server = serverTest();
  var api = server.api;

  describe("When requesting /analytics/requestsLast30days",  () => {
    it('replies json data', (done) => {
      api()
        .get('/api/analytics/requestsLast30days')
        .expect("content-type", /json/)
        .expect(200, done)
    });
  });
});
