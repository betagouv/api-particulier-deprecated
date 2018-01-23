const crypto = require('crypto')

const encryptedToken = crypto.createHash('sha512').update('test-token').digest('hex')

module.exports = {
  data: [
    {
      hashed_token: encryptedToken,
      name: 'Jeu de test',
      mail: 'someone@somewhere.com'
    }
  ]
}
