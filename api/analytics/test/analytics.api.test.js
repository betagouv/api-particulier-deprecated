const nock = require('nock')
const serverTest = require('./../../test/utils/server')

describe('Analytics API', () => {
  var server = serverTest()
  var api = server.api
  const indexPattern = 'logstash-apiparticulier-*'

  describe('When requesting /analytics/requestsLast30days', () => {
    describe('and ElasticSearch replies successfully', () => {
      it('replies json data', (done) => {
        nock('http://es.infra.gouv.fr:9203')
          .post('/' + indexPattern + '/_count')
          .reply(200, { count: 291 })

        api()
          .get('/api/analytics/requestsLast30days')
          .expect('content-type', /json/)
          .expect(200, done)
      })
    })
    describe('and ElasticSearch fails', () => {
      it('replies a 500', (done) => {
        nock('http://es.infra.gouv.fr:9203')
          .post('/' + indexPattern + '/_count')
          .reply(500, { error: 500 })

        api()
          .get('/api/analytics/requestsLast30days')
          .expect('content-type', /json/)
          .expect(500, done)
      })
    })
  })
})
