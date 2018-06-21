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

  getConsumer ({ token }) {
    // set defaults
    if (token === null || typeof token === 'undefined') {
      token = ''
    }

    const encryptedToken = crypto.createHash('sha512').update(token).digest('hex')
    return this.collection.findOne({hashed_token: encryptedToken})
  }
}

module.exports = DbTokenService
