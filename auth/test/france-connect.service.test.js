const {expect, assert} = require('chai')
const nock = require('nock')

const fakeFCResponse = { sub: 'ad421d168ec81bf5d3c968d135c0904506fce807b5aecc6360abdedd4e0f81c2v1',
  given_name: 'Eric',
  family_name: 'Mercier',
  gender: 'male',
  birthdate: '1981-06-23' }

describe('FranceConnectService', () => {
  describe('userinfo', () => {
    let service, Service

    beforeEach(() => {
      nock('https://test.host')
        .get('/api/v1/userinfo')
        .reply(200, fakeFCResponse)
      Service = require('../france-connect.service')
      service = new Service({franceConnectHost: 'test.host'})
    })

    it('should initialize with parameters', () => {
      assert(service.host)
      assert(service.basePath)
      assert(service.baseUrl)
    })

    it('should call FranceConnect', () => {
      return service.userinfo('Bearer 12345').then((info) => {
        expect(info).to.deep.equal(fakeFCResponse)
      }).catch(() => {
        assert(false)
      })
    })
  })
})
