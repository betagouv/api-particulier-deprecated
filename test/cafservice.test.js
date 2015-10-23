var expect = require('chai').expect;
var CafService = require('../lib/services/caf')
var fs = require('fs');
var nock = require('nock');



describe('Caf Service', function () {
  var cafService = new CafService({cafHost: 'https://pep-test.caf.fr'});

  var httpResponse = fs.readFileSync(__dirname + '/resources/httpResponse.txt','utf-8');
  var httpError = fs.readFileSync(__dirname + '/resources/httpError.txt','utf-8');
  var pdf = fs.readFileSync(__dirname + '/resources/response.pdf','utf-8');

  describe("get second part of body", function () {

    it('the complete pdf doc', function () {


      var actual = cafService.getSecondPart(httpResponse);
      expect(actual).to.be.equal(pdf)
    });
  });

  describe("get certificat answer", function() {
    it("return the pdf",function(done) {
      var cafCall = nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1', function(body){
           return body.indexOf("<codeOrganisme>toto</codeOrganisme>") >= 0 &&
            body.indexOf("<matricule>tutu</matricule>") >= 0
        })
        .reply(200, httpResponse);

      var stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
      var actual = cafService.attestation("toto", "tutu", function(err, data){
        if(err) return done(err)
        cafCall.done();
        expect(data).to.be.equal(pdf);
        nock.cleanAll();
        done()
      });

    })
  })

  describe("when the WS return an http error", function() {
    it("return the pdf",function(done) {
      var cafCall = nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1')
        .reply(500, "");

      var stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
      var actual = cafService.attestation("toto", "tutu", function(err, data){
        cafCall.done();
        nock.cleanAll();
        if(err) return done()
        done(new Error("Le service n'a pas retourné d'erreur"))
      });

    })
  })

  describe("when the WS return an SOAP error", function() {
    it("return the pdf",function(done) {
      var cafCall = nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1')
        .reply(200, httpError);
      var stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
      var actual = cafService.attestation("toto", "tutu", function(err, data){
        cafCall.done();
        nock.cleanAll();
        if(err) return done()
        done(new Error("Le service n'a pas retourné d'erreur"))
      });

    })
  })

});
