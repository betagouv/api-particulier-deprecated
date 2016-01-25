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

      describe("when getting the quotient familial data", () => {
        it("return the quotient familiale with the user and the date", (done) => {
          cafService.getQf("toto", "tutu", (err, data) => {
            if(err) return done(err)
            expect(data).to.deep.equal({
              quotientFamilial: 345,
              mois: 12,
              annee: 2015,
              allocataires: ["Marine Martin", "Jean Martin"]
            });
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the adress data", () => {
        it("return the adress", (done) => {
          cafService.getAdress("toto", "tutu", (err, data) => {
            if(err) return done(err)
            expect(data).to.deep.equal({
              libelles: [
                "Madame Marine Martin",
                "",
                "",
                "26 Rue Pasteur",
                "",
                "14360 TROUVILLE SUR MER",
                "FRANCE"
              ],
              mois: 12,
              annee: 2015,
              allocataires: ["Marine Martin", "Jean Martin"]
            });
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the family data", () => {
        it("return the family with the parents and the children", (done) => {
          cafService.getFamily("toto", "tutu", (err, data) => {
            if(err) return done(err)
            expect(data).to.deep.equal({
              allocataires: [
                {
                  nomPrenom: "Marine Martin",
                  dateDeNaissance: "17111961",
                  sexe: 'F'
                },
                {
                  nomPrenom: "Jean Martin",
                  dateDeNaissance: "17071959",
                  sexe: 'M'
                }],
              enfants: [
                {
                  nomPrenom: "Marie Martin",
                  dateDeNaissance: "18061996",
                  sexe: 'F'
                },
                {
                  nomPrenom: "Pierre Martin",
                  dateDeNaissance: "23092000",
                  sexe: 'M'
                }
              ]
            });
            nock.cleanAll();
            done()
          });
        })
      })
    })

    describe("when the WS return an error", () => {
      beforeEach(() => {
        cafCall = nock('https://pep-test.caf.fr')
          .post('/sgmap/wswdd/v1')
          .reply(500, httpResponse);
      })

      it("return an error",(done) => {
        cafService.getData("toto", "tutu", "droits", false, (err, data) => {
          cafCall.done();
          expect(err).to.deep.equal(new Error("Request error"));
          expect(err.message).to.deep.equal("Request error");
          expect(data).to.deep.equal(undefined);
          nock.cleanAll();
          done()
        });
      })

      describe("when getting the quotient familial data", () => {
        it("return the quotient familiale with the user and the date", (done) => {
          cafService.getQf("toto", "tutu", (err, data) => {
            expect(err).to.deep.equal(new Error("Request error"));
            expect(err.message).to.deep.equal("Request error");
            expect(data).to.deep.equal(undefined);
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the adress data", () => {
        it("return an error", (done) => {
          cafService.getAdress("toto", "tutu", (err, data) => {
            expect(err).to.deep.equal(new Error("Request error"));
            expect(err.message).to.deep.equal("Request error");
            expect(data).to.deep.equal(undefined);
            nock.cleanAll();
            done()
          });
        })
      })

      describe("when getting the family data", () => {
        it("return an error", (done) => {
          cafService.getFamily("toto", "tutu", (err, data) => {
            expect(err).to.deep.equal(new Error("Request error"));
            expect(err.message).to.deep.equal("Request error");
            expect(data).to.deep.equal(undefined);
            nock.cleanAll();
            done()
          });
        })
      })
    })

  })


});
