"use strict";

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const StandardError = require('standard-error');
const banResult = require('./resources/adresses');
const svairResult = require('./resources/svair');
const expectedResponse = require('./resources/adressesWithDeclarant');
require("stackup")

describe('Svair Ban Service', function () {
  let SvairBanService;

  describe("When everything works", () => {

    beforeEach(function(done) {
      SvairBanService = proxyquire('../lib/services/svairBan', {
        'svair-api': function svairApiFake(numeroFiscal, referenceAvis, callback) {
          callback(null, svairResult)
        },
        './ban': function FakeBanService() {
          this.getAdress = function fakeGetAdress(query, callback) {
            callback(null, banResult)
          }
        }
      });
      done()
    })

    it('replies the adress with the persons', function (done) {
      //given
      const svairBanService = new SvairBanService()

      //when
      console.log('svairBanService', JSON.stringify(svairBanService))
      svairBanService.getAdress( 23, 34, function(err, data) {
        expect(err).to.not.exist
        expect(data).to.deep.equal(expectedResponse)
        done();
      })
    });
  });
});
