const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const crypto = require('crypto')

class DbTokenService {
  constructor (options) {
    this.options = options
    this.mongoConnect = MongoClient.connect(this.options.mongoDbUrl, {})
  }

  initialize () {
    return this.mongoConnect.then((db) => {
      this.collection = db.collection('tokens')
      return this
    })
  }

  getToken (token) {
    const hash = crypto.createHash('sha512')
    hash.update(token)
    const encryptedToken = hash.digest('hex')
    return this.collection.findOne({hashed_token: encryptedToken})
  }
}

module.exports = DbTokenService
