'use strict'

const deep = require('deep-get-set')
const expect = require('chai').expect
const Service = require('../analytics.service')
const nock = require('nock')

describe('Analytics service', () => {
  let service
  let options
  const indexBase = 'logstash-apiparticulier-'
  const indexPattern = `${indexBase}*`
  const response = {
    'count': 291,
    '_shards': {
      'total': 75,
      'successful': 75,
      'failed': 0
    }
  }
  const errorResponse =
    {
      'error': {
        'root_cause': []
      },
      'status': 400
    }

  beforeEach(() => {
    options = {
      es: {
        host: 'http://es.infra.gouv.fr:9203',
        index: indexPattern
      }
    }
    service = new Service(options)
  })
  describe('when getting the 30 days real request', () => {
    it('return the count of the successful incoming requests', () => {
      nock('http://es.infra.gouv.fr:9203')
        .post('/' + indexPattern + '/_count', (body) => {
          return body.query.bool.must[0].range['status-code'].gte === 200
              && body.query.bool.must[0].range['status-code'].lt === 400
        })
        .reply(200, response)

      return service.getRequestFromtheLastXdays(31).then((result) => {
        expect(result).to.equal(291)
      })
    })

    it('return the count of the request in a 31 days', () => {
      nock('http://es.infra.gouv.fr:9203')
        .post('/' + indexPattern + '/_count', (body) => {
          return body.query.bool.must[1].range['@timestamp'].gte === 'now-31d'
        })
        .reply(200, response)

      return service.getRequestFromtheLastXdays(31).then((result) => {
        expect(result).to.equal(291)
      })
    })

    it('return the count of the request excluding uptimerobot', () => {
      nock('http://es.infra.gouv.fr:9203')
        .post('/' + indexPattern + '/_count', (body) => {
          return body.query.bool.must_not[0].term['consumer.user'] === 'uptimerobot'
        })
        .reply(200, response)

      return service.getRequestFromtheLastXdays(31).then((result) => {
        expect(result).to.equal(291)
      })
    })
  })
  describe('when ES return an error', () => {
    it('return the count of the incomming request', () => {
      nock('http://es.infra.gouv.fr:9203')
        .post('/' + indexPattern + '/_count')
        .reply(400, errorResponse)

      return service.getRequestFromtheLastXdays(31).then((result) => {
        throw new Error('Should return an error')
      }).catch((err) => {
        expect(err.message).to.equal('Bad Request')
      })
    })
  })
})
