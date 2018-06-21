const expect = require('chai').expect
const Service = require('../db-tokens.service')
const testData = require('./mongo.js')
const crypto = require('crypto')

describe('Db Token service', () => {
  const url = 'mongodb://localhost:27017/test-api-particulier'
  const service = new Service({mongoDbUrl: url})
  beforeEach(() => {
    return service.initialize().then((service) => {
      return service.collection.insertMany(testData.data)
    })
  })

  afterEach(() => {
    return service.collection.remove()
  })

  it('initializes with a collection', () => {
    expect(service.collection).not.to.equal(undefined)
  })

  it('gets a token when the token exists', () => {
    const encryptedToken = crypto.createHash('sha512').update('test-token').digest('hex')
    return service.getConsumer({ token: 'test-token' }).then((token) => {
      expect(token).to.deep.equal({
        '_id': token['_id'],
        'hashed_token': encryptedToken,
        'name': 'Jeu de test',
        'mail': 'someone@somewhere.com'
      })
    })
  })

  it('gets null when the token does not exists', () => {
    return service.getConsumer({ token: 'bad-token' }).then((token) => {
      expect(token).to.equal(null)
    })
  })
})
