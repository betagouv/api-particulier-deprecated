const expect = require('chai').expect
const middleware = require('../../../lib/middlewares/scopeAuthorization')
const sinon = require('sinon')

const fakeResponses = require('./fakeResponses')
const impotsSvairResponse = fakeResponses.impotsSvairResponse
const cafFamilleResponse = fakeResponses.cafFamilleResponse
const cafQuotientFamilialResponse = fakeResponses.cafQuotientFamilialResponse

describe('Middleware : scopeAuthorization', () => {
  describe('the user requests the impots/svair endpoint', () => {
    const res = {
      data: impotsSvairResponse
    }

    it('should let pass dgfip svair data', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['dgfip_avis_imposition']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.deep.equal(impotsSvairResponse)
    })

    it('should whitelist data', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['dgfip_avis_imposition']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()
      const responseWithAdditionalData = JSON.parse(JSON.stringify(impotsSvairResponse))
      responseWithAdditionalData['more'] = true
      responseWithAdditionalData.declarant1['more'] = true
      const resWithAdditionalData = Object.assign({}, res)
      resWithAdditionalData.data = responseWithAdditionalData

      middleware(req, resWithAdditionalData, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.deep.equal(impotsSvairResponse)
    })

    it('should not let pass dgfip svair request if there is no scope "dgfip"', () => {
      const req = {
        consumer: {
          scopes: []
        }
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args[0].code).to.eq(403)
    })
  })

  describe('the user requests the caf/famille endpoint', () => {
    const res = {
      data: cafFamilleResponse
    }

    it('should let pass caf famille request', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['cnaf_attestation_droits']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.deep.equal(cafFamilleResponse)
    })

    it('should remove additionnal properties with "cnaf_quotient_familial" scope', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['cnaf_quotient_familial']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(res.data).to.deep.equal(cafQuotientFamilialResponse)
    })

    it('should not let pass caf famille request if there is no scope "caf"', () => {
      const req = {
        consumer: {
          scopes: []
        }
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args[0].code).to.eq(403)
    })
  })

  describe('the user requests the caf/famille endpoint with multiple scopes', () => {
    const res = {
      data: cafFamilleResponse
    }

    it('should let pass cnaf_attestation_droits request with dgfip scopes', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['dgfip_avis_imposition', 'dgfip_adresse', 'cnaf_attestation_droits']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.deep.equal(cafFamilleResponse)
    })

    it('should let pass cnaf_attestation_droits request with cnaf_quotient_familial', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test',
        scopes: ['cnaf_quotient_familial', 'cnaf_attestation_droits']
      }
      const req = {
        consumer: consumer
      }
      const next = sinon.spy()

      middleware(req, res, next)

      expect(next.getCall(0).args.length).to.equal(0)
      expect(res.data).to.deep.equal(cafFamilleResponse)
    })
  })
})
