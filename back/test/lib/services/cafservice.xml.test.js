"use strict";

const expect = require('chai').expect;
const CafService = require('../../../lib/services/caf')
const fs = require('fs');
const nock = require('nock');
const httpJson = require('./../../resources/caf/xml/response.json')



describe('Caf Service', () => {
  var cafService = new CafService({
    cafHost: 'https://pep-test.caf.fr',
    cafSslCertificate: __dirname + '/../../resources/server.csr',
    cafSslKey: __dirname + '/../../resources/server.key'
  });

  const httpResponse = fs.readFileSync(__dirname + '/../../resources/caf/xml/httpResponse.txt','utf-8');
  const xml = fs.readFileSync(__dirname + '/../../resources/caf/xml/httpResponse.xml','utf-8');


  describe("get first part of body", () => {
    it('the first xml', () => {
      var actual = cafService.getFirstPart(httpResponse);
      expect(actual).to.be.equal(xml)
    });
  });

  describe("when requesting the droits xml", () => {
    let cafCall
    describe("when the WS return the correct data", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1', function(body){
             return body.indexOf("<codeOrganisme>toto</codeOrganisme>") >= 0 &&
             body.indexOf("<matricule>tutu</matricule>") >= 0 &&
             body.indexOf("<typeEnvoi>4</typeEnvoi>") >= 0 &&
              body.indexOf("<typeDocument>4</typeDocument>") >= 0
          })
          .reply(200, httpResponse);
      })

      it("return the data",(done) => {
        cafService.getData("toto", "tutu", "droits", false, (err, data) => {
          if(err) return done(err)
          cafCall.done();
          expect(data).to.deep.equal(httpJson);
          nock.cleanAll();
          done()
        });
      })
    })
  })
});
