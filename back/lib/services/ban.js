"use strict";

const request = require('request') ;
const UrlAssembler = require('url-assembler')
const StandardError = require('standard-error');

class BanService {

  constructor(options) {
    options = options || {}
    const url = options.banBaseUrl || ''
    this.baseUrl = UrlAssembler(url)
  }

  getAdress(query, callback) {
    console.log('baseUrl', JSON.stringify(this.baseUrl))
    var url = this.baseUrl.template('search')
                .query({
                  q: query
                })
                .toString();
    request(url, (err, response) => {
      if(err) return callback(err);
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
