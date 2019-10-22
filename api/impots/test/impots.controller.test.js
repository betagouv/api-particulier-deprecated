var sinonChai = require('sinon-chai')
var chai = require('chai')
chai.use(sinonChai)
chai.should()
var expect = chai.expect
var assert = chai.assert
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var StandardError = require('standard-error')

describe('Impots Controller', function () {
  var ImpotController

  describe("When the svair doesn't return anything", function () {
    beforeEach(function (done) {
      ImpotController = proxyquire('../impots.controller', {
        'svair-api': () => {
          return function svairApiFake (numeroFiscal, referenceAvis, done) {
            done({error: true, message: 'Some message'}, '')
          }
        }
      })
      done()
    })

    it('replies 500', function (done) {
      // given
      var req = {query: {numeroFiscal: 'toto', referenceAvis: 'titi'}}
      var res = {}
      var controller = new ImpotController()

      // when
      controller.svair(req, res, function (err) {
        expect(err).to.deep.equal(new StandardError('Some message', {code: 500, scope: 'dgfip'}))
        done()
      })
    })
  })

  describe('When the svair return Invalid credentials', function () {
    beforeEach(function (done) {
      ImpotController = proxyquire('../impots.controller', {
        'svair-api': () => {
          return function svairApiFake (numeroFiscal, referenceAvis, done) {
            done({error: true, message: 'Invalid credentials'}, '')
          }
        }
      })
      done()
    })

    it('replies 404', function (done) {
      // given
      var req = {query: {numeroFiscal: 'toto', referenceAvis: 'titi'}}
      var res = {}
      var controller = new ImpotController()

      // when
      controller.svair(req, res, function (err) {
        expect(err).to.deep.equal(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404, scope: 'dgfip'}))
        done()
      })
    })
  })

  describe('When the svair return the result', function () {
    var svairCall

    beforeEach(function (done) {
      svairCall = sinon.spy(function svairApiFake (numeroFiscal, referenceAvis, done) {
        done(null, {result: 'tutu'})
      })

      ImpotController = proxyquire('../impots.controller', {
        'svair-api': () => {
          return svairCall
        }
      })
      done()
    })

    it('replies the result', function (done) {
      // given
      var req = {query: {numeroFiscal: 'toto', referenceAvis: 'titi'}}
      var res = {}
      var controller = new ImpotController()

      // when
      controller.svair(req, res, function () {})
      assert(res.data)
      done()
    })

    describe('when the numero fiscal has a letter after its 13 numbers', () => {
      it('the service has been called without the last letter', function (done) {
        // given
        var res = {}
        var req = {query: {numeroFiscal: '3578788848943a', referenceAvis: 'titi'}}
        var controller = new ImpotController()

        // when
        controller.svair(req, res, function () {})
        assert(res.data)
        expect(svairCall.args[0][0]).to.equal('3578788848943')
        done()
      })

      describe('when there are spaces in the numero fiscal', () => {
        it('remove the space', (done) => {
          // given
          var res = {}
          var req = {query: {numeroFiscal: '35787 88 848 943a', referenceAvis: 'titi'}}
          var controller = new ImpotController()

          // when
          controller.svair(req, res, function () {})
          assert(res.data)
          expect(svairCall.args[0][0]).to.equal('3578788848943')
          done()
        })
      })
    })

    describe('when there is space in the referenceAvis', () => {
      it('remove the space', (done) => {
        // given
        var res = {}
        var req = {query: {numeroFiscal: '35787 88848 943a', referenceAvis: 'ti ti'}}
        var controller = new ImpotController()

        // when
        controller.svair(req, res, function () {})
        assert(res.data)
        expect(svairCall.args[0][1]).to.equal('titi')
        done()
      })
    })
  })

  describe('authorize', () => {
    const ImpotController = require('../impots.controller')
    const controller = new ImpotController()

    describe('with authType FranceConnect', () => {
      it('should let pass if names are good', () => {
        const req = { authType: 'FranceConnect', consumer: { name: 'Bar Foo' } }
        const res = {
          data: {
            declarant1: { nom: 'Foo', prenoms: 'Bar' },
            declarant2: { nom: 'Foo', prenoms: 'Foo' }
          }
        }
        const nextSpy = sinon.spy()

        controller.authorize(req, res, nextSpy)
        expect(nextSpy.getCall(0).args[0]).to.be.undefined
      })

      it('should not let pass if names are wrong', () => {
        const req = { authType: 'FranceConnect', consumer: { name: 'boom' } }
        const res = {
          data: {
            declarant1: { nom: 'Foo', prenoms: 'Bar' },
            declarant2: { nom: 'Foo', prenoms: 'Foo' }
          }
        }
        const nextSpy = sinon.spy()

        controller.authorize(req, res, nextSpy)
        nextSpy.getCall(0).args[0].message.should.equals('You are forbidden to access this resource')
      })
    })
  })
})
