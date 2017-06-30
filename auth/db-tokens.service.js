const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

class DbTokenService {
  constructor (options) {
    this.options = options
    this.mongoConnect = MongoClient.connect(this.options.mongoDbUrl, {})
  }

  initialize() {
    return this.mongoConnect.then((db) => {
      this.collection = db.collection('tokens')
      return this
    })
  }

  getToken (token) {
    return this.collection.findOne({_id: token})
  }
}

module.exports = DbTokenService
