"use strict";

var expect = require('chai').expect;
var CafService = require('../lib/services/caf')
var fs = require('fs');
var nock = require('nock');



describe('Caf Service', function () {
  var cafService = new CafService({
    cafHost: 'https://pep-test.caf.fr',
    cafSslCertificate: __dirname + '/resources/server.csr',
    cafSslKey: __dirname + '/resources/server.key'
  });

  var httpResponse = fs.readFileSync(__dirname + '/resources/httpResponse.txt','utf-8');
  var httpError = fs.readFileSync(__dirname + '/resources/httpError.txt','utf-8');
  var pdf = fs.readFileSync(__dirname + '/resources/response.pdf','utf-8');
  var pdfBuffer = fs.readFileSync(__dirname + '/resources/response.pdf');


  describe("get second part of body", function () {
    it('the complete pdf doc', function () {
      var actual = cafService.getSecondPart(httpResponse);
      expect(actual).to.be.equal(pdf)
    });
  });

  describe("when requesting the quotient familiale pdf", () => {
    let cafCall
    describe("when the WS return the correct data", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1', function(body){
             return body.indexOf("<codeOrganisme>toto</codeOrganisme>") >= 0 &&
             body.indexOf("<matricule>tutu</matricule>") >= 0 &&
             body.indexOf("<typeEnvoi>3</typeEnvoi>") >= 0 &&
              body.indexOf("<typeDocument>2</typeDocument>") >= 0
          })
          .reply(200, httpResponse);
      })

      it("return the pdf",(done) => {
        const stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
        cafService.attestation("toto", "tutu", "qf",function(err, data){
          if(err) return done(err)
          cafCall.done();
          expect(data).to.deep.equal(pdfBuffer);
          nock.cleanAll();
          done()
        });
      })
    })

    describe("when the WS return an http error", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(500, "");
      })

      it("return an error", (done) => {
        const stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
        cafService.attestation("toto", "tutu", "qf", function(err, data){
          cafCall.done();
          nock.cleanAll();
          if(err) return done()
          done(new Error("Le service n'a pas retourné d'erreur"))
        });
      })
    })

    describe("when the WS return an SOAP error", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(200, httpError);
      })

      it("return the pdf",(done) => {
        const stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
        cafService.attestation("toto", "tutu", "qf", function(err, data){
          cafCall.done();
          nock.cleanAll();
          if(err) return done()
          done(new Error("Le service n'a pas retourné d'erreur"))
        });
      })
    })
  })

  describe("when requesting the droits pdf", () => {
    let cafCall
    describe("when the WS return the correct data", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1', function(body){
             return body.indexOf("<codeOrganisme>toto</codeOrganisme>") >= 0 &&
             body.indexOf("<matricule>tutu</matricule>") >= 0 &&
             body.indexOf("<typeEnvoi>3</typeEnvoi>") >= 0 &&
              body.indexOf("<typeDocument>4</typeDocument>") >= 0
          })
          .reply(200, httpResponse);
      })

      it("return the pdf",(done) => {
        const stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
        cafService.attestation("toto", "tutu", "droits", function(err, data){
          if(err) return done(err)
          cafCall.done();
          expect(data).to.deep.equal(pdfBuffer);
          nock.cleanAll();
          done()
        });
      })
    })
  })
});
