const crypto = require('crypto')

const token = 'test-token'
const encryptedToken = crypto.createHmac('sha512', token).digest('hex')

module.exports = {
  data: [
    {
      _id: encryptedToken,
      name: 'Jeu de test',
      mail: 'someone@somewhere.com'
    }
  ]
}
