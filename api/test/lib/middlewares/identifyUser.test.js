'use strict'

const expect = require('chai').expect
const middleware = require('../../../lib/middlewares/identifyUser')
const sinon = require('sinon')

describe('Middleware : identifyUser', () => {
  describe('when the user is in the headers', () => {
    var request = {
      headers: {'X-User': 'toto'}
    }
    it('add the user to the request', () => {
      var next = sinon.spy()

      middleware(request, null, next)

      expect(request.user).to.equal('toto')
      expect(next.calledOnce).to.be.true
    })
  })

  describe('when the user is in the query parameters', () => {
    var request = {
      headers: {},
      query: {
        user: 'toto'
      }
    }
    it('add the user to the request', () => {
      var next = sinon.spy()

      middleware(request, null, next)

      expect(request.user).to.equal('toto')
      expect(next.calledOnce).to.be.true
    })
  })

  describe('when no user is given', () => {
    var request = {
      headers: {},
      query: {}
    }
    it('add the user to the request', () => {
      var next = sinon.spy()

      middleware(request, null, next)

      expect(request.user).to.equal('Anonymous')
      expect(next.calledOnce).to.be.true
    })
  })
})
