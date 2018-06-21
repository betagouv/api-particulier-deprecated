const {MongoClient} = require('mongodb')

class Mongo {
  async connect () {
    this.client = await MongoClient.connect('mongodb://localhost:27017' || 'mongodb://localhost', {
      reconnectTries: 1
    })
    this.db = this.client.db('api-particulier')
  }

  async disconnect (force) {
    return this.client.close(force)
  }
}

module.exports = new Mongo()
