"use strict";


const expect = require('chai').expect;
const BanService = require('./../ban.service')
const nock = require('nock');
const fs = require('fs');


describe('Ban Service', function () {
  const banService = new BanService({
    ban: {
      baseUrl: 'http://adresse.data.gouv.local'
    }
  });

  const resourcePath = __dirname + '/../../test/resources'

  const banResponse = JSON.parse(fs.readFileSync(resourcePath + '/banResponse.json','utf-8'));
  const banExpected = JSON.parse(fs.readFileSync(resourcePath + '/adresses.json','utf-8'));

  describe("getting an adresse", () => {
    it("return the adress",function(done) {
      const banCall = nock('http://adresse.data.gouv.local')
                .get('/search')
                .query({q: '8 bd du port'})
                .reply(200, banResponse);


      banService.getAdress("8 bd du port", (err, data) => {
        if(err) return done(err)
        banCall.done();
        expect(data).to.deep.equal(banExpected)
        nock.cleanAll();
        done();
      });
    })
  })
})
