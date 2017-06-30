const { ping, injectClient, fetch } = require('api-caf/lib/components')
const fs = require('fs')
const path = require('path')
const proxyrequire = require('proxyquire');
const {expect} = require('chai')
const CafController = require('../caf.controller')
const fakeResponse = require('../fake-response')
const { ClientError } = require('api-caf/lib/client')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
require('chai').use(sinonChai);

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
          fetch: sinon.spy(),
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

  describe('fetch', () => {
    const fetchSpy = sinon.spy()
    const CafControllerStubbed = proxyrequire(
      '../caf.controller', {
        'api-caf/lib/components': {
          injectClient: sinon.spy(),
          ping: sinon.spy(),
          fetch: function (param) {
            return function (req, res, next) { fetchSpy() }
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

    it('calls the api-caf fetch', () => {
      controller.famille({}, {}, function () {})
      expect(fetchSpy.calledOnce).to.equal(true)
    })
  })

  describe('prepare', () => {
    describe('without caStub option', () => {
      const injectClientSpy = sinon.spy()
      const CafControllerStubbed = proxyrequire(
        '../caf.controller', {
          'api-caf/lib/components': {
            injectClient: injectClientSpy,
            fetch: sinon.spy(),
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
        cafPingParams: cafPingParams,
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
})
