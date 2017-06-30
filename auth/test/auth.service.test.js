const {expect} = require('chai')
const proxyrequire = require('proxyquire')

describe('Auth service', () => {
  describe('db tokens', () => {
    describe('I have a good token', () => {
      const consumer = {
        _id: 'test',
        name: 'test',
        email: 'test@test.test'
      }
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../token', {
          './db-tokens.service': class FakeTokenService {
            constructor(options) {}
            initialize() {
              return Promise.resolve(this)
            }
            getToken() {
              return Promise.resolve(consumer)
            }
          }
        })
        service = new Auth({tokenService: 'db'})
      })

      it('should set consumer on req', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }

        return service.canAccessApi(req, {}, function () {}).then(() => {
          expect(req.consumer).to.deep.equal(consumer)
        })
      })
    })

    describe('I have a bad token', () => {
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../token', {
          './db-tokens.service': class FakeTokenService {
            constructor(options) {}
            initialize() {
              return Promise.resolve(this)
            }
            getToken() {
              return Promise.resolve(null)
            }
          }
        })
        service = new Auth({tokenService: 'db'})
      })

      it('should set consumer on req', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }

        return service.canAccessApi(req, {}, function () {}).then(() => {
          expect(req.consumer).to.deep.equal({})
        })
      })
    })
  })

  describe('File tokens', () => {
    describe('I have a good token', () => {
      const consumer = {
        name: 'test',
        email: 'test@test.test'
      }
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../token', {
          './file-tokens.service': class FakeTokenService {
            constructor(options) {}
            initialize() {
              return Promise.resolve(this)
            }
            getToken() {
              return Promise.resolve(consumer)
            }
          }
        })
        service = new Auth({tokenService: 'file'})
      })

      it('should set consumer on req', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }

        return service.canAccessApi(req, {}, function () {}).then(() => {
          expect(req.consumer).to.deep.equal(consumer)
        })
      })
    })

    describe('I have a bad token', () => {
      let Auth, service

      beforeEach(() => {
        Auth = proxyrequire('../token', {
          './file-tokens.service': class FakeTokenService {
            constructor(options) {}
            initialize() {
              return Promise.resolve(this)
            }
            getToken() {
              return Promise.resolve(undefined)
            }
          }
        })
        service = new Auth({tokenService: 'file'})
      })

      it('should set consumer on req', () => {
        const req = {
          get: function (params) { return '' },
          logger: {
            debug: function (params) {}
          }
        }

        return service.canAccessApi(req, {}, function () {}).then(() => {
          expect(req.consumer).to.deep.equal({})
        })
      })
    })
  })
})
