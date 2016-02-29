"use strict";

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const StandardError = require('standard-error');
const banResult = require('./../../test/resources/adresses');
const svairResult = require('./../../test/resources/svair');
const expectedResponse = require('./../../test/resources/adressesWithDeclarant');

describe('Svair Ban Service', function () {
  let SvairBanService;

  describe("When everything works", () => {

    beforeEach(function(done) {
      SvairBanService = proxyquire('../svairBan.service', {
        'svair-api': function() {
          return function svairApiFake(numeroFiscal, referenceAvis, callback) {
            callback(null, svairResult)
          }
        },
        './../ban/ban.service': function FakeBanService() {
          this.getAdress = function fakeGetAdress(query, callback) {
            callback(null, banResult)
          }
        }
      });
      done()
    })

    it('replies the adress with the persons', function (done) {
      //given
      const svairBanService = new SvairBanService({ svairHost:''})

      //when
      svairBanService.getAdress( 23, 34, function(err, data) {
        console.log(err)
        expect(err).to.not.exist
        expect(data).to.deep.equal(expectedResponse)
        done();
      })
    });
  });
});
