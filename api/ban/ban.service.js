'use strict'

const request = require('request')
const UrlAssembler = require('url-assembler')

class BanService {
  constructor (options) {
    options = options || {}
    const url = (options.ban || {}).baseUrl || ''
    this.baseUrl = UrlAssembler(url)
  }

  getAdress (query, callback) {
    var url = this.baseUrl.template('search')
                .query({
                  q: query
                })
                .toString()
    request(url, (err, response) => {
      if (err) return callback(err)
      const adresses = JSON.parse(response.body).features.map((item) => {
        let adresse = item.properties
        delete adresse.id
        return {
          adresse,
          geometry: item.geometry
        }
      })
      callback(null, adresses)
    })
  }
}

module.exports = BanService
