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
    const encryptedToken = crypto.createHmac('sha512', token).digest('hex')
    return this.collection.findOne({_id: encryptedToken})
  }
}

module.exports = DbTokenService
