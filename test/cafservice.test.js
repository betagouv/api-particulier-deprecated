var expect = require('chai').expect;
var CafService = require('../lib/services/caf')
var fs = require('fs');
var nock = require('nock');



describe('Caf Service', function () {
  var cafService;

  beforeEach(function() {
    var cafService = new CafService()
  })

  var httpResponse = fs.readFileSync(__dirname + '/resources/httpResponse.txt','utf-8');
  var httpError = fs.readFileSync(__dirname + '/resources/httpError.txt','utf-8');
  var pdf = fs.readFileSync(__dirname + '/resources/response.pdf','utf-8');

  describe("get second part of body", function () {

    it('the complete pdf doc', function () {

      var cafService = new CafService();
      var actual = cafService.getSecondPart(httpResponse);
      expect(actual).to.be.equal(pdf)
    });
  });

  describe("get certificat answer", function() {
    it("return the pdf",function(done) {
      var cafCall = nock('https://pep-test.caf.fr')
        .post('/sgmap/wswdd/v1')
        .reply(200, httpResponse);

      var cafService = new CafService();
      var stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
      var actual = cafService.attestation(function(err, data){
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

      var cafService = new CafService();
      var stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
      var actual = cafService.attestation(function(err, data){
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
      var cafService = new CafService();
      var stream = fs.writeFileSync(__dirname + '/resources/out.pdf')
      var actual = cafService.attestation(function(err, data){
        cafCall.done();
        nock.cleanAll();
        if(err) return done()
        done(new Error("Le service n'a pas retourné d'erreur"))
      });

    })
  })

});
