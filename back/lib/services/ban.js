"use strict";


var request = require('request') ;
var UrlAssembler = require('url-assembler')

class BanService {

  constructor(options) {
    this.baseUrl = UrlAssembler(options.ban.baseUrl)
  }

  getAddress(query, callback) {
    var url = this.baseUrl.template('search')
                .query({
                  q: query
                })
                .toString();
    request(url, (err, response) => {
      if(err) callback(err);
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
