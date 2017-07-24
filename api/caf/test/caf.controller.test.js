/* eslint prefer-promise-reject-errors: "off" */

const fs = require('fs')
const path = require('path')
const proxyrequire = require('proxyquire')
const {expect} = require('chai')
const CafController = require('../caf.controller')
// const StandardError = require('standard-error')
const fakeResponse = require('../fake-responses')[0].response
const { ClientError } = require('api-caf/lib/client')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')
chai.use(sinonChai)
chai.should()

describe('CAF controller', () => {
  const cafPingParams = { codePostal: '00000', numeroAllocataire: '0000000' }
  const cafHost = 'https://pep-test.caf.fr'
  const cafSslKey = path.join(__dirname, '../../test/resources/server.key')
  const cafSslCertificate = path.join(__dirname, '../../test/resources/server.crt')

  describe('ping', () => {
    const pingSpy = sinon.spy()
    const CafControllerStubbed = proxyrequire(
      '../caf.controller', {
        'api-caf/lib/components': {
          injectClient: sinon.spy(),
          ping: function (param) {
            return function (req, res, next) { pingSpy() }
          }
        }
      }
    )
    const controller = new CafControllerStubbed({
      cafPingParams: cafPingParams,
      cafHost: cafHost,
      cafSslCertificate: cafSslCertificate,
      cafSslKey: cafSslKey
    })

    it('calls the api-caf ping', () => {
      controller.ping({}, {}, function () {})
      expect(pingSpy.calledOnce).to.equal(true)
    })
  })

  describe('famille', () => {
    const CafControllerStubbed = proxyrequire(
      '../caf.controller', {
        'api-caf/lib/components': {
          injectClient: sinon.spy(),
          ping: sinon.spy()
        },
        './../lib/utils/format': function (res, data) {
          res.body = data
          return Promise.resolve(data)
        }
      }
    )
    const controller = new CafControllerStubbed({
      cafPingParams: cafPingParams,
      cafHost: cafHost,
      cafSslCertificate: cafSslCertificate,
      cafSslKey: cafSslKey
    })

    it('returns an error with no parameters', () => {
      const nextSpy = sinon.spy()

      controller.famille({ query: {} }, {}, nextSpy)

      expect(nextSpy.calledOnce).to.have.been.equal(true)
      // expect(nextSpy).to.have.deep.been.calledWith(
      //   new StandardError(
      //     'Les paramètres `codePostal` et `numeroAllocataire` sont obligatoires',
      //     {code: 400}
      //   )
      // )
    })

    it('return the result with good parameters', () => {
      const req = {
        query: { numeroAllocataire: '12345', codePostal: '43567' },
        client: {
          getAll: function (codePostal, numeroAllocataire) {
            return Promise.resolve(fakeResponse)
          }
        }
      }
      const res = {}

      return controller.famille(req, res, function () {}).then(() => {
        expect(res.data).to.deep.equal(fakeResponse)
      })
    })

    it('return the error from caf', () => {
      const nextSpy = sinon.spy()
      const req = {
        query: { numeroAllocataire: '12345', codePostal: '43567' },
        client: {
          getAll: function (codePostal, numeroAllocataire) {
            return Promise.reject({message: 'error', code: '500'})
          }
        }
      }
      const res = {}

      return controller.famille(req, res, nextSpy).then(() => {
        expect(nextSpy.calledOnce).to.have.been.equal(true)
      })
    })
  })

  describe('prepare', () => {
    describe('without caStub option', () => {
      const injectClientSpy = sinon.spy()
      const CafControllerStubbed = proxyrequire(
        '../caf.controller', {
          'api-caf/lib/components': {
            injectClient: injectClientSpy,
            ping: sinon.spy()
          }
        }
      )
      const controller = new CafControllerStubbed({
        cafPingParams: cafPingParams,
        cafHost: cafHost,
        cafSslCertificate: cafSslCertificate,
        cafSslKey: cafSslKey
      })

      it('returns an api-caf client', () => {
        controller.prepare()

        expect(injectClientSpy.calledOnce).to.equal(true)
        expect(injectClientSpy).to.have.been.calledWith({
          host: cafHost,
          cert: fs.readFileSync(cafSslCertificate),
          key: fs.readFileSync(cafSslKey)
        })
      })
    })

    describe('with caStub option', () => {
      const controller = new CafController({
        cafStub: true,
        cafPingParams: cafPingParams
      })
      const req = {}
      const res = {}
      const next = function () {}
      let codePostal = '99148'
      let numeroAllocataire = '0000354'

      it('returns a stub with good input', () => {
        controller.prepare()(req, res, next)

        return req.client.getAll(codePostal, numeroAllocataire).then((response) => {
          expect(response).to.deep.equal(fakeResponse)
        })
      })

      it('rejects with invalid params', () => {
        codePostal = '48'
        numeroAllocataire = '0000354'

        controller.prepare()(req, res, next)

        return req.client.getAll(codePostal, numeroAllocataire).catch((response) => {
          expect(response).to.deep.equal(new ClientError(133))
        })
      })
    })
  })

  describe('authorize', () => {
    const controller = new CafController({
      cafStub: true,
      cafPingParams: cafPingParams
    })
    describe('with authType FranceConnect', () => {
      let nextSpy
      ['Jean Dupont', 'Marie Dupont', 'Lucie Dupont'].forEach((name) => {
        it('sould let pass with fake user ' + name, () => {
          const req = { authType: 'FranceConnect', consumer: { name } }
          const res = { data: fakeResponse }
          nextSpy = sinon.spy()

          controller.authorize(req, res, nextSpy)
          expect(nextSpy.getCall(0).args[0]).to.be.undefined
        })
      })

      it('sould not let pass if wrong user', () => {
        const req = { authType: 'FranceConnect', consumer: {name: 'boom'} }
        const res = { data: fakeResponse }
        const nextSpy = sinon.spy()

        controller.authorize(req, res, nextSpy)
        nextSpy.getCall(0).args[0].message.should.equals('You are forbidden to access this resource')
      })
    })
  })
})
