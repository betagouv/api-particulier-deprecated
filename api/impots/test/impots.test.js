var expect = require('chai').expect
var proxyquire = require('proxyquire')
var sinon = require('sinon')
var StandardError = require('standard-error')

describe('Impots Controller', function () {
  var impotController

  describe("When the svair doesn't return anything", function () {
    beforeEach(function (done) {
      impotController = proxyquire('../impots.controller', {
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
      var callback = sinon.spy()
      var req = {query: {numeroFiscal: 'toto', referenceAvis: 'titi'}}
      var res = {}
      var controller = new impotController()

      // when
      controller.svair(req, res, function (err) {
        expect(err).to.deep.equal(new StandardError('Some message', {code: 500}))
        done()
      })
    })
  })

  describe('When the svair return Invalid credentials', function () {
    beforeEach(function (done) {
      impotController = proxyquire('../impots.controller', {
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
      var callback = sinon.spy()
      var req = {query: {numeroFiscal: 'toto', referenceAvis: 'titi'}}
      var res = {}
      var controller = new impotController()

      // when
      controller.svair(req, res, function (err) {
        expect(err).to.deep.equal(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404}))
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

      importController = proxyquire('../impots.controller', {
        'svair-api': () => {
          return svairCall
        }
      })
      done()
    })

    it('replies the result', function (done) {
      // given
      var callback = sinon.spy()
      var req = {query: {numeroFiscal: 'toto', referenceAvis: 'titi'}}
      var res = {}
      var controller = new importController()

      // when
      controller.svair(req, { format: callback }, null)
      expect(callback.calledOnce).to.be.true
      done()
    })

    describe('when the numero fiscal has a letter after its 13 numbers', () => {
      it('the service has been called without the last letter', function (done) {
        // given
        var callback = sinon.spy()
        var req = {query: {numeroFiscal: '3578788848943a', referenceAvis: 'titi'}}
        var res = {}
        var controller = new importController()

        // when
        controller.svair(req, { format: callback }, null)
        expect(callback.calledOnce).to.be.true
        expect(svairCall.args[0][0]).to.equal('3578788848943')
        done()
      })

      describe('when there is space in the nuemro fiscal', () => {
        it('remove the space', (done) => {
          // given
          var callback = sinon.spy()
          var req = {query: {numeroFiscal: '3578788848 943a', referenceAvis: 'titi'}}
          var res = {}
          var controller = new importController()

          // when
          controller.svair(req, { format: callback }, null)
          expect(callback.calledOnce).to.be.true
          expect(svairCall.args[0][0]).to.equal('3578788848943')
          done()
        })
      })
    })

    describe('when there is space in the referenceAvis', () => {
      it('remove the space', (done) => {
        // given
        var callback = sinon.spy()
        var req = {query: {numeroFiscal: '35787 88848 943a', referenceAvis: 'ti ti'}}
        var res = {}
        var controller = new importController()

        // when
        controller.svair(req, { format: callback }, null)
        expect(callback.calledOnce).to.be.true
        expect(svairCall.args[0][1]).to.equal('titi')
        done()
      })
    })
  })
})
