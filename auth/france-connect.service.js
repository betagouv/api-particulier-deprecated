const request = require('superagent')

module.exports = class FranceConnectService {
  constructor (options) {
    this.host = options.franceConnectHost
    this.basePath = '/api/v1'
    this.baseUrl = 'https://' + this.host + this.basePath
  }

  userinfo (bearer) {
    return request
      .get(this.baseUrl + '/userinfo')
      // .query({schema: 'openid'})
      .set('Authorization', bearer)
      .then((response) => response.body)
  }
}
