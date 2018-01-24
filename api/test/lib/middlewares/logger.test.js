'use strict'

const expect = require('chai').expect
const logger = require('../../../lib/middlewares/logger')

describe('Logger', () => {
  it('must exclude a component', () => {
    expect(logger.excludes).to.deep.equal(
      ['req', 'res', 'req-headers', 'res-headers', 'msg', 'url', 'short-body', 'body'])
  })
  describe('the correlation id', () => {
    it('must added', () => {
      const request = {
        id: 'tutu',
        consumer: {},
        headers: {}
      }
      const properties = logger.includesFn(request)
      expect(properties.correlationId).to.equal('tutu')
    })
  })

  describe('the headers', () => {
    it('host must added', () => {
      const request = {
        consumer: {},
        headers: {host: 'titi'}
      }
      const properties = logger.includesFn(request)
      expect(properties.host).to.equal('titi')
    })

    it('realIp must added', () => {
      const request = {
        consumer: {},
        headers: {'x-real-ip': 'titi'}
      }
      const properties = logger.includesFn(request)
      expect(properties.realIp).to.equal('titi')
    })
  })

  describe('query params', () => {
    it('must not be logged', () => {
      const request = {
        consumer: {},
        headers: {host: 'titi'},
        url: 'http://test.host?test=1'
      }
      const properties = logger.includesFn(request)
      expect(properties.url).to.equal('http://test.host')
    })
  })

  describe('the consumer name', () => {
    it('must added', () => {
      const request = {
        consumer: {name: 'toto'},
        headers: {}
      }
      const properties = logger.includesFn(request)
      expect(properties.consumer.organisation).to.equal('toto')
    })
  })

  describe('the user name', () => {
    it('must added', () => {
      const request = {
        consumer: {},
        headers: {},
        user: 'titi'
      }
      const properties = logger.includesFn(request)
      expect(properties.consumer.user).to.equal('titi')
    })
  })

  describe('the url', () => {
    it('must added', () => {
      const request = {
        consumer: {},
        headers: {},
        url: '/toto'
      }
      const properties = logger.includesFn(request)
      expect(properties.url).to.equal('/toto')
    })

    it('must added with the base url', () => {
      const request = {
        consumer: {},
        headers: {},
        url: '/toto',
        baseUrl: 'titi.com'
      }
      const properties = logger.includesFn(request)
      expect(properties.url).to.equal('titi.com/toto')
    })
  })
})
